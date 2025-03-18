// app/student-dashboard/quizzes/[id]/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import StudentSidebar from "../../../../components/StudentSidebar";
import Quiz from "../../../../components/quiz_questions/IntegratedQuiz";
import { quizData } from "../../../../utils/quiz_data/practice_quiz";

export default function PracticeQuiz() {
  const params = useParams();
  const [studentData, setStudentData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const storedStudentData = JSON.parse(sessionStorage.getItem("studentData"));
        const storedCourseData = JSON.parse(sessionStorage.getItem("courseData"));
        
        setStudentData(storedStudentData);
        setCourseData(storedCourseData);
        setQuiz({
          ...quizData,
          timeLimit: 20,
          name: "Module 1 Quiz",
          totalPoints: quizData.questions.reduce((sum, q) => sum + q.points, 0)
        });
        
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // Handle window resize for sidebar
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [params.id]);

  const handleQuizComplete = (results) => {
    console.log("Quiz completed with results:", results);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
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
      
      <main className={`flex-1 p-4 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-1/4' : ''}`}>
        {quiz ? (
          <Quiz
            quiz={quiz}
            studentData={studentData}
            courseData={courseData}
            onComplete={handleQuizComplete}
          />
        ) : (
          <div className="text-center p-8">
            <p>Quiz not found</p>
          </div>
        )}
      </main>
    </div>
  );
}