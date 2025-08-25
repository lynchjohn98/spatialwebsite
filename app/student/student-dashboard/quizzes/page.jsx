// app/student/student-dashboard/quizzes/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useStudentSidebar } from "../../../utils/hooks/useStudentSidebar";
import { retrieveCourseSettings } from "../../../library/services/course_actions";
import StudentSidebar  from "../../../../components/student_components/StudentSidebar";
import StudentQuizCard from "../../../../components/student_components/StudentQuizCard";

export default function StudentQuizzesPage() {
  const router = useRouter();
  const { isSidebarOpen, setIsSidebarOpen } = useStudentSidebar();
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper function to safely parse JSON
  const safeJsonParse = (data, fallback = null) => {
    if (!data) return fallback;
    
    // If it's already an object, return it
    if (typeof data === 'object' && data !== null) {
      return data;
    }
    
    // If it's a string, try to parse it
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        return fallback;
      }
    }
    
    return fallback;
  };

  // Function to refresh quiz settings
  const refreshQuizzes = async (courseId, showLoadingState = true) => {
    if (showLoadingState) {
      setIsRefreshing(true);
    }
    
    try {
      const response = await retrieveCourseSettings({ id: courseId });
      
      if (response.success && response.data) {
        let quizSettings = response.data.quiz_settings;
        
        // Safely parse quiz settings
        quizSettings = safeJsonParse(quizSettings, []);
        
        if (Array.isArray(quizSettings)) {
          const visibleQuizzes = quizSettings.filter(quiz => quiz?.visibility === "Yes");
          setAvailableQuizzes(visibleQuizzes);
          
          // Update course data in state and session storage
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
            sessionStorage.setItem("courseData", JSON.stringify(updatedCourseData));
          }
          
          console.log("Refreshed quizzes:", visibleQuizzes);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error refreshing quizzes:", error);
      return false;
    } finally {
      if (showLoadingState) {
        setIsRefreshing(false);
      }
    }
  };

  // Initial load effect with auto-refresh
  useEffect(() => {
    const initializePage = async () => {
      const storedCourseData = sessionStorage.getItem("courseData");
      const storedStudentData = sessionStorage.getItem("studentData");
      
      if (storedCourseData && storedStudentData) {
        try {
          // Safely parse the stored data
          const parsedCourseData = safeJsonParse(storedCourseData);
          const parsedStudentData = safeJsonParse(storedStudentData);
          
          if (!parsedCourseData || !parsedStudentData) {
            console.error("Invalid data in session storage");
            sessionStorage.removeItem("courseData");
            sessionStorage.removeItem("studentData");
            router.push("/student/student-dashboard");
            return;
          }
          
          // Set initial data
          setCourseData(parsedCourseData);
          setStudentData(parsedStudentData);
          
          // Set initial quiz data from session storage
          if (parsedCourseData.settings && parsedCourseData.settings.quiz_settings) {
            const quizSettings = safeJsonParse(parsedCourseData.settings.quiz_settings, []);
            if (Array.isArray(quizSettings)) {
              const visibleQuizzes = quizSettings.filter(quiz => quiz?.visibility === "Yes");
              setAvailableQuizzes(visibleQuizzes);
            }
          }
          
          // Auto-refresh quizzes from database to get latest visibility settings
          if (parsedStudentData.course_id) {
            await refreshQuizzes(parsedStudentData.course_id, false);
          }
          
        } catch (error) {
          console.error("Error initializing page:", error);
          sessionStorage.removeItem("courseData");
          sessionStorage.removeItem("studentData");
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
    await refreshQuizzes(studentData.course_id);
  };

  // Categorize quizzes
  const categorizeQuizzes = () => {
    const categories = {
      pretests: [],
      posttests: [],
      practice: [],
      modules: []
    };

    availableQuizzes.forEach(quiz => {
      if (quiz.name.toLowerCase().includes("pre-test")) {
        categories.pretests.push(quiz);
      } else if (quiz.name.toLowerCase().includes("post-test")) {
        categories.posttests.push(quiz);
      } else if (quiz.name.toLowerCase().includes("practice")) {
        categories.practice.push(quiz);
      } else {
        categories.modules.push(quiz);
      }
    });

    return categories;
  };

  const handleStartQuiz = (quiz) => {
    // Store quiz data in session storage
    sessionStorage.setItem("currentQuiz", JSON.stringify(quiz));
    // Navigate to quiz taking page
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
    switch(selectedCategory) {
      case "pretests":
        return categories.pretests;
      case "posttests":
        return categories.posttests;
      case "practice":
        return categories.practice;
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
        <div className="lg:hidden mb-6 pt-8">
          {/* Space for hamburger button on mobile */}
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Page Header with Refresh Button */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Available Quizzes
              </h1>
              <p className="text-gray-400">
                Complete assessments to track your spatial thinking progress
              </p>
            </div>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 ${
                isRefreshing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Refresh to see updated quiz visibility"
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

          {/* Loading message when refreshing */}
          {isRefreshing && (
            <div className="mb-4 p-3 bg-blue-600/20 border border-blue-600 rounded-lg text-blue-300 text-sm">
              Fetching latest quiz settings...
            </div>
          )}

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory("pretests")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "pretests"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Pre-Tests ({categories.pretests.length})
            </button>
            
            <button
              onClick={() => setSelectedCategory("modules")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "modules"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Module Quizzes ({categories.modules.length})
            </button>
            
            <button
              onClick={() => setSelectedCategory("posttests")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "posttests"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Post-Tests ({categories.posttests.length})
            </button>
            
            <button
              onClick={() => setSelectedCategory("practice")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "practice"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Practice ({categories.practice.length})
            </button>
            
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              All Quizzes ({availableQuizzes.length})
            </button>
          </div>

          {/* Quiz List */}
          {filteredQuizzes.length > 0 ? (
            <div className="space-y-3">
              {filteredQuizzes.map((quiz) => (
                <StudentQuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onStart={handleStartQuiz}
                  studentData={studentData}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-600 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                No Quizzes Available
              </h3>
              <p className="text-gray-500 mb-4">
                {selectedCategory === "all" 
                  ? "No quizzes are currently available for this course. Your instructor may release them as the course progresses."
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
