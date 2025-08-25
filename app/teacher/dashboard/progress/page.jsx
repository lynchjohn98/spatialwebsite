"use client";
import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/teacher_components/TeacherSidebar";
import { fetchCourseProgressData } from "../../../library/services/course_actions";
import { ChevronDown, ChevronRight, Check, X, Clock, Award, Download, RefreshCw } from "lucide-react";

export default function StudentProgress() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [quizGrades, setQuizGrades] = useState({});
  const [moduleSettings, setModuleSettings] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedQuizzes, setExpandedQuizzes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedData = sessionStorage.getItem("courseData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setCourseData(parsedData);
      fetchAllData(parsedData.id);
    }
  }, []);

  const fetchAllData = async (courseId) => {
    setIsLoading(true);
    try {
      const response = await fetchCourseProgressData(courseId);
      
      if (response.success) {
        const { students, moduleSettings: modules, progress, grades } = response.data;
        
        setStudentsData(students);
        setModuleSettings(modules);
        
        // Map progress by student_id
        const progressMap = {};
        progress.forEach(p => {
          progressMap[p.student_id] = p.module_progress;
        });
        setProgressData(progressMap);
        
        // Group grades by student_id and quiz_id
        const gradesMap = {};
        grades.forEach(grade => {
          if (!gradesMap[grade.student_id]) {
            gradesMap[grade.student_id] = {};
          }
          if (!gradesMap[grade.student_id][grade.quiz_id]) {
            gradesMap[grade.student_id][grade.quiz_id] = [];
          }
          gradesMap[grade.student_id][grade.quiz_id].push(grade);
        });
        setQuizGrades(gradesMap);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAllData(courseData.id);
  };

  const toggleRowExpansion = (studentId) => {
    setExpandedRows(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const toggleQuizExpansion = (studentId, moduleNum) => {
    const key = `${studentId}-${moduleNum}`;
    setExpandedQuizzes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getCompletionPercentage = (progress) => {
    if (!progress) return 0;
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    Object.values(progress).forEach(module => {
      const tasks = ['getting_started', 'mini_lecture', 'workbook', 'software', 'quiz'];
      tasks.forEach(task => {
        if (module[task] !== undefined) {
          totalTasks++;
          if (module[task] === true) completedTasks++;
        }
      });
    });
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const getModuleCompletionPercentage = (moduleProgress) => {
    if (!moduleProgress) return 0;
    
    const tasks = ['getting_started', 'mini_lecture', 'workbook', 'software', 'quiz'];
    const completedTasks = tasks.filter(task => moduleProgress[task] === true).length;
    
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const formatTime = (seconds) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    // Prepare CSV data
    const csvRows = [];
    csvRows.push(['Student Name', 'Username', 'Overall Progress (%)', 'Modules Completed', 
                  'Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5', 
                  'Module 6', 'Module 7', 'Module 8', 'Module 9', 'Module 10', 'Module 11']);
    
    studentsData.forEach(student => {
      const progress = progressData[student.id];
      const completionPercentage = getCompletionPercentage(progress);
      const modulesCompleted = progress ? 
        Object.values(progress).filter(m => 
          m.getting_started && m.mini_lecture && m.workbook && m.software && m.quiz
        ).length : 0;
      
      const row = [
        `${student.first_name} ${student.last_name}`,
        student.student_username,
        completionPercentage,
        `${modulesCompleted}/${Object.keys(moduleSettings).length || 11}`,
      ];
      
      // Add module percentages
      for (let i = 1; i <= 11; i++) {
        const moduleProgress = progress?.[i];
        row.push(getModuleCompletionPercentage(moduleProgress));
      }
      
      csvRows.push(row);
    });
    
    // Convert to CSV string
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `student_progress_${courseData.course_name}_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  if (isLoading || !courseData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white text-4xl font-bold">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p>Loading Progress Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar
        isSidebarOpen={sidebarOpen}
        setIsSidebarOpen={setSidebarOpen}
        courseData={courseData}
      />
      
      <div className="flex-1 p-6 overflow-auto">
        {/* Header Section */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Student Progress Tracking</h1>
              <p className="text-lg text-blue-300">
                Monitor student progress across all modules and quiz attempts
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors ${
                  isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isRefreshing}
              >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <div className="bg-gray-700/50 p-3 rounded">
              <p className="text-gray-400 text-sm">Total Students</p>
              <p className="text-2xl font-bold">{studentsData.length}</p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded">
              <p className="text-gray-400 text-sm">Average Progress</p>
              <p className="text-2xl font-bold">
                {studentsData.length > 0 
                  ? Math.round(studentsData.reduce((acc, student) => 
                      acc + getCompletionPercentage(progressData[student.id]), 0
                    ) / studentsData.length)
                  : 0}%
              </p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded">
              <p className="text-gray-400 text-sm">Fully Completed</p>
              <p className="text-2xl font-bold">
                {studentsData.filter(student => 
                  getCompletionPercentage(progressData[student.id]) === 100
                ).length}
              </p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded">
              <p className="text-gray-400 text-sm">Total Modules</p>
              <p className="text-2xl font-bold">{Object.keys(moduleSettings).length || 11}</p>
            </div>
          </div>
        </div>

        {/* Progress Table */}
        <div className="w-full bg-gray-800 p-4 rounded-lg shadow-md">
          {/* Table Header */}
          <div
            className="flex items-center justify-between cursor-pointer text-white text-xl font-semibold bg-gray-700 p-3 rounded-lg transition-all duration-300 mb-3"
            onClick={() => setShowTable(!showTable)}
          >
            <h2>Detailed Progress by Student</h2>
            <span className="text-2xl transition-transform duration-300 transform">
              {showTable ? "▲" : "▼"}
            </span>
          </div>

          {/* Main Table */}
          <div
            className={`overflow-hidden transition-all duration-500 ${
              showTable ? "opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="overflow-auto max-h-[600px]">
              <table className="table-auto w-full border-collapse border border-gray-600">
                <thead className="bg-gray-700 sticky top-0 z-10">
                  <tr>
                    <th className="border border-gray-600 px-4 py-2 w-8"></th>
                    <th className="border border-gray-600 px-4 py-2 text-left">Student Name</th>
                    <th className="border border-gray-600 px-4 py-2">Username</th>
                    <th className="border border-gray-600 px-4 py-2">Overall Progress</th>
                    <th className="border border-gray-600 px-4 py-2">Modules Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsData.map((student) => {
                    const studentProgress = progressData[student.id];
                    const studentGrades = quizGrades[student.id] || {};
                    const isExpanded = expandedRows[student.id];
                    const completionPercentage = getCompletionPercentage(studentProgress);
                    
                    return (
                      <Fragment key={student.id || student.student_username}>
                        {/* Main Row */}
                        <tr className="hover:bg-gray-700 cursor-pointer">
                          <td 
                            className="border border-gray-600 px-4 py-2 text-center"
                            onClick={() => toggleRowExpansion(student.id)}
                          >
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </td>
                          <td className="border border-gray-600 px-4 py-2">
                            {student.first_name} {student.last_name}
                          </td>
                          <td className="border border-gray-600 px-4 py-2 text-center">
                            <span className="bg-blue-900 px-2 py-1 rounded font-mono text-xs">
                              {student.student_username}
                            </span>
                          </td>
                          <td className="border border-gray-600 px-4 py-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-700 rounded-full h-4">
                                <div 
                                  className={`h-4 rounded-full transition-all ${
                                    completionPercentage === 100 ? 'bg-green-500' : 
                                    completionPercentage > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${completionPercentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-300 w-12 text-right">
                                {completionPercentage}%
                              </span>
                            </div>
                          </td>
                          <td className="border border-gray-600 px-4 py-2 text-center">
                            {studentProgress ? 
                              Object.values(studentProgress).filter(m => 
                                m.getting_started && m.mini_lecture && m.workbook && m.software && m.quiz
                              ).length 
                              : 0} / {Object.keys(moduleSettings).length || 11}
                          </td>
                        </tr>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <tr>
                            <td colSpan="5" className="border border-gray-600 bg-gray-900/50 p-0">
                              <div className="p-4">
                                <h4 className="text-sm font-semibold text-gray-300 mb-3">Module Progress Details</h4>
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead className="bg-gray-800">
                                      <tr>
                                        <th className="px-3 py-2 text-left">Module</th>
                                        <th className="px-3 py-2">Getting Started</th>
                                        <th className="px-3 py-2">Mini Lecture</th>
                                        <th className="px-3 py-2">Workbook</th>
                                        <th className="px-3 py-2">Software</th>
                                        <th className="px-3 py-2">Quiz</th>
                                        <th className="px-3 py-2">Progress</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Object.keys(moduleSettings).map((moduleNum) => {
                                        const moduleProgress = studentProgress?.[moduleNum] || {};
                                        const quizAttempts = studentGrades[moduleNum] || [];
                                        const isQuizExpanded = expandedQuizzes[`${student.id}-${moduleNum}`];
                                        const modulePercentage = getModuleCompletionPercentage(moduleProgress);
                                        
                                        return (
                                          <Fragment key={`${student.id}-module-${moduleNum}`}>
                                            <tr className="hover:bg-gray-800/50">
                                              <td className="px-3 py-2 font-medium">
                                                Module {moduleNum}
                                              </td>
                                              <td className="px-3 py-2 text-center">
                                                {moduleProgress.getting_started ? 
                                                  <Check className="text-green-500 inline" size={16} /> : 
                                                  <X className="text-red-500 inline" size={16} />
                                                }
                                              </td>
                                              <td className="px-3 py-2 text-center">
                                                {moduleProgress.mini_lecture ? 
                                                  <Check className="text-green-500 inline" size={16} /> : 
                                                  <X className="text-red-500 inline" size={16} />
                                                }
                                              </td>
                                              <td className="px-3 py-2 text-center">
                                                {moduleProgress.workbook ? 
                                                  <Check className="text-green-500 inline" size={16} /> : 
                                                  <X className="text-red-500 inline" size={16} />
                                                }
                                              </td>
                                              <td className="px-3 py-2 text-center">
                                                {moduleProgress.software ? 
                                                  <Check className="text-green-500 inline" size={16} /> : 
                                                  <X className="text-red-500 inline" size={16} />
                                                }
                                              </td>
                                              <td className="px-3 py-2 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                  {moduleProgress.quiz ? 
                                                    <Check className="text-green-500" size={16} /> : 
                                                    <X className="text-red-500" size={16} />
                                                  }
                                                  {quizAttempts.length > 0 && (
                                                    <button
                                                      onClick={() => toggleQuizExpansion(student.id, moduleNum)}
                                                      className="ml-1 text-blue-400 hover:text-blue-300 flex items-center"
                                                      title={`${quizAttempts.length} attempt(s)`}
                                                    >
                                                      <span className="text-xs bg-blue-900/50 px-1 rounded">
                                                        {quizAttempts.length}
                                                      </span>
                                                      {isQuizExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                                    </button>
                                                  )}
                                                </div>
                                              </td>
                                              <td className="px-3 py-2">
                                                <div className="w-20 bg-gray-700 rounded-full h-2 mx-auto">
                                                  <div 
                                                    className={`h-2 rounded-full ${
                                                      modulePercentage === 100 ? 'bg-green-500' : 
                                                      modulePercentage > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${modulePercentage}%` }}
                                                  />
                                                </div>
                                              </td>
                                            </tr>
                                            
                                            {/* Quiz Attempts Dropdown */}
                                            {isQuizExpanded && quizAttempts.length > 0 && (
                                              <tr>
                                                <td colSpan="7" className="px-6 py-2 bg-gray-800/30">
                                                  <div className="text-xs">
                                                    <h5 className="font-semibold text-gray-400 mb-2">Quiz Attempts:</h5>
                                                    <div className="space-y-1">
                                                      {quizAttempts.map((attempt, idx) => (
                                                        <div key={attempt.id} className="flex items-center gap-4 text-gray-300">
                                                          <span className="text-gray-500">#{idx + 1}</span>
                                                          <Award size={12} className="text-yellow-500" />
                                                          <span className={`font-medium ${
                                                            attempt.score >= 80 ? 'text-green-400' : 
                                                            attempt.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                                                          }`}>
                                                            Score: {attempt.score}%
                                                          </span>
                                                          <Clock size={12} className="text-gray-500" />
                                                          <span>{formatTime(attempt.time_taken)}</span>
                                                          <span className="text-gray-500">•</span>
                                                          <span>{formatDate(attempt.time_submitted)}</span>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                </td>
                                              </tr>
                                            )}
                                          </Fragment>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                                                                </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}