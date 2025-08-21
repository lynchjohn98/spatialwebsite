
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/teacher_components/TeacherSidebar";
import { useTeacherSidebar } from "../../utils/hooks/useTeacherSidebar"; // Import the hook

export default function TeacherDashboard() {

  const router = useRouter();
  const { isSidebarOpen, setIsSidebarOpen } = useTeacherSidebar(); // Use the hook
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("courseData");
    if (storedData) {
      try {
        setCourseData(JSON.parse(storedData));
      } catch (error) {
        sessionStorage.removeItem("courseData");
        router.push("/teacher-join");
      }
    } else {
      router.push("/teacher-join");
    }
  }, [router]);

  if (!courseData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white text-xl">
        Loading...
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

      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-1/4" : ""
        }`}
      >
        <div className="lg:hidden mb-6 pt-8"></div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Dashboard</h1>
            <p className="text-xl mb-4 text-blue-300">
              Welcome to your spatial thinking course.
            </p>
            <p className="mb-6">
              Please use the navigation on the left side to access the course
              materials.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}