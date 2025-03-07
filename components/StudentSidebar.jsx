"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Hamburger Button Component that shows on mobile/tablet
function HamburgerButton({ onClick, isSidebarOpen }) {
  return (
    <button
      className={`fixed top-4 left-4 z-50 p-2 rounded-md transition-all duration-300 lg:hidden
        ${isSidebarOpen 
          ? 'bg-transparent' 
          : 'bg-blue-600 shadow-lg hover:bg-blue-700'}`}
      onClick={onClick}
      aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {isSidebarOpen ? (
          // X icon when sidebar is open
          <>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </>
        ) : (
          // Hamburger icon when sidebar is closed
          <>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </>
        )}
      </svg>
    </button>
  );
}

export default function StudentSidebar({ isSidebarOpen, setIsSidebarOpen, courseData, studentData }) {
  const router = useRouter();
  const [activeRoute, setActiveRoute] = useState("");

  // Set active route based on current path
  useEffect(() => {
    const path = window.location.pathname;
    setActiveRoute(path);
  }, []);

  // Close sidebar when clicking navigation links on mobile
  const handleMobileNavClick = (route) => {
    setActiveRoute(route);
    router.push(route);

    // Only close on mobile/tablet
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // Add keyboard support for accessibility (close on Escape key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen, setIsSidebarOpen]);

  // Add the hamburger button for mobile
  return (
    <>
      {/* Hamburger Menu Button - Only visible on mobile/tablet */}
      <HamburgerButton 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen} 
      />

      {/* Dark Overlay - Only on Mobile/Tablet */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative w-72 lg:w-1/4 min-h-screen bg-gray-800 p-6 transition-all duration-300 ease-in-out z-40
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shadow-lg
        `}
        aria-hidden={!isSidebarOpen && window.innerWidth < 1024}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            {/* Spatial Blocks Icon */}
            <div className="mr-3 text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transform transition-transform duration-300 hover:rotate-12"
              >
                {/* Cube stack icon */}
                <path d="M7 9.5L12 12.5L17 9.5" />
                <path d="M7 13.5L12 16.5L17 13.5" />
                <path d="M12 5.5L17 8.5L12 11.5L7 8.5L12 5.5" />
                <rect
                  x="7"
                  y="8.5"
                  width="10"
                  height="8"
                  rx="1"
                  strokeWidth="0"
                  fill="currentColor"
                  fillOpacity="0.2"
                />
                <path d="M12 5.5V11.5" strokeOpacity="0.5" />
                <path d="M7 9.5V13.5" strokeOpacity="0.5" />
                <path d="M17 9.5V13.5" strokeOpacity="0.5" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">Spatial Thinking</h1>
          </div>

          {/* Close Button - Only on Mobile/Tablet */}
          <button
            className="bg-gray-700 hover:bg-gray-600 p-2 rounded lg:hidden transition-colors duration-200"
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

        {/* Student Information Card */}
        {studentData && courseData && (
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <div className="flex flex-col space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Student</p>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <h2 className="text-sm font-medium truncate">
                    {studentData.first_name} {studentData.last_name}
                  </h2>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Teacher</p>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <h2 className="text-sm font-medium truncate">
                    {courseData.course.teacher_name}
                  </h2>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">School</p>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <h2 className="text-sm font-medium truncate">
                    {courseData.course.school_name}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="mt-4 space-y-3">
          <NavButton
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
            }
            label="Dashboard"
            route="/student-dashboard"
            isActive={activeRoute === "/student-dashboard"}
            onClick={handleMobileNavClick}
          />

          <NavButton
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
            }
            label="Modules"
            route="/student-dashboard/modules"
            isActive={activeRoute === "/student-dashboard/modules"}
            onClick={handleMobileNavClick}
          />

          <NavButton
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            }
            label="Quizzes"
            route="/student-dashboard/quizzes"
            isActive={activeRoute === "/student-dashboard/quizzes"}
            onClick={handleMobileNavClick}
          />

          <NavButton
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <line x1="12" y1="6" x2="12" y2="18" />
                <line x1="9" y1="9" x2="9" y2="9" />
                <line x1="15" y1="15" x2="15" y2="15" />
              </svg>
            }
            label="Grades"
            route="/student-dashboard/grades"
            isActive={activeRoute === "/student-dashboard/grades"}
            onClick={handleMobileNavClick}
          />

          <div className="pt-2 mt-6 border-t border-gray-700"></div>

          <NavButton
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            }
            label="Back to Home"
            route="/"
            isActive={activeRoute === "/"}
            onClick={handleMobileNavClick}
          />
        </nav>
      </aside>
    </>
  );
}

// Navigation Button Component
function NavButton({ icon, label, route, isActive, onClick }) {
  return (
    <button
      className={`flex items-center w-full p-3 rounded-lg transition-all duration-200
        ${
          isActive
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-gray-200 hover:bg-blue-500 hover:text-white hover:translate-x-1"
        }
      `}
      onClick={() => onClick(route)}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </button>
  );
}