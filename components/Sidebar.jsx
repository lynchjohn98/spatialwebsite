"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Hamburger Button Component that shows on mobile/tablet
function HamburgerButton({ onClick, isSidebarOpen }) {
  return (
    <button
      className={`fixed top-4 left-4 z-50 p-2 rounded-md transition-all duration-300 lg:hidden
        ${
          isSidebarOpen
            ? "bg-transparent"
            : "bg-blue-600 shadow-lg hover:bg-blue-700"
        }`}
      onClick={onClick}
      aria-label={
        isSidebarOpen ? "Close navigation menu" : "Open navigation menu"
      }
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
          <>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </>
        ) : (
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

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  courseData,
}) {
  const router = useRouter();
  const [activeRoute, setActiveRoute] = useState("");
  useEffect(() => {
    const path = window.location.pathname;
    setActiveRoute(path);
  }, []);

  const handleNavigation = (route) => {
    if (courseData) {
      const queryString = new URLSearchParams(courseData).toString();
      router.push(`${route}?${queryString}`);
    } else {
      router.push(route);
    }
  };
  const handleMobileNavClick = (route) => {
    setActiveRoute(route);
    router.push(route);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen, setIsSidebarOpen]);
  return (
    <>
      <HamburgerButton
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}
      <aside
        className={`fixed lg:relative w-72 lg:w-1/4 min-h-screen bg-gray-800 p-6 transition-all duration-300 ease-in-out z-40
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          shadow-lg
        `}
        aria-hidden={!isSidebarOpen && window.innerWidth < 1024}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
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

        {courseData && (
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <div className="flex flex-col space-y-3">
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
                    {courseData.teacher_name}
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
                    {courseData.school_name}
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
            label="Homepage"
            route="/teacher-dashboard/"
            isActive={activeRoute === "/teacher-dashboard"}
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
            route="/teacher-dashboard/modules"
            isActive={activeRoute === "/teacher-dashboard/modules"}
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
            route="/teacher-dashboard/quizzes"
            isActive={activeRoute === "/teacher-dashboard/quizzes"}
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
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            }
            label="Teacher Dashboard"
            route="/teacher-dashboard/settings"
            isActive={activeRoute === "/teacher-dashboard/settings"}
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
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            }
            label="Student Grades"
            route="/teacher-dashboard/grades" // Change this from "/teacher-dashboard/settings"
            isActive={activeRoute === "/teacher-dashboard/grades"}
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
