"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentSidebar from "../../../../components/student_components/StudentSidebar";
import { useStudentSidebar } from "../../../utils/hooks/useStudentSidebar"; // Import the hook

export default function StudentDashboard() {
  const router = useRouter();

  const {isSidebarOpen, setIsSidebarOpen} = useStudentSidebar();
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState(null);

   useEffect(() => {
    const storedCourseData = sessionStorage.getItem("courseData");
    const storedStudentData = sessionStorage.getItem("studentData");
    if (storedCourseData && storedStudentData) {
      try {
        const parsedCourseData = JSON.parse(storedCourseData);
        const parsedStudentData = JSON.parse(storedStudentData);
        
        // Log the parsed data directly
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
  }, [router]);

  if (!courseData || !studentData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white text-xl">
        Loading...
      </div>
    );  
  }

  return (
    <div className="flex">
      <StudentSidebar
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              courseData={courseData}
              studentData={studentData}
            /><div className="flex-1 p-4">
        <h1 className="text-2xl font-bold">Progress Page Test</h1>
        {/* Render progress data here */}
      </div>
    </div>
  );
}   
