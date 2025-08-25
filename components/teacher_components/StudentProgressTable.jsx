"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Check, X, Clock, Award } from "lucide-react";

export default function StudentProgressTable({ courseId }) {
  const [studentsData, setStudentsData] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [quizGrades, setQuizGrades] = useState({});
  const [moduleSettings, setModuleSettings] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedQuizzes, setExpandedQuizzes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, [courseId]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch course settings (students and modules)
      const settingsResponse = await fetch(`/api/course-settings/${courseId}`);
      const settings = await settingsResponse.json();
      
      const students = JSON.parse(settings.student_settings || "[]");
      const modules = JSON.parse(settings.module_settings || "{}");
      
      setStudentsData(Array.isArray(students) ? students : Object.values(students));
      setModuleSettings(modules);

      console.log("Student data:", students);
      console.log("Module data: ", modules);

      // Fetch progress for all students
      const progressResponse = await fetch(`/api/students-progress/${courseId}`);
      const progressList = await progressResponse.json();
      
      // Map progress by student_id
      const progressMap = {};
      progressList.forEach(p => {
        progressMap[p.student_id] = p.module_progress;
      });
      setProgressData(progressMap);

      // Fetch quiz grades for all students
      const gradesResponse = await fetch(`/api/quiz-grades/${courseId}`);
      const grades = await gradesResponse.json();
      
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

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-800 p-4 rounded-lg shadow-md">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer text-white text-xl font-semibold bg-gray-700 p-3 rounded-lg transition-all duration-300 mb-3"
        onClick={() => setShowTable(!showTable)}
      >
        <div className="flex items-center gap-4">
          <h2>Student Progress Tracking</h2>
          <div className="flex gap-3 text-sm">
            <span className="bg-blue-900/50 px-2 py-1 rounded">
              Total Students: {studentsData.length}
            </span>
          </div>
        </div>
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
                  <>
                    {/* Main Row */}
                    <tr key={student.id} className="hover:bg-gray-700 cursor-pointer">
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
                                      <>
                                        <tr key={moduleNum} className="hover:bg-gray-800/50">
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
                                                  className="ml-1 text-blue-400 hover:text-blue-300"
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
                                      </>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}