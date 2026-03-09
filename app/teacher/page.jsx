"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { validateTeacherCode } from "../library/helpers/clienthelpers";
import ResponsiveButton from "../../components/page_blocks/ResponsiveButton";

export default function TeacherMainPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on component mount
  useEffect(() => {
    const storedAuth = sessionStorage.getItem("isAdminAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);


  const handleNavigation = (path) => {
    // Set authentication in sessionStorage before navigation
    sessionStorage.setItem("isAdminAuthenticated", "true");
    router.push(path);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Main teacher portal screen
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      {/* Sticky Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/")}
              className="flex items-center text-gray-300 hover:text-white transition-colors group"
            >
              <svg
                className="h-5 w-5 mr-2 group-hover:translate-x-[-2px] transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Back to Homepage</span>
            </button>

            <div className="text-sm text-gray-400">Teacher Portal</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Spatial Thinking for Teachers
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Enhance your teaching with spatial thinking techniques and
              interactive learning modules
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Login Card - Full Card Clickable */}
            <button
              onClick={() => handleNavigation("/teacher/login")}
              className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 hover:border-blue-500 transition-all duration-200 hover:scale-[1.02] text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M4 12h11"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Existing Teachers
                </h3>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                  Access your existing teacher account.
                </p>
                <div className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors inline-block">
                  Log Into Account
                </div>
              </div>
            </button>

            {/* Create Account Card - Full Card Clickable */}
            <button
              onClick={() => handleNavigation("/teacher/create")}
              className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 hover:border-green-500 transition-all duration-200 hover:scale-[1.02] text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  New Teachers
                </h3>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                  Create your teacher account for use in the portal.
                </p>
                <div className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors inline-block">
                  Create Account
                </div>
              </div>
            </button>

            {/* Help Card - Full Card Clickable */}
            <button
              onClick={() => handleNavigation("/teacher/walkthrough")}
              className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 hover:border-purple-500 transition-all duration-200 hover:scale-[1.02] text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Need Help?
                </h3>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                  View our comprehensive walkthrough and getting started guide
                </p>
                <div className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors inline-block">
                  View Walkthrough
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
