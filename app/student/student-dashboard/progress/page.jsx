// app/student/student-dashboard/progress/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentSidebar from "../../../../components/student_components/StudentSidebar";
import StudentProgressTracker from "../../../../components/student_components/StudentProgressTable";
import { useStudentSidebar } from "../../../utils/hooks/useStudentSidebar";

export default function StudentProgressPage() {
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
        
        console.log("COURSE DATA:", parsedCourseData);
        console.log("STUDENT DATA:", parsedStudentData);
        
        setCourseData(parsedCourseData);
        setStudentData(parsedStudentData);
      } catch (error) {
        console.error("Error parsing session storage data:", error);
        sessionStorage.removeItem("courseData");
        sessionStorage.removeItem("studentData");
        router.push("/student-join");
      }
    } else {
      router.push("/student-join");
    }
    setIsLoading(false);
  }, [router]);

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
          <main
            className={"lg:ml-72 p-6 transition-all duration-300"}
          >
            <div className="lg:hidden mb-6 pt-8">
              {/* Space for hamburger button on mobile */}
            </div>

            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Your Learning Progress
            </h1>
            <p className="text-gray-400">
              Track your progress through the spatial thinking modules
            </p>
          </div>

          {/* Progress Tracker Component */}
          <StudentProgressTracker 
            studentData={studentData} 
            courseData={courseData}
          />
        </div>
      </main>
    </div>
  );
}