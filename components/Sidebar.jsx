"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, courseData }) {
  const router = useRouter();

  // Handle navigation with query params
  const handleNavigation = (route) => {
    if (courseData) {
      const queryString = new URLSearchParams(courseData).toString();
      router.push(`${route}?${queryString}`);
    } else {
      router.push(route);
    }
  };

  // Close sidebar when clicking navigation links on mobile
  const handleMobileNavClick = (route) => {
    router.push(route);
    
    // Only close on mobile
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Add keyboard support for accessibility (close on Escape key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, setIsSidebarOpen]);

  return (
    <>
      {/* Dark Overlay - Only on Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 md:w-1/4 min-h-screen bg-gray-800 p-6 transition-all duration-300 ease-in-out z-40
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          shadow-lg
        `}
        aria-hidden={!isSidebarOpen && window.innerWidth < 768}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Spatial Visualization</h1>
          
          {/* Close Button - Only on Mobile */}
          <button
            className="bg-gray-700 hover:bg-gray-600 p-2 rounded md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close navigation menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Teacher Info */}
        {courseData && (
          <div className="mb-6 px-2">
            <h2 className="text-sm"><b>Teacher:</b> {courseData.teacher_name}</h2>
            <h2 className="text-sm mt-1"><b>School:</b> {courseData.school_name}</h2>
          </div>
        )}

        {/* Sidebar Navigation */}
        <nav className="mt-4 space-y-3">
          <button
            className="block w-full text-left p-3 bg-gray-700 rounded-lg hover:bg-red-600 transition-colors"
            onClick={() => handleMobileNavClick("/teacher-dashboard/modules")}
          >
            Modules
          </button>
          <button
            className="block w-full text-left p-3 bg-gray-700 rounded-lg hover:bg-red-600 transition-colors"
            onClick={() => handleMobileNavClick("/teacher-dashboard/quizzes")}
          >
            Quizzes
          </button>
          <button
            className="block w-full text-left p-3 bg-gray-700 rounded-lg hover:bg-red-600 transition-colors"
            onClick={() => handleMobileNavClick("/teacher-dashboard/settings")}
          >
            Teacher Dashboard
          </button>
          
          {/* Example additional menu item */}
          <button
            className="block w-full text-left p-3 bg-gray-700 rounded-lg hover:bg-red-600 transition-colors"
            onClick={() => handleMobileNavClick("/")}
          >
            Back to Home
          </button>
        </nav>
      </aside>
    </>
  );
}