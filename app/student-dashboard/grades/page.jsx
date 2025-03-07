"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentSidebar from "../../../components/StudentSidebar";

export default function Grades() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    const loadData = () => {
      setIsLoading(true);
      const storedCourseData = sessionStorage.getItem("courseData");
      const storedStudentData = sessionStorage.getItem("studentData");
      if (storedCourseData && storedStudentData) {
        try {
          const parsedCourseData = JSON.parse(storedCourseData);
          setCourseData(parsedCourseData);

          const parsedStudentData = JSON.parse(storedStudentData);
          setStudentData(parsedStudentData);

          setIsLoading(false);
        } catch (error) {
          console.error("Error parsing session data:", error);
          sessionStorage.removeItem("courseData");
          sessionStorage.removeItem("studentData");
          router.push("/student-join");
        }
      } else {
        router.push("/student-join");
      }
    };
    loadData();
    return () => window.removeEventListener("resize", checkWindowSize);
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
    </div>
  );
}
