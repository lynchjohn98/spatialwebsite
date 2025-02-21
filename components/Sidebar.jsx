"use client";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, courseData }) {
  const router = useRouter();


  const handleNavigation = (route) => {
    if (courseData) {
      const queryString = new URLSearchParams(courseData).toString(); // ✅ Convert to URL string
      router.push(`${route}?${queryString}`);
    } else {
      router.push(route);
    }
  };

  useEffect(() => {
    console.log("THIS RAN FIRST");
  }, []);

  return (
    <>
      {/* ✅ Dark Overlay - Only on Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)} // Click outside to close
        ></div>
      )}

      {/* ✅ Sidebar - Stays Open on Desktop */}
      <aside
        className={`fixed md:relative w-64 md:w-1/4 min-h-screen bg-gray-800 p-6 transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* ✅ Sidebar Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Spatial Visualization</h1>
          {/* Close Button - Only on Mobile */}
          <button
            className="bg-gray-700 p-1 rounded md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* ✅ Teacher Info */}
        <h2><b>Teacher:</b> {courseData.teacher_name }</h2>
        <h2><b>School:</b> {courseData.school_name }</h2>

        {/* ✅ Sidebar Navigation */}
        <nav className="mt-4 space-y-4">
          <button
            className="block w-full text-left p-2 bg-gray-700 rounded-lg hover:bg-red-600"
            onClick={() => router.push("/teacher-dashboard/modules")}
          >
            Modules
          </button>
          <button
            className="block w-full text-left p-2 bg-gray-700 rounded-lg hover:bg-red-600"
            onClick={() => router.push("/teacher-dashboard/quizzes")}
          >
            Quizzes
          </button>
          <button
            className="block w-full text-left p-2 bg-gray-700 rounded-lg hover:bg-red-600"
            onClick={() => router.push("/teacher-dashboard/settings")}
          >
            Teacher Dashboard
          </button>
        </nav>
      </aside>
    </>
  );
}
