// app/teacher/dashboard/quizzes/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { retrieveTeacherQuizPage } from "../../../library/services/teacher_actions";
import Sidebar from "../../../../components/teacher_components/TeacherSidebar";

export default function TeacherQuizzes() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [quizSettings, setQuizSettings] = useState([]);
  const [quizGrades, setQuizGrades] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("all"); // "all", "module", "survey", "pre_post_test"
  const [selectedAttempts, setSelectedAttempts] = useState({}); // Track which attempt is selected for each quiz
  const [expandedResults, setExpandedResults] = useState({}); // Track which quiz results are expanded
  const router = useRouter();

  useEffect(() => {
    const checkWindowSize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", checkWindowSize);
    checkWindowSize();
   
    return () => window.removeEventListener("resize", checkWindowSize);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const storedCourseData = sessionStorage.getItem("courseData");
    const storedTeacherData = sessionStorage.getItem("teacherData");
    
    if (!storedCourseData) {
      router.push("/teacher-join");
      return;
    }
    
    try {
      const parsedCourseData = JSON.parse(storedCourseData);
      const parsedTeacherData = JSON.parse(storedTeacherData || "{}");
      setCourseData(parsedCourseData);

      // Fetch teacher quiz data including grades
      const result = await retrieveTeacherQuizPage(parsedTeacherData.id, parsedCourseData.id);
      console.log("Quiz data:", result);

      // Process quiz settings
      if (result.quiz_settings) {
        let quizzes = result.quiz_settings;
        
        // Convert to array if it's an object
        if (!Array.isArray(quizzes)) {
          quizzes = Object.values(quizzes);
        }
        
        // Sort by id or created_at
        quizzes.sort((a, b) => a.id - b.id);
        setQuizSettings(quizzes);
      }

      // Set quiz grades
      if (result.quiz_grades) {
        setQuizGrades(result.quiz_grades);
        sessionStorage.setItem("quizGrades", JSON.stringify(result.quiz_grades));
      }

    } catch (error) {
      console.error("Error loading quiz data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
  if (!seconds || seconds === 0) return '-';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

  useEffect(() => {
    loadData();
  }, []);

  // Filter quizzes based on view mode
  const getFilteredQuizzes = () => {
    if (viewMode === "all") return quizSettings;
    return quizSettings.filter(quiz => quiz.type === viewMode);
  };

  // Get quiz completion status based on quiz_grades
  const getQuizStatus = (quiz) => {
    // Check if quiz has been completed by checking if it exists in quiz_grades
    // The quiz can be keyed by either its ID or name in the grades object
    const quizGrade = quizGrades[quiz.id] || quizGrades[quiz.name];
    
    if (quizGrade) {
      // If there's a grade entry, the quiz is completed
      return "completed";
    }
    
    // If no grade entry exists, the quiz hasn't been started
    return "not_started";
  };

  // Get quiz grade information from teachers_grades table
  const getQuizGradeInfo = (quiz) => {
    const gradesForQuiz = quizGrades[quiz.id];
    
    if (!gradesForQuiz) return null;
    
    // Grades should already be an array from the backend
    if (Array.isArray(gradesForQuiz)) {
      // Sort by submission time (newest first) and add attempt numbers
      const sortedAttempts = [...gradesForQuiz].sort((a, b) => 
        new Date(b.time_submitted) - new Date(a.time_submitted)
      );
      
      return sortedAttempts.map((attempt, index) => ({
        attemptNumber: sortedAttempts.length - index, // Reverse numbering so oldest is #1
        score: attempt.score || 0,
        timeSubmitted: attempt.time_submitted,
        timeTaken: attempt.time_taken,
        isBest: false // Will be set later
      }));
    }
    
    return null;
  };

  // Mark the best attempt
  const markBestAttempt = (attempts) => {
    if (!attempts || attempts.length === 0) return attempts;
    
    let bestScore = -1;
    let bestIndex = 0;
    
    attempts.forEach((attempt, index) => {
      if (attempt.score > bestScore) {
        bestScore = attempt.score;
        bestIndex = index;
      }
    });
    
    return attempts.map((attempt, index) => ({
      ...attempt,
      isBest: index === bestIndex
    }));
  };

  // Get status color and label
  const getStatusDisplay = (status) => {
    switch(status) {
      case "completed":
        return { color: "green", label: "Completed", icon: "✓" };
      case "in_progress":
        return { color: "yellow", label: "In Progress", icon: "⏳" };
      default:
        return { color: "gray", label: "Not Started", icon: "○" };
    }
  };

  // Get quiz type display
  const getQuizTypeDisplay = (type) => {
    switch(type) {
      case "module":
        return { label: "Module Quiz", icon: "📚", color: "blue" };
      case "survey":
        return { label: "Survey", icon: "📋", color: "purple" };
      case "pre_post_test":
        return { label: "Pre/Post Tests", icon: "📊", color: "orange" };
      default:
        return { label: "Quiz", icon: "📝", color: "gray" };
    }
  };

  // Navigate to take quiz
  const navigateToQuiz = (quizId) => {
    router.push(`/teacher/dashboard/quizzes/${quizId}`);
  };

  // Toggle quiz results expansion
  const toggleResultsExpansion = (quizId) => {
    setExpandedResults(prev => ({
      ...prev,
      [quizId]: !prev[quizId]
    }));
  };

  // Navigate to settings
  const navigateToSettings = () => {
    router.push("/teacher/dashboard/settings");
  };

  // Refresh data
  const refreshData = () => {
    loadData();
  };

  // Calculate statistics
  const getQuizStats = () => {
    const filtered = getFilteredQuizzes();
    const visible = filtered.filter(q => q.visibility === "Yes").length;
    const hidden = filtered.filter(q => q.visibility === "No").length;
    const completed = filtered.filter(q => getQuizStatus(q) === "completed").length;
    const notStarted = filtered.filter(q => getQuizStatus(q) === "not_started").length;
    
    return { visible, hidden, completed, notStarted, total: filtered.length };
  };

  const stats = getQuizStats();

  if (isLoading || !courseData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p>Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        courseData={courseData}
      />
      
      <main className={`flex-1 p-6 transition-all duration-300 ${
        isSidebarOpen ? "lg:ml-1/4" : ""
      }`}>
        <div className="lg:hidden mb-6 pt-8"></div>

        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Course Quizzes</h1>
              <p className="text-gray-400 text-sm mt-1">
                {stats.total} total quizzes • {stats.visible} visible to students • {stats.completed} completed
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={refreshData}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                title="Refresh"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={navigateToSettings}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manage Settings
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {[
              { value: "all", label: "All Quizzes", count: quizSettings.length },
              { value: "module", label: "Module Quizzes", count: quizSettings.filter(q => q.type === "module").length },
              { value: "survey", label: "Surveys", count: quizSettings.filter(q => q.type === "survey").length },
              { value: "pre_post_test", label: "Pre/Post Tests", count: quizSettings.filter(q => q.type === "pre_post_test").length }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setViewMode(tab.value)}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  viewMode === tab.value 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {tab.label}
                <span className="ml-2 text-xs bg-black/20 px-2 py-0.5 rounded">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-3xl font-bold text-green-400">{stats.visible}</p>
              <p className="text-sm text-gray-400">Visible</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-3xl font-bold text-red-400">{stats.hidden}</p>
              <p className="text-sm text-gray-400">Hidden</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-3xl font-bold text-blue-400">{stats.completed}</p>
              <p className="text-sm text-gray-400">Completed</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-3xl font-bold text-gray-400">{stats.notStarted}</p>
              <p className="text-sm text-gray-400">Not Started</p>
            </div>
          </div>

          {/* Quiz List */}
          <div className="space-y-4">
            {getFilteredQuizzes().length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-400">No quizzes found in this category.</p>
              </div>
            ) : (
              getFilteredQuizzes().map((quiz) => {
                const status = getQuizStatus(quiz);
                const statusDisplay = getStatusDisplay(status);
                const typeDisplay = getQuizTypeDisplay(quiz.type);
                const isVisible = quiz.visibility === "Yes";
                const gradeInfo = getQuizGradeInfo(quiz);
                
                return (
                  <div
                    key={quiz.id}
                    className={`p-6 bg-gray-800 rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
                      status === "completed" ? 'border-green-600/50' : 'border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      {/* Quiz Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{typeDisplay.icon}</span>
                          <h3 className="text-xl font-bold">{quiz.name}</h3>
                          
                          {/* Status Badge */}
                          <span className={`bg-${statusDisplay.color}-600/20 text-${statusDisplay.color}-400 text-xs px-2 py-1 rounded flex items-center gap-1`}>
                            <span>{statusDisplay.icon}</span>
                            {statusDisplay.label}
                          </span>
                          
                          {/* Type Badge */}
                          <span className={`bg-${typeDisplay.color}-600/20 text-${typeDisplay.color}-400 text-xs px-2 py-1 rounded`}>
                            {typeDisplay.label}
                          </span>
                          
                          {/* Visibility Badge */}
                          <span className={`${
                            isVisible 
                              ? 'bg-green-600/20 text-green-400' 
                              : 'bg-red-600/20 text-red-400'
                          } text-xs px-2 py-1 rounded`}>
                            {isVisible ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-4">{quiz.description}</p>
                        
                        {/* Quiz Details */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                          {quiz.total_score && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span>{quiz.total_score} points</span>
                            </div>
                          )}
                          {quiz.questions && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                              </svg>
                              <span>{quiz.questions} questions</span>
                            </div>
                          )}
                          {quiz.time && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              <span>{quiz.time} minutes</span>
                            </div>
                          )}
                        </div>
                        
                        
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          {status === "completed" ? (
                            <>
                              <button
                                onClick={() => toggleResultsExpansion(quiz.id)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                              >
                                <svg 
                                  className={`w-5 h-5 transition-transform ${expandedResults[quiz.id] ? 'rotate-180' : ''}`} 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                {expandedResults[quiz.id] ? 'Hide Results' : 'View Results'}
                              </button>
                              <button
                                onClick={() => navigateToQuiz(quiz.id)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                              >
                                Retake Quiz
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => navigateToQuiz(quiz.id)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              Start Quiz
                            </button>
                          )}
                          
                          {!isVisible && (
                            <button
                              onClick={navigateToSettings}
                              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                            >
                              Make Visible
                            </button>
                          )}
                        </div>

                        {/* Expanded Results Section */}
                        {expandedResults[quiz.id] && status === "completed" && gradeInfo && (
                          <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600 animate-fadeIn">
                            <h4 className="text-lg font-semibold text-white mb-3">Quiz Results Details</h4>
                            
                            {/* All Attempts Table */}
                            <div className="space-y-3">
                              <div className="bg-gray-800/50 rounded overflow-hidden">
                                <table className="w-full">
                                  <thead className="bg-gray-700/50">
                                    <tr>
                                      <th className="text-left text-xs text-gray-400 p-3">Attempt</th>
                                      <th className="text-left text-xs text-gray-400 p-3">Score</th>
                                      <th className="text-left text-xs text-gray-400 p-3">Time Taken</th>
                                      <th className="text-left text-xs text-gray-400 p-3">Date Submitted</th>
                                      <th className="text-left text-xs text-gray-400 p-3">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {markBestAttempt(gradeInfo).map((attempt, index) => (
                                      <tr 
                                        key={index}
                                        className={`border-t border-gray-700 ${
                                          attempt.isBest ? 'bg-green-600/10' : ''
                                        }`}
                                      >
                                        <td className="p-3 text-sm text-gray-300">
                                          #{attempt.attemptNumber}
                                        </td>
                                        <td className={`p-3 text-sm font-semibold ${
                                          attempt.isBest ? 'text-green-400' : 'text-gray-300'
                                        }`}>
                                          {attempt.score}/{quiz.total_score || "?"}
                                        </td>
                                        <td className="p-3 text-sm text-gray-300">
  {attempt.timeTaken ? (
    // Convert seconds to minutes and seconds format
    (() => {
      const totalSeconds = attempt.timeTaken;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      
      // Handle hours if needed
      if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m ${seconds}s`;
      }
      
      // Just minutes and seconds
      return `${minutes}m ${seconds}s`;
    })()
  ) : (
    '-'
  )}
</td>
                                        <td className="p-3 text-sm text-gray-300">
                                          {attempt.timeSubmitted ? (
                                            <>
                                              {new Date(attempt.timeSubmitted).toLocaleDateString()}<br/>
                                              <span className="text-xs text-gray-500">
                                                {new Date(attempt.timeSubmitted).toLocaleTimeString()}
                                              </span>
                                            </>
                                          ) : (
                                            '-'
                                          )}
                                        </td>
                                        <td className="p-3">
                                          {attempt.isBest && (
                                            <span className="text-xs bg-green-600/30 text-green-300 px-2 py-1 rounded">
                                              Best
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* Summary Stats */}
                              <div className="grid grid-cols-3 gap-3">
                                <div className="bg-gray-800/50 p-3 rounded text-center">
                                  <p className="text-xs text-gray-400 mb-1">Total Attempts</p>
                                  <p className="text-xl font-bold text-white">{gradeInfo.length}</p>
                                </div>
                                <div className="bg-gray-800/50 p-3 rounded text-center">
                                  <p className="text-xs text-gray-400 mb-1">Best Score</p>
                                  <p className="text-xl font-bold text-green-400">
                                    {Math.max(...gradeInfo.map(a => a.score))}
                                  </p>
                                </div>
                                <div className="bg-gray-800/50 p-3 rounded text-center">
                                  <p className="text-xs text-gray-400 mb-1">Average Score</p>
                                  <p className="text-xl font-bold text-blue-400">
                                    {Math.round(gradeInfo.reduce((sum, a) => sum + a.score, 0) / gradeInfo.length)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-900/20 border border-blue-600/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">📘 Quiz Management Guide</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• <strong className="text-blue-400">Module Quizzes:</strong> Assessment quizzes for each course module</p>
              <p>• <strong className="text-purple-400">Surveys:</strong> Gather feedback and insights from students</p>
              <p>• <strong className="text-orange-400">Assessments:</strong> Pre/post tests to measure learning outcomes</p>
              <p className="pt-2">💡 Tip: Complete all quizzes yourself before making them visible to students to ensure you understand the content and can provide support.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}