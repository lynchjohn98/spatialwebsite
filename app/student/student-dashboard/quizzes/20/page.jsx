"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStudentSidebar } from "../../../../utils/hooks/useStudentSidebar";
import StudentSidebar from "../../../../../components/student_components/StudentSidebar";
import ResponsiveSurvey from "../../../../../components/quiz_questions/ResponsiveSurvey";
import { quizData } from "../../../../../app/library/quiz_data/stem_career_survey";
import { submitStudentSurvey } from "../../../../library/services/student_services/student_quiz";
export default function MMQSurvey() {
  const router = useRouter();
  const { isSidebarOpen, setIsSidebarOpen } = useStudentSidebar();
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedCourseData = sessionStorage.getItem("courseData");
    const storedStudentData = sessionStorage.getItem("studentData");

    if (storedCourseData && storedStudentData) {
      try {
        const parsedCourseData = JSON.parse(storedCourseData);
        const parsedStudentData = JSON.parse(storedStudentData);

        setCourseData(parsedCourseData);
        setStudentData(parsedStudentData);
      } catch (error) {
        console.error("Error parsing session storage data:", error);
        sessionStorage.removeItem("courseData");
        sessionStorage.removeItem("studentData");
        router.push("/student/student-join");
      }
    } else {
      router.push("/student/student-join");
    }
    
    setIsLoading(false);
  }, [router]);

  const handleSurveyComplete = async (surveyResults) => {
    try {
      console.log("Survey completed:", surveyResults);
      const payload = {
        survey_results: surveyResults,
        student_data: studentData
      }
      const results = await submitStudentSurvey(payload);

     // router.push('/student/student-dashboard/quizzes');
      
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("There was an error submitting your survey. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading survey...</div>
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
      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-1/4" : ""
        }`}
      >
        <div className="lg:hidden mb-6 pt-8"></div>
        
        {/* Survey Container with Module Page Styling */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-5xl mx-auto">
            {/* Return Button */}
            <button
              onClick={() => router.push("/student/student-dashboard/quizzes")}
              className="flex items-center text-white hover:text-blue-300 transition-colors mb-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Return to Quizzes
            </button>

            {/* Survey Header */}
            <div className="mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
                Mathematics Motivation Questionnaire
              </h1>
              <div className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
                <p className="text-lg text-gray-300 leading-relaxed">
                  This survey contains statements about learning mathematics. 
                  Please read each statement carefully and indicate how often 
                  each statement describes your experience with math.
                </p>
                <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-blue-300">
                    Your responses will help us better understand your learning needs 
                    and improve the course experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded ResponsiveSurvey with custom container styling */}
            <div className="bg-gray-800/70 rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">
              <ResponsiveSurvey
                data={quizData}
                onSurveyComplete={handleSurveyComplete}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}