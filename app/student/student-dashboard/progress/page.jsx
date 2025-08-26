// app/student/student-dashboard/progress/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentSidebar from "../../../../components/student_components/StudentSidebar";
import { useStudentSidebar } from "../../../utils/hooks/useStudentSidebar";
import { fetchStudentProgress } from "../../../library/services/student_services/student_progress";
import { MODULE_ORDER, QUIZ_MODULE_MAPPING } from "../../../library/helpers/clienthelpers";
export default function StudentProgress() {
  const [progressData, setProgressData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedQuizzes, setExpandedQuizzes] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const {isSidebarOpen, setIsSidebarOpen} = useStudentSidebar();

  const loadProgressData = async (studentId, courseId) => {
    if (!studentId) {
      setError("No student ID found");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetchStudentProgress(studentId, courseId);
      if (response.success) {
        // Process the data to add quiz attempts to modules
        const processedData = processModuleQuizData(response.data);
        setProgressData(processedData);
        console.log("Current progress of site:", processedData);
      } else {
        setError(response.error || "Failed to load progress data");
      }
    } catch (err) {
      console.error("Error loading progress:", err);
      setError("An error occurred while loading progress data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedCourseData = sessionStorage.getItem("courseData");
    const storedStudentData = sessionStorage.getItem("studentData");
    
    if (storedCourseData && storedStudentData) {
      const parsedCourseData = JSON.parse(storedCourseData);
      const parsedStudentData = JSON.parse(storedStudentData);
      
      setCourseData(parsedCourseData);
      setStudentData(parsedStudentData);
      
      // Load progress data once we have the student ID
      if (parsedStudentData?.id) {
        loadProgressData(parsedStudentData.id, parsedCourseData.courses.id);
      }
    } else {
      setError("No student data found in session");
      setIsLoading(false);
    }
  }, []);

  const processModuleQuizData = (data) => {
    const moduleProgress = data.students_progress_data[0]?.module_progress || {};
    const grades = data.students_grade_data || [];
    const courseSettings = data.courses_settings?.[0]?.module_settings || [];
    
    // Parse module settings if it's a string
    let moduleVisibility = {};
    try {
      const settings = typeof courseSettings === 'string' ? JSON.parse(courseSettings) : courseSettings;
      settings.forEach(module => {
        // Extract the module name without the "Module X: " prefix
        const moduleName = module.name.replace(/^(Pre-)?Module\s*\d*:\s*/i, '').trim();
        moduleVisibility[moduleName] = module.visibility === 'Yes';
      });
    } catch (error) {
      console.error('Error parsing module settings:', error);
      // If parsing fails, default to showing all modules
      Object.keys(moduleProgress).forEach(moduleName => {
        moduleVisibility[moduleName] = true;
      });
    }
    
    // Group quiz attempts by module
    const quizAttemptsByModule = {};
    
    grades.forEach((grade, index) => {
      const moduleName = QUIZ_MODULE_MAPPING[grade.quiz_id];
      if (moduleName) {
        if (!quizAttemptsByModule[moduleName]) {
          quizAttemptsByModule[moduleName] = [];
        }
        
        const attemptNumber = quizAttemptsByModule[moduleName].length + 1;
        const percentage = grade.submitted_answers.maxScore > 0 
          ? Math.round((grade.score / grade.submitted_answers.maxScore) * 100)
          : 0;
        
        quizAttemptsByModule[moduleName].push({
          attempt_number: attemptNumber,
          score: percentage,
          raw_score: grade.score,
          max_score: grade.submitted_answers.maxScore,
          date: grade.time_submitted,
          time_taken: grade.time_taken,
          passed: percentage >= 70 // Adjust passing threshold as needed
        });
      }
    });
    
    // Merge quiz attempts into module progress and filter by visibility
    const enhancedModuleProgress = {};
    Object.entries(moduleProgress).forEach(([moduleName, moduleData]) => {
      // Only include modules that are visible
      if (moduleVisibility[moduleName]) {
        enhancedModuleProgress[moduleName] = {
          ...moduleData,
          quiz_attempts: quizAttemptsByModule[moduleName] || []
        };
      }
    });
    
    return {
      ...data,
      module_progress: enhancedModuleProgress,
      student_info: data.students_demographic_data[0] || {},
      module_visibility: moduleVisibility
    };
  };

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const toggleQuizDropdown = (moduleId) => {
    setExpandedQuizzes(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const calculateModuleProgress = (moduleData) => {
    if (!moduleData) return 0;
    // Updated to match your actual data structure
    const components = ['quiz', 'software', 'workbook', 'mini_lecture', 'getting_started', 'introduction_video'];
    const completed = components.filter(comp => moduleData[comp]).length;
    return Math.round((completed / components.length) * 100);
  };

  const calculateOverallProgress = () => {
    if (!progressData?.module_progress) return 0;
    const modules = Object.values(progressData.module_progress);
    const totalProgress = modules.reduce((sum, module) => sum + calculateModuleProgress(module), 0);
    return modules.length > 0 ? Math.round(totalProgress / modules.length) : 0;
  };

  const getStatusColor = (isComplete) => {
    return isComplete ? 'text-green-400' : 'text-gray-500';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 30) return 'bg-yellow-500';
    return 'bg-gray-600';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading progress data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
        <p className="text-red-300 text-lg font-medium mb-2">Unable to Load Progress</p>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  const moduleProgress = progressData?.module_progress || {};
  const studentInfo = progressData?.student_info || {};
  const overallProgress = calculateOverallProgress();
  
  // Sort modules by the defined order, keeping only visible ones
  const sortedModules = MODULE_ORDER.filter(moduleName => moduleProgress[moduleName])
    .map(moduleName => [moduleName, moduleProgress[moduleName]]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <StudentSidebar
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              courseData={courseData}
              studentData={studentData}
            />
            <main className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'ml-0'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {studentInfo.student_first_name && studentInfo.student_last_name
              ? `${studentInfo.student_first_name} ${studentInfo.student_last_name}'s Module Progress`
              : 'My Learning Progress'}
          </h1>
          <p className="text-gray-400">Track your course completion and quiz performance</p>
        </div>

        {/* Overall Progress Card */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Overall Course Progress</h2>
            <span className="text-2xl font-bold text-blue-400">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-full ${getProgressBarColor(overallProgress)} transition-all duration-500`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">
                {Object.values(moduleProgress).filter(m => calculateModuleProgress(m) === 100).length}
              </p>
              <p className="text-sm text-gray-400">Modules Complete</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400">
                {Object.values(moduleProgress).filter(m => calculateModuleProgress(m) > 0 && calculateModuleProgress(m) < 100).length}
              </p>
              <p className="text-sm text-gray-400">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-400">
                {Object.values(moduleProgress).filter(m => calculateModuleProgress(m) === 0).length}
              </p>
              <p className="text-sm text-gray-400">Not Started</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">
                {Object.values(moduleProgress).filter(m => m.quiz).length}
              </p>
              <p className="text-sm text-gray-400">Quizzes Attempted</p>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Module Details</h3>
          <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Modules Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
          {sortedModules.map(([moduleName, moduleData]) => {
            const progress = calculateModuleProgress(moduleData);
            const isExpanded = expandedModules[moduleName];
            const isQuizExpanded = expandedQuizzes[moduleName];
            const isComplete = progress === 100;
            const hasQuizAttempts = moduleData.quiz_attempts && moduleData.quiz_attempts.length > 0;

            return (
              <div
                key={moduleName}
                className={`bg-gray-800 rounded-lg border transition-all duration-200 ${
                  isComplete ? 'border-green-600' : 'border-gray-700'
                } ${viewMode === 'list' ? 'p-6' : 'p-4'}`}
              >
                {/* Module Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {isComplete ? (
                        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : progress > 0 ? (
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="font-semibold text-base">{moduleName}</h3>
                  </div>
                  <button
                    onClick={() => toggleModule(moduleName)}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                  >
                    <svg className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className={progress === 100 ? 'text-green-400' : 'text-gray-400'}>
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full ${getProgressBarColor(progress)} transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Component Status */}
                {(isExpanded || viewMode === 'list') && (
                  <div className="space-y-2 pt-3 border-t border-gray-700">
                    {moduleData.introduction_video !== undefined && (
                      <div className="flex items-center justify-between text-sm">
                        <span className={getStatusColor(moduleData.introduction_video)}>Introduction Video</span>
                        {moduleData.introduction_video ? (
                          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className={getStatusColor(moduleData.mini_lecture)}>Mini Lecture</span>
                      {moduleData.mini_lecture ? (
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className={getStatusColor(moduleData.getting_started)}>Getting Started</span>
                      {moduleData.getting_started ? (
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className={getStatusColor(moduleData.software)}>Interactive Software</span>
                      {moduleData.software ? (
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className={getStatusColor(moduleData.workbook)}>Workbook Activities</span>
                      {moduleData.workbook ? (
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>

                    {/* Quiz Section with Attempts */}
                    <div className="border-t border-gray-700 pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${getStatusColor(moduleData.quiz)}`}>Module Quiz</span>
                          {hasQuizAttempts && (
                            <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full">
                              {moduleData.quiz_attempts.length} {moduleData.quiz_attempts.length === 1 ? 'attempt' : 'attempts'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {moduleData.quiz ? (
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {hasQuizAttempts && (
                            <button
                              onClick={() => toggleQuizDropdown(moduleName)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <svg className={`w-4 h-4 transform transition-transform ${isQuizExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Quiz Attempts Details */}
                      {isQuizExpanded && hasQuizAttempts && (
                        <div className="mt-3 space-y-2 bg-gray-900/50 rounded-lg p-3">
                          <div className="text-xs font-medium text-gray-400 mb-2">Quiz Attempts History</div>
                          {moduleData.quiz_attempts.map((attempt, index) => (
                            <div key={index} className="bg-gray-800 rounded p-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <div className="flex items-center gap-3">
                                  <span className="text-gray-400">Attempt {attempt.attempt_number}</span>
                                  <span className={`font-bold ${getScoreColor(attempt.score)}`}>
                                    {attempt.score}%
                                  </span>
                                  {attempt.passed && (
                                    <span className="bg-green-600/20 text-green-400 px-2 py-0.5 rounded">
                                      Passed
                                    </span>
                                  )}
                                </div>
                                <span className="text-gray-500">{formatDate(attempt.date)}</span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                                <span>Score: {attempt.raw_score}/{attempt.max_score}</span>
                                <span>Time: {formatTime(attempt.time_taken)}</span>
                              </div>
                            </div>
                          ))}
                          {moduleData.quiz_attempts.length > 0 && (
                            <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
                              <div className="flex justify-between">
                                <span>Best Score:</span>
                                <span className={`font-bold ${getScoreColor(Math.max(...moduleData.quiz_attempts.map(a => a.score)))}`}>
                                  {Math.max(...moduleData.quiz_attempts.map(a => a.score))}%
                                </span>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span>Total Attempts:</span>
                                <span>{moduleData.quiz_attempts.length}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {moduleData.completed_at && (
                      <div className="pt-2 mt-2 border-t border-gray-700">
                        <p className="text-xs text-gray-400">
                          Module Completed: {formatDate(moduleData.completed_at)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      </main>
    </div>
  );
}