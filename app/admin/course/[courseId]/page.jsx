// /app/admin/course/[courseId]/page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  ArrowLeft, Users, BookOpen, Award, TrendingUp, Calendar, 
  ChevronDown, ChevronUp, Download, Search, Filter, X,
  CheckCircle, Clock, AlertCircle, User, School, FileText,
  BarChart3, RefreshCw
} from 'lucide-react';

const QUIZ_NAMES = {
  1: "PSVT:R Pre-Test",
  2: "DAT:SR Pre-Test", 
  3: "Math Instrument Pre-Test",
  4: "Combining Solids",
  5: "Surfaces and Solids of Revolution",
  6: "Isometric Drawings and Coded Plans",
  7: "Flat Patterns",
  8: "Rotation of Objects About a Single Axis",
  9: "Reflections and Symmetry",
  10: "Cutting Planes and Cross-Sections",
  11: "Rotation of Objects About Two or More Axes",
  12: "Orthographic Projection",
  13: "Inclined and Curved Surfaces",
  14: "PSVT:R Post-Test",
  15: "DAT:SR Post-Test",
  16: "Math Instrument Post-Test",
  17: "Practice Quiz",
  18: "Mathematics Motivation Survey",
  19: "STEM Attitudes Survey",
  20: "STEM Career Survey"
};

const QUIZ_CATEGORIES = {
  'pre-tests': [1, 2, 3],
  'module-quizzes': [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17],
  'post-tests': [14, 15, 16],
  'surveys': [18, 19, 20]
};

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId;
  const supabase = createClientComponentClient();

  // State
  const [course, setCourse] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);
  const [studentGrades, setStudentGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedProgress, setSelectedProgress] = useState("");
  const [viewMode, setViewMode] = useState('overview'); // overview, progress, quizzes
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    setIsLoading(true);
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      
      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch teacher details
      if (courseData?.course_teacher_id) {
        const { data: teacherData } = await supabase
          .from('teachers')
          .select('*')
          .eq('id', courseData.course_teacher_id)
          .single();
        
        setTeacher(teacherData);
      }

      // Fetch students in this course
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('course_id', courseId)
        .order('student_last_name', { ascending: true });
      
      if (studentsError) throw studentsError;
      setStudents(studentsData || []);

      // Fetch student progress
      const { data: progressData } = await supabase
        .from('students_progress')
        .select('*')
        .eq('course_id', courseId);
      
      setStudentProgress(progressData || []);

      // Fetch student grades (quiz attempts)
      const { data: gradesData } = await supabase
        .from('students_grades')
        .select('*')
        .eq('course_id', courseId)
        .order('time_submitted', { ascending: false });
      
      setStudentGrades(gradesData || []);
      setLastRefresh(new Date());

    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Process student data with progress and grades
  const processedStudents = students.map(student => {
    const progress = studentProgress.find(p => p.student_id === student.id);
    const grades = studentGrades.filter(g => g.student_id === student.id);
    
    // Calculate module progress
    let moduleCompletion = 0;
    let totalModules = 0;
    let moduleDetails = {};
    
    if (progress?.module_progress) {
      const modules = typeof progress.module_progress === 'string' 
        ? JSON.parse(progress.module_progress) 
        : progress.module_progress;
      
      Object.entries(modules).forEach(([moduleId, moduleData]) => {
        totalModules++;
        const components = ['quiz', 'software', 'workbook', 'mini_lecture', 'getting_started'];
        const completed = components.filter(c => moduleData[c] === true).length;
        const percentage = (completed / components.length) * 100;
        
        moduleDetails[moduleId] = {
          ...moduleData,
          percentage,
          isComplete: percentage === 100 || moduleData.completed_at !== null
        };
        
        if (moduleDetails[moduleId].isComplete) {
          moduleCompletion++;
        }
      });
    }
    
    const overallProgress = totalModules > 0 
      ? Math.round((moduleCompletion / totalModules) * 100) 
      : 0;
    
    // Process quiz attempts
    const quizAttempts = {};
    grades.forEach(grade => {
      if (!quizAttempts[grade.quiz_id]) {
        quizAttempts[grade.quiz_id] = [];
      }
      quizAttempts[grade.quiz_id].push({
        score: grade.score,
        submittedAnswers: grade.submitted_answers,
        timeSubmitted: grade.time_submitted,
        timeTaken: grade.time_taken
      });
    });
    
    return {
      ...student,
      progress: progress || {},
      moduleDetails,
      moduleCompletion,
      totalModules,
      overallProgress,
      quizAttempts,
      totalQuizAttempts: grades.length,
      researchConsent: progress?.research_consent || false
    };
  });

  // Filter students
  const filteredStudents = processedStudents.filter(student => {
    let matches = true;
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      matches = matches && (
        student.student_first_name?.toLowerCase().includes(search) ||
        student.student_last_name?.toLowerCase().includes(search) ||
        student.student_username?.toLowerCase().includes(search)
      );
    }
    
    if (selectedGender) {
      matches = matches && student.student_gender === selectedGender;
    }
    
    if (selectedProgress) {
      if (selectedProgress === 'complete') {
        matches = matches && student.overallProgress === 100;
      } else if (selectedProgress === 'in-progress') {
        matches = matches && student.overallProgress > 0 && student.overallProgress < 100;
      } else if (selectedProgress === 'not-started') {
        matches = matches && student.overallProgress === 0;
      }
    }
    
    return matches;
  });

  // Stats calculation
  const stats = {
    totalStudents: students.length,
    activeStudents: processedStudents.filter(s => s.overallProgress > 0).length,
    completedStudents: processedStudents.filter(s => s.overallProgress === 100).length,
    averageProgress: processedStudents.length > 0
      ? Math.round(processedStudents.reduce((sum, s) => sum + s.overallProgress, 0) / processedStudents.length)
      : 0,
    maleCount: students.filter(s => s.student_gender === 'Male').length,
    femaleCount: students.filter(s => s.student_gender === 'Female').length,
    otherCount: students.filter(s => s.student_gender === 'Other').length,
    consentedCount: processedStudents.filter(s => s.researchConsent).length,
    totalQuizAttempts: studentGrades.length
  };

  const downloadCSV = () => {
    const headers = [
      'Username', 'First Name', 'Last Name', 'Gender', 'Age', 'ESL',
      'Progress %', 'Modules Completed', 'Total Quiz Attempts',
      'Research Consent', 'Join Date'
    ];
    
    const rows = filteredStudents.map(student => [
      student.student_username,
      student.student_first_name,
      student.student_last_name,
      student.student_gender || 'N/A',
      student.student_age || 'N/A',
      student.student_esl ? 'Yes' : 'No',
      student.overallProgress,
      `${student.moduleCompletion}/${student.totalModules}`,
      student.totalQuizAttempts,
      student.researchConsent ? 'Yes' : 'No',
      new Date(student.join_date).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `course_${course?.course_name || 'data'}_students.csv`;
    link.click();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressColor = (percentage) => {
    if (percentage === 100) return 'text-green-400';
    if (percentage >= 75) return 'text-blue-400';
    if (percentage >= 50) return 'text-yellow-400';
    if (percentage >= 25) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-600" />
              <div>
                <h1 className="text-xl font-bold">{course?.course_name || course?.course_school_name}</h1>
                <p className="text-sm text-gray-400">
                  Code: {course?.course_join_code} • Teacher: {teacher?.name || course?.course_teacher_name}
                </p>
              </div>
            </div>
            <button
              onClick={fetchCourseData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Course Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">Course Details</p>
                <p className="text-lg font-semibold mt-1">{course?.course_name || 'Unnamed Course'}</p>
                <p className="text-sm text-gray-500">{course?.course_school_name}</p>
              </div>
              <School className="text-blue-400" size={20} />
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">County:</span>
                <span>{course?.course_county || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span>{course?.course_research_type || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Language:</span>
                <span>{course?.course_language || 'English'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
                <p className="text-sm text-gray-500 mt-1">{stats.activeStudents} active</p>
              </div>
              <Users className="text-green-400" size={20} />
            </div>
            <div className="mt-3 flex gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span>{stats.maleCount} Male</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-pink-400 rounded-full" />
                <span>{stats.femaleCount} Female</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full" />
                <span>{stats.otherCount} Other</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">Average Progress</p>
                <p className="text-2xl font-bold">{stats.averageProgress}%</p>
                <p className="text-sm text-gray-500 mt-1">{stats.completedStudents} completed</p>
              </div>
              <TrendingUp className="text-yellow-400" size={20} />
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressBarColor(stats.averageProgress)}`}
                  style={{ width: `${stats.averageProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">Assessments</p>
                <p className="text-2xl font-bold">{stats.totalQuizAttempts}</p>
                <p className="text-sm text-gray-500 mt-1">Total attempts</p>
              </div>
              <FileText className="text-purple-400" size={20} />
            </div>
            <div className="mt-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Research Consent:</span>
                <span>{stats.consentedCount}/{stats.totalStudents}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and View Tabs */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex gap-2">
              {['overview', 'progress', 'quizzes'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex-1 flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search students..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400"
                />
              </div>
              
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="px-3 py-2 bg-gray-700 rounded-md text-white"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              
              <select
                value={selectedProgress}
                onChange={(e) => setSelectedProgress(e.target.value)}
                className="px-3 py-2 bg-gray-700 rounded-md text-white"
              >
                <option value="">All Progress</option>
                <option value="complete">Complete</option>
                <option value="in-progress">In Progress</option>
                <option value="not-started">Not Started</option>
              </select>
              
              <button
                onClick={downloadCSV}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Student Table/Cards */}
        {viewMode === 'overview' && (
          <StudentOverviewTable 
            students={filteredStudents}
            expandedStudent={expandedStudent}
            setExpandedStudent={setExpandedStudent}
          />
        )}
        
        {viewMode === 'progress' && (
          <StudentProgressView 
            students={filteredStudents}
          />
        )}
        
        {viewMode === 'quizzes' && (
          <StudentQuizzesView 
            students={filteredStudents}
            quizNames={QUIZ_NAMES}
          />
        )}
      </div>
    </div>
  );
}

// Student Overview Table Component
function StudentOverviewTable({ students, expandedStudent, setExpandedStudent }) {
  const getProgressBarColor = (percentage) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-800/50 border-b border-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Student</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Demographics</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Progress</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Modules</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Quizzes</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {students.map(student => (
            <React.Fragment key={student.id}>
              <tr className="hover:bg-gray-700/30 transition-colors">
                <td className="px-4 py-3">
                  <button
                    onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                    className="text-left hover:text-blue-400"
                  >
                    <div className="flex items-center gap-2">
                      {Object.keys(student.moduleDetails || {}).length > 0 && (
                        expandedStudent === student.id ? 
                        <ChevronUp size={16} /> : 
                        <ChevronDown size={16} />
                      )}
                      <div>
                        <p className="font-medium">{student.student_first_name} {student.student_last_name}</p>
                        <p className="text-xs text-gray-400">{student.student_username}</p>
                      </div>
                    </div>
                  </button>
                </td>
                
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <p>{student.student_gender || 'N/A'}</p>
                    <p className="text-xs text-gray-400">
                      Age: {student.student_age || 'N/A'}
                      {student.student_esl && ' • ESL'}
                    </p>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-[100px]">
                      <div
                        className={`h-2 rounded-full ${getProgressBarColor(student.overallProgress)}`}
                        style={{ width: `${student.overallProgress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{student.overallProgress}%</span>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <p>{student.moduleCompletion}/{student.totalModules}</p>
                    <p className="text-xs text-gray-400">Completed</p>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <p>{student.totalQuizAttempts}</p>
                    <p className="text-xs text-gray-400">Attempts</p>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    {student.researchConsent && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-600/20 text-green-400">
                        Consented
                      </span>
                    )}
                    {student.overallProgress === 100 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-600/20 text-blue-400">
                        Complete
                      </span>
                    )}
                  </div>
                </td>
              </tr>
              
              {expandedStudent === student.id && (
                <tr>
                  <td colSpan="6" className="px-4 py-3 bg-gray-750/50">
                    <div className="pl-8">
                      <h4 className="text-sm font-semibold mb-2">Module Details</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(student.moduleDetails || {}).map(([moduleId, module]) => (
                          <div key={moduleId} className="bg-gray-700/50 rounded p-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium">Module {moduleId}</span>
                              {module.isComplete ? 
                                <CheckCircle className="w-4 h-4 text-green-400" /> :
                                <Clock className="w-4 h-4 text-gray-400" />
                              }
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-1">
                              <div
                                className={`h-1 rounded-full ${getProgressBarColor(module.percentage)}`}
                                style={{ width: `${module.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Student Progress View Component
function StudentProgressView({ students }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {students.map(student => (
        <div key={student.id} className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold">{student.student_first_name} {student.student_last_name}</h3>
              <p className="text-sm text-gray-400">{student.student_username}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{student.overallProgress}%</p>
              <p className="text-xs text-gray-400">Overall</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {Object.entries(student.moduleDetails || {}).slice(0, 5).map(([moduleId, module]) => (
              <div key={moduleId}>
                <div className="flex justify-between text-xs mb-1">
                  <span>Module {moduleId}</span>
                  <span>{Math.round(module.percentage)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      module.percentage === 100 ? 'bg-green-500' :
                      module.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${module.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Student Quizzes View Component
function StudentQuizzesView({ students, quizNames }) {
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const QUIZ_CATEGORIES = {
    'pre-tests': [1, 2, 3],
    'module-quizzes': [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17],
    'post-tests': [14, 15, 16],
    'surveys': [18, 19, 20]
  };
  
  const getQuizCategory = (quizId) => {
    const id = parseInt(quizId);
    if (QUIZ_CATEGORIES['pre-tests'].includes(id)) return 'pre-tests';
    if (QUIZ_CATEGORIES['module-quizzes'].includes(id)) return 'module-quizzes';
    if (QUIZ_CATEGORIES['post-tests'].includes(id)) return 'post-tests';
    if (QUIZ_CATEGORIES['surveys'].includes(id)) return 'surveys';
    return 'other';
  };
  
  const getCategoryColor = (category) => {
    switch(category) {
      case 'pre-tests': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'module-quizzes': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'post-tests': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'surveys': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };
  
  const formatTimeTaken = (seconds) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Category Filter Tabs */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            All Quizzes
          </button>
          <button
            onClick={() => setSelectedCategory('pre-tests')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'pre-tests'
                ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-400/30'
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            Pre-Tests
          </button>
          <button
            onClick={() => setSelectedCategory('module-quizzes')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'module-quizzes'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-400/30'
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            Module Quizzes
          </button>
          <button
            onClick={() => setSelectedCategory('post-tests')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'post-tests'
                ? 'bg-green-600/20 text-green-400 border border-green-400/30'
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            Post-Tests
          </button>
          <button
            onClick={() => setSelectedCategory('surveys')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'surveys'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-400/30'
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            Surveys
          </button>
        </div>
      </div>
      
      {/* Student Quiz Results */}
      {students.map(student => {
        const hasQuizzes = Object.keys(student.quizAttempts || {}).length > 0;
        
        if (!hasQuizzes) return null;
        
        // Filter quizzes by selected category
        const filteredQuizzes = Object.entries(student.quizAttempts).filter(([quizId]) => {
          if (selectedCategory === 'all') return true;
          return getQuizCategory(quizId) === selectedCategory;
        });
        
        if (filteredQuizzes.length === 0) return null;
        
        const isExpanded = expandedStudent === student.id;
        
        return (
          <div key={student.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <button
              onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <h3 className="font-semibold">{student.student_first_name} {student.student_last_name}</h3>
                  <p className="text-sm text-gray-400">{student.student_username}</p>
                </div>
                <div className="flex gap-2">
                  {Object.entries(student.quizAttempts).map(([quizId]) => {
                    const category = getQuizCategory(quizId);
                    return null; // We'll show badges below
                  })}
                  {QUIZ_CATEGORIES['pre-tests'].some(id => student.quizAttempts[id]) && (
                    <span className="px-2 py-1 rounded text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
                      Pre-Tests
                    </span>
                  )}
                  {QUIZ_CATEGORIES['module-quizzes'].some(id => student.quizAttempts[id]) && (
                    <span className="px-2 py-1 rounded text-xs bg-blue-400/10 text-blue-400 border border-blue-400/30">
                      Modules
                    </span>
                  )}
                  {QUIZ_CATEGORIES['post-tests'].some(id => student.quizAttempts[id]) && (
                    <span className="px-2 py-1 rounded text-xs bg-green-400/10 text-green-400 border border-green-400/30">
                      Post-Tests
                    </span>
                  )}
                  {QUIZ_CATEGORIES['surveys'].some(id => student.quizAttempts[id]) && (
                    <span className="px-2 py-1 rounded text-xs bg-purple-400/10 text-purple-400 border border-purple-400/30">
                      Surveys
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{student.totalQuizAttempts} total attempts</p>
                  <p className="text-xs text-gray-400">{filteredQuizzes.length} {selectedCategory === 'all' ? 'quizzes' : selectedCategory}</p>
                </div>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>
            
            {isExpanded && (
              <div className="p-4 pt-0 space-y-3">
                {/* Group quizzes by category */}
                {selectedCategory === 'all' && (
                  <>
                    {/* Pre-Tests */}
                    {QUIZ_CATEGORIES['pre-tests'].some(id => student.quizAttempts[id]) && (
                      <div className="border border-yellow-400/30 bg-yellow-400/5 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-yellow-400 mb-2">Pre-Tests</h4>
                        <div className="space-y-2">
                          {QUIZ_CATEGORIES['pre-tests'].map(quizId => {
                            const attempts = student.quizAttempts[quizId];
                            if (!attempts) return null;
                            return (
                              <QuizAttemptCard 
                                key={quizId}
                                quizName={quizNames[quizId]}
                                attempts={attempts}
                                category="pre-tests"
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Module Quizzes */}
                    {QUIZ_CATEGORIES['module-quizzes'].some(id => student.quizAttempts[id]) && (
                      <div className="border border-blue-400/30 bg-blue-400/5 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-blue-400 mb-2">Module Quizzes</h4>
                        <div className="space-y-2">
                          {QUIZ_CATEGORIES['module-quizzes'].map(quizId => {
                            const attempts = student.quizAttempts[quizId];
                            if (!attempts) return null;
                            return (
                              <QuizAttemptCard 
                                key={quizId}
                                quizName={quizNames[quizId]}
                                attempts={attempts}
                                category="module-quizzes"
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Post-Tests */}
                    {QUIZ_CATEGORIES['post-tests'].some(id => student.quizAttempts[id]) && (
                      <div className="border border-green-400/30 bg-green-400/5 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-green-400 mb-2">Post-Tests</h4>
                        <div className="space-y-2">
                          {QUIZ_CATEGORIES['post-tests'].map(quizId => {
                            const attempts = student.quizAttempts[quizId];
                            if (!attempts) return null;
                            return (
                              <QuizAttemptCard 
                                key={quizId}
                                quizName={quizNames[quizId]}
                                attempts={attempts}
                                category="post-tests"
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Surveys */}
                    {QUIZ_CATEGORIES['surveys'].some(id => student.quizAttempts[id]) && (
                      <div className="border border-purple-400/30 bg-purple-400/5 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-purple-400 mb-2">Surveys</h4>
                        <div className="space-y-2">
                          {QUIZ_CATEGORIES['surveys'].map(quizId => {
                            const attempts = student.quizAttempts[quizId];
                            if (!attempts) return null;
                            return (
                              <QuizAttemptCard 
                                key={quizId}
                                quizName={quizNames[quizId]}
                                attempts={attempts}
                                category="surveys"
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                {/* Filtered view */}
                {selectedCategory !== 'all' && (
                  <div className={`border rounded-lg p-3 ${getCategoryColor(selectedCategory)}`}>
                    <div className="space-y-2">
                      {filteredQuizzes.map(([quizId, attempts]) => (
                        <QuizAttemptCard 
                          key={quizId}
                          quizName={quizNames[quizId] || `Quiz ${quizId}`}
                          attempts={attempts}
                          category={selectedCategory}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
      
      {students.filter(s => Object.keys(s.quizAttempts || {}).length > 0).length === 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No quiz attempts found for the selected filters.</p>
        </div>
      )}
    </div>
  );
  
  // Helper component for quiz attempts
  function QuizAttemptCard({ quizName, attempts, category }) {
    const formatTimeTaken = (seconds) => {
      if (!seconds) return 'N/A';
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
    };
    
    const bestScore = Math.max(...attempts.map(a => a.score || 0));
    const avgScore = Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length);
    
    return (
      <div className="bg-gray-700/50 rounded p-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-sm font-medium">{quizName}</span>
            <div className="flex gap-4 mt-1">
              <span className="text-xs text-gray-400">{attempts.length} attempts</span>
              <span className="text-xs text-gray-400">Best: {bestScore}%</span>
              <span className="text-xs text-gray-400">Avg: {avgScore}%</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-1 mt-2">
          {attempts.map((attempt, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs bg-gray-800/50 rounded px-2 py-1">
              <span className="text-gray-400">
                Attempt {idx + 1}
              </span>
              <span className="text-gray-500">
                {new Date(attempt.timeSubmitted).toLocaleDateString()}
              </span>
              <span className="text-gray-500">
                {formatTimeTaken(attempt.timeTaken)}
              </span>
              <span className={`font-medium ${
                attempt.score >= 80 ? 'text-green-400' :
                attempt.score >= 60 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {attempt.score}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}