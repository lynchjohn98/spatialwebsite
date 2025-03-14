"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { retrieveQuizzes } from "../../actions";
import StudentSidebar from "../../../components/StudentSidebar";

export default function Quizzes() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkWindowSize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', checkWindowSize);
    checkWindowSize();
    return () => window.removeEventListener('resize', checkWindowSize);
  }, []);

  const getQuizData = useCallback(async (courseId) => {
    try {
      const courseData = JSON.parse(sessionStorage.getItem("courseData"));
      const response = await retrieveQuizzes({ id: courseData.course.id });
      if (response.success) {
        const parsedQuizSettings = JSON.parse(
          response.data.quiz_settings || "[]"
        );
        setQuizData(parsedQuizSettings);
        const currentTime = new Date().toISOString();
        setLastUpdated(currentTime);
        sessionStorage.setItem("quizData", JSON.stringify(parsedQuizSettings));
        sessionStorage.setItem("quizDataTimestamp", currentTime);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return false;
    }
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    await getQuizData();
    setIsLoading(false);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const storedCourseData = sessionStorage.getItem("courseData");
    const storedStudentData = sessionStorage.getItem("studentData");
    const storedQuizData = sessionStorage.getItem("quizData");
    const storedTimestamp = sessionStorage.getItem("quizDataTimestamp");
    if (!storedCourseData || !storedStudentData) {
      setIsLoading(false);
      router.push("/student-join");
      return;
    }
    try {
      const parsedCourseData = JSON.parse(storedCourseData);
      setCourseData(parsedCourseData);
      const parsedStudentData = JSON.parse(storedStudentData);
      setStudentData(parsedStudentData);
      if (parsedCourseData.settings && parsedCourseData.settings.quiz_settings) {
        let parsedQuizSettings;
        if (typeof parsedCourseData.settings.quiz_settings === 'string') {
          parsedQuizSettings = JSON.parse(parsedCourseData.settings.quiz_settings);
        } else {
          parsedQuizSettings = parsedCourseData.settings.quiz_settings;
        }
        setQuizData(parsedQuizSettings);
        const currentTime = new Date().toISOString();
        setLastUpdated(currentTime);
        sessionStorage.setItem("quizData", JSON.stringify(parsedQuizSettings));
        sessionStorage.setItem("quizDataTimestamp", currentTime);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      sessionStorage.removeItem("courseData");
      sessionStorage.removeItem("studentData");
      router.push("/student-join");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const navigateToQuiz = (quizId) => {
    router.push(`/student-dashboard/quizzes/${quizId}`);
  };

  if (isLoading || !courseData || !studentData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white text-xl">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <StudentSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        courseData={courseData}
        studentData={studentData}
      />
      <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-1/4' : ''}`}>
        <div className="lg:hidden mb-6 pt-8">
        </div>
        
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Quizzes</h1>
          
          <div className="flex justify-between items-center mb-6">
            <p>Click on a quiz to begin. Make sure you're ready before starting as quizzes have time limits.</p>
            <button 
              onClick={refreshData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>
          
          {lastUpdated && (
            <p className="text-sm text-gray-400 mb-4">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
          
          <div className="space-y-4">
            {quizData && quizData.length > 0 ? (
              (() => {
                const visibleQuizzes = quizData.filter(quiz => quiz.visibility === "Yes");
                
                if (visibleQuizzes.length === 0) {
                  return (
                    <div className="p-4 bg-gray-800 rounded-lg text-center">
                      <p>No quizzes available at this time. Please check with your teacher.</p>
                    </div>
                  );
                }
                
                return visibleQuizzes.map((quiz) => (
                  <div 
                    key={quiz.id} 
                    className="p-5 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                    onClick={() => navigateToQuiz(quiz.id)}
                  >
                    <h3 className="text-xl font-bold mb-2">{quiz.name}</h3>
                    <p className="text-gray-300">{quiz.description}</p>
                    {quiz.time_limit && (
                      <div className="mt-3 flex items-center text-yellow-300">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 mr-2" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                        <span>Time limit: {quiz.time_limit} minutes</span>
                      </div>
                    )}
                  </div>
                ));
              })()
            ) : (
              <div className="p-4 bg-gray-800 rounded-lg text-center">
                <p>No quizzes available. Please check with your teacher.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}