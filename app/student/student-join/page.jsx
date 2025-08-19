"use client";
import { studentCourseJoin } from "../../library/services/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentJoin() {
  const [studentJoinCode, setStudentJoinCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleJoinCodeChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    
    // Limit to exactly 8 characters
    if (value.length <= 8) {
      setStudentJoinCode(value);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (studentJoinCode.length !== 8) {
      setError("Please enter the complete 8-character code provided by your instructor.");
      return;
    }
    setIsLoading(true);  
    try {
      const result = await studentCourseJoin({ 
        studentJoinCode: studentJoinCode.toUpperCase(),
      });
      
      if (result.error) {
        setError("Invalid join code. Please check with your instructor and try again.");
      } else {
        console.log(result);
        
        // Store student data separately
        sessionStorage.setItem("studentData", JSON.stringify(result.data.student));
        
        // Store course data (containing course object and settings)
        sessionStorage.setItem("courseData", JSON.stringify(result.data.courseData));
        
        // Optionally, store module and quiz data separately for easier access
        const moduleSettings = result.data.courseData.settings.module_settings;
        const quizSettings = result.data.courseData.settings.quiz_settings;
        
        if (moduleSettings) {
          sessionStorage.setItem("moduleData", moduleSettings);
        }
        
        if (quizSettings) {
          sessionStorage.setItem("quizData", quizSettings);
        }
        
        router.push("/student-dashboard");
      }
    } catch (error) {
      console.error("Error joining course:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg">Joining course...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait while we connect you</p>
        </div>
      </div>
    );
  }

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

            <div className="text-sm text-gray-400">Student Access</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Join Course
            </h1>
            <p className="text-gray-400 leading-relaxed">
              Enter the join code provided by your instructor to access your spatial thinking course
            </p>
          </div>

          {/* Join Form */}
          <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-6 sm:p-8 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-600/20 border border-red-500 text-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Join Code Input */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Course Join Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={studentJoinCode}
                  onChange={handleJoinCodeChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white text-center font-mono text-lg tracking-wider placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors"
                  placeholder="ABCD-1234"
                  autoComplete="off"
                  maxLength={8}
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-400">
                  Enter the 8-character code exactly as provided by your instructor
                </p>
              </div>
              
              {/* Character count indicator */}
              <div className="mt-2 flex justify-between items-center">
                <div className="flex gap-1">
                  {[...Array(8)].map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index < studentJoinCode.length
                          ? 'bg-green-500'
                          : 'bg-gray-600'
                      }`}
                    ></div>
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {studentJoinCode.length}/8
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                onClick={handleSubmit}
                disabled={isLoading || studentJoinCode.length !== 8}
                className="w-full py-3 rounded-lg font-medium transition-colors bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white"
              >
                {isLoading ? "Joining Course..." : "Join Course"}
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Need Help?
            </h3>
            <div className="space-y-3 text-sm text-gray-400">
              <p>• Ask your instructor for the correct join code</p>
              <p>• Make sure you enter all 8 characters</p>
              <p>• The code is case-sensitive and may contain letters and numbers</p>
              <p>• Contact your instructor if you continue having issues</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
         
            <button
              onClick={() => router.push("/")}
              className="text-green-400 hover:text-green-300 text-sm underline transition-colors"
            >
              Return to Homepage →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}