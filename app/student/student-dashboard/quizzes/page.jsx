// app/student/student-dashboard/quizzes/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useStudentSidebar } from "../../../utils/hooks/useStudentSidebar";
import { retrieveCourseSettings } from "../../../library/services/course_actions";
import { fetchStudentQuizAttempts } from "../../../library/services/student_services/student_actions";
import StudentSidebar from "../../../../components/student_components/StudentSidebar";
import StudentQuizCard from "../../../../components/student_components/StudentQuizCard";

export default function StudentQuizzesPage() {
  const router = useRouter();
  const { isSidebarOpen, setIsSidebarOpen } = useStudentSidebar();
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [quizGrades, setQuizGrades] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedResults, setExpandedResults] = useState({});

  // Helper function to safely parse JSON
  const safeJsonParse = (data, fallback = null) => {
    if (!data) return fallback;

    if (typeof data === "object" && data !== null) {
      return data;
    }

    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        return fallback;
      }
    }

    return fallback;
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return "-";

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

  // Function to refresh quiz settings and grades
  const refreshQuizzes = async (
    courseId,
    studentId,
    showLoadingState = true
  ) => {
    if (showLoadingState) {
      setIsRefreshing(true);
    }

    try {
      const response = await retrieveCourseSettings({ id: courseId });

      if (response.success && response.data) {
        let quizSettings = response.data.quiz_settings;
        quizSettings = safeJsonParse(quizSettings, []);

        if (Array.isArray(quizSettings)) {
          const visibleQuizzes = quizSettings.filter(
            (quiz) => quiz?.visibility === "Yes"
          );
          setAvailableQuizzes(visibleQuizzes);

          const storedData = sessionStorage.getItem("courseData");
          const currentCourseData = safeJsonParse(storedData);

          if (currentCourseData) {
            const updatedCourseData = {
              ...currentCourseData,
              settings: {
                ...currentCourseData.settings,
                quiz_settings: quizSettings,
              },
            };
            setCourseData(updatedCourseData);
            sessionStorage.setItem(
              "courseData",
              JSON.stringify(updatedCourseData)
            );
          }
        }
      }

      // Fetch student's quiz attempts
      const gradesResult = await fetchStudentQuizAttempts(studentId, courseId);
      if (gradesResult.success && gradesResult.data) {
        const gradesMap = {};
        gradesResult.data.forEach((grade) => {
          if (!gradesMap[grade.quiz_id]) {
            gradesMap[grade.quiz_id] = [];
          }
          gradesMap[grade.quiz_id].push(grade);
        });
        setQuizGrades(gradesMap);
      }

      return true;
    } catch (error) {
      console.error("Error refreshing quizzes:", error);
      return false;
    } finally {
      if (showLoadingState) {
        setIsRefreshing(false);
      }
    }
  };

  // Initial load effect
  useEffect(() => {
    const initializePage = async () => {
      const storedCourseData = sessionStorage.getItem("courseData");
      const storedStudentData = sessionStorage.getItem("studentData");

      if (storedCourseData && storedStudentData) {
        try {
          const parsedCourseData = safeJsonParse(storedCourseData);
          const parsedStudentData = safeJsonParse(storedStudentData);

          if (!parsedCourseData || !parsedStudentData) {
            console.error("Invalid data in session storage");
            router.push("/student/student-dashboard");
            return;
          }

          setCourseData(parsedCourseData);
          setStudentData(parsedStudentData);

          // Auto-refresh quizzes and grades
          if (parsedStudentData.course_id && parsedStudentData.id) {
            await refreshQuizzes(
              parsedStudentData.course_id,
              parsedStudentData.id,
              false
            );
          }
        } catch (error) {
          console.error("Error initializing page:", error);
          router.push("/student/student-dashboard");
        }
      } else {
        router.push("/student/student-dashboard");
      }
      setIsLoading(false);
    };

    initializePage();
  }, [router]);

  // Manual refresh handler
  const handleManualRefresh = async () => {
    if (!studentData) return;
    await refreshQuizzes(studentData.course_id, studentData.id);
  };

  // Get quiz completion status
  const getQuizStatus = (quiz) => {
    const quizGrade = quizGrades[quiz.id];
    if (quizGrade && quizGrade.length > 0) {
      return "completed";
    }
    return "not_started";
  };

  // Get quiz grade information
  const getQuizGradeInfo = (quiz) => {
    const gradesForQuiz = quizGrades[quiz.id];

    if (!gradesForQuiz || gradesForQuiz.length === 0) return null;

    const sortedAttempts = [...gradesForQuiz].sort(
      (a, b) => new Date(b.time_submitted) - new Date(a.time_submitted)
    );

    return sortedAttempts.map((attempt, index) => ({
      attemptNumber: sortedAttempts.length - index,
      score: attempt.score || 0,
      timeSubmitted: attempt.time_submitted,
      timeTaken: attempt.time_taken,
      isBest: false,
    }));
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
      isBest: index === bestIndex,
    }));
  };

  // Toggle quiz results expansion
  const toggleResultsExpansion = (quizId) => {
    setExpandedResults((prev) => ({
      ...prev,
      [quizId]: !prev[quizId],
    }));
  };

  // Categorize quizzes
  const categorizeQuizzes = () => {
    const categories = {
      pretests: [],
      posttests: [],
      surveys: [],
      modules: [],
    };

    availableQuizzes.forEach((quiz) => {
      if (!quiz || !quiz.name) return;

      const quizName = quiz.name.toLowerCase();

      if (quizName.includes("pre-test")) {
        categories.pretests.push(quiz);
      } else if (quizName.includes("post-test")) {
        categories.posttests.push(quiz);
      } else if (
        quiz.type?.toLowerCase().includes("survey") ||
        quizName.includes("survey")
      ) {
        categories.surveys.push(quiz);
      } else {
        categories.modules.push(quiz);
      }
    });

    return categories;
  };

  const handleStartQuiz = (quiz) => {
    sessionStorage.setItem("currentQuiz", JSON.stringify(quiz));
    router.push(`/student/student-dashboard/quizzes/${quiz.id}`);
  };

  if (isLoading || !courseData || !studentData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white text-xl">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
          Loading quizzes...
        </div>
      </div>
    );
  }

  const categories = categorizeQuizzes();
  const getFilteredQuizzes = () => {
    switch (selectedCategory) {
      case "pretests":
        return categories.pretests;
      case "posttests":
        return categories.posttests;
      case "surveys":
        return categories.surveys;
      case "modules":
        return categories.modules;
      default:
        return availableQuizzes;
    }
  };

  const filteredQuizzes = getFilteredQuizzes();

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <StudentSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        courseData={courseData}
        studentData={studentData}
      />
      <main className={"lg:ml-72 p-6 transition-all duration-300 w-full"}>
        <div className="lg:hidden mb-6 pt-8"></div>

        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Available Quizzes & Surveys
              </h1>
              <p className="text-gray-400">
                Complete assessments and surveys to track your spatial thinking
                progress
              </p>
            </div>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 ${
                isRefreshing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <svg
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="hidden sm:inline">
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["pretests", "modules", "posttests", "surveys", "all"].map(
              (category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {category === "all"
                    ? "All"
                    : category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                  (
                  {category === "all"
                    ? availableQuizzes.length
                    : categories[category]?.length || 0}
                  )
                </button>
              )
            )}
          </div>

          {/* Enhanced Quiz Cards with Results */}
          {filteredQuizzes.length > 0 ? (
            <div className="space-y-4">
              {filteredQuizzes.map((quiz) => {
                const status = getQuizStatus(quiz);
                const gradeInfo = getQuizGradeInfo(quiz);
                const isCompleted = status === "completed";

                return (
                  <div
                    key={quiz.id}
                    className={`p-6 bg-gray-800 rounded-lg border-2 ${
                      isCompleted ? "border-green-600/50" : "border-gray-700"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{quiz.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {quiz.description}
                        </p>
                      </div>
                      {isCompleted && (
                        <span className="bg-green-600/20 text-green-400 text-xs px-3 py-1 rounded-full">
                          ✓ Completed
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3 mb-4">
                      {isCompleted ? (
                        <>
                          <button
                            onClick={() => toggleResultsExpansion(quiz.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                          >
                            <svg
                              className={`w-5 h-5 transition-transform ${
                                expandedResults[quiz.id] ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                            {expandedResults[quiz.id]
                              ? "Hide Results"
                              : "View Results"}
                          </button>
                          <button
                            onClick={() => handleStartQuiz(quiz)}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                          >
                            Retake Quiz
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleStartQuiz(quiz)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                        >
                          Start Quiz
                        </button>
                      )}
                    </div>

                    {/* Expanded Results Section */}
                    {expandedResults[quiz.id] && isCompleted && gradeInfo && (
                      <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
                        <h4 className="text-lg font-semibold mb-3">
                          Your Quiz Results
                        </h4>

                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-700/50">
                              <tr>
                                <th className="text-left text-xs text-gray-400 p-3">
                                  Attempt
                                </th>
                                <th className="text-left text-xs text-gray-400 p-3">
                                  Score
                                </th>
                                <th className="text-left text-xs text-gray-400 p-3">
                                  Time Taken
                                </th>
                                <th className="text-left text-xs text-gray-400 p-3">
                                  Date
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {markBestAttempt(gradeInfo).map(
                                (attempt, index) => (
                                  <tr
                                    key={index}
                                    className={`border-t border-gray-700 ${
                                      attempt.isBest ? "bg-green-600/10" : ""
                                    }`}
                                  >
                                    <td className="p-3 text-sm">
                                      #{attempt.attemptNumber}
                                      {attempt.isBest && (
                                        <span className="ml-2 text-xs bg-green-600/30 text-green-300 px-2 py-1 rounded">
                                          Best
                                        </span>
                                      )}
                                    </td>
                                    <td
                                      className={`p-3 text-sm font-semibold ${
                                        attempt.isBest
                                          ? "text-green-400"
                                          : "text-gray-300"
                                      }`}
                                    >
                                      {attempt.score}/{quiz.total_score || "?"}
                                    </td>
                                    <td className="p-3 text-sm text-gray-300">
                                      {attempt.timeTaken
                                        ? // Convert seconds to minutes and seconds format
                                          (() => {
                                            const totalSeconds =
                                              attempt.timeTaken;
                                            const minutes = Math.floor(
                                              totalSeconds / 60
                                            );
                                            const seconds = totalSeconds % 60;

                                            // Handle hours if needed
                                            if (minutes >= 60) {
                                              const hours = Math.floor(
                                                minutes / 60
                                              );
                                              const remainingMinutes =
                                                minutes % 60;
                                              return `${hours}h ${remainingMinutes}m ${seconds}s`;
                                            }

                                            // Just minutes and seconds
                                            return `${minutes}m ${seconds}s`;
                                          })()
                                        : "-"}
                                    </td>
                                    <td className="p-3 text-sm text-gray-300">
                                      {new Date(
                                        attempt.timeSubmitted
                                      ).toLocaleDateString()}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-3 mt-4">
                          <div className="bg-gray-800/50 p-3 rounded text-center">
                            <p className="text-xs text-gray-400 mb-1">
                              Attempts
                            </p>
                            <p className="text-xl font-bold">
                              {gradeInfo.length}
                            </p>
                          </div>
                          <div className="bg-gray-800/50 p-3 rounded text-center">
                            <p className="text-xs text-gray-400 mb-1">
                              Best Score
                            </p>
                            <p className="text-xl font-bold text-green-400">
                              {Math.max(...gradeInfo.map((a) => a.score))}
                            </p>
                          </div>
                          <div className="bg-gray-800/50 p-3 rounded text-center">
                            <p className="text-xs text-gray-400 mb-1">
                              Average
                            </p>
                            <p className="text-xl font-bold text-blue-400">
                              {Math.round(
                                gradeInfo.reduce((sum, a) => sum + a.score, 0) /
                                  gradeInfo.length
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                No {selectedCategory === "surveys" ? "Surveys" : "Quizzes"}{" "}
                Available
              </h3>
              <p className="text-gray-500 mb-4">
                {selectedCategory === "all"
                  ? "No quizzes or surveys are currently available for this course."
                  : `No ${selectedCategory} are currently available.`}
              </p>
              <button
                onClick={handleManualRefresh}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Check for updates
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
