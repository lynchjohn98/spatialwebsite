"use client";
import { retrieveTeacherCourse } from "../../services/teacher_actions";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function TeacherJoin() {
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoinCodeChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    if (
      value.length === 4 &&
      !value.includes("-") &&
      joinCode.length < value.length
    ) {
      value = value + "-";
    }
    if (value.includes("-") && value.indexOf("-") !== 4) {
      const parts = value.split("-");
      const combinedValue = parts.join("");

      if (combinedValue.length <= 4) {
        value = combinedValue;
      } else {
        value =
          combinedValue.substring(0, 4) + "-" + combinedValue.substring(4, 8);
      }
    }
    if (value.length <= 9) {
      setJoinCode(value);
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (joinCode.length < 9 || !joinCode.includes("-")) {
      setError("Please enter a complete course join code");
      return;
    }

    setIsLoading(true);

    try {
      const result = await retrieveTeacherCourse({
        joinCode: joinCode.toUpperCase(),
      });

      if (result.error) {
        console.error("Error joining course:", result.error);
        console.log(result);
        console.log(result.error);
        setError("Invalid credentials. Access denied.");
      } else {
        sessionStorage.setItem("courseData", JSON.stringify(result.data));
        router.push("/teacher/dashboard");
      }
    } catch (error) {
      console.error("Error joining course:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Sticky Header with Back Button */}
      <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/teacher/homepage")}
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
              <span className="font-medium">Return to Teacher Homepage</span>
            </button>

            <div className="text-sm text-gray-400">
              Access your course's teacher dashboard.
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4 py-8">
        <h1 className="text-3xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Join Course as Teacher
        </h1>
        <div className="w-full max-w-md">
          <div className="bg-gray-800/50 border border-gray-600 p-6 rounded-lg shadow-lg mb-8">
            <p className="text-gray-300 text-center mb-4">
              Enter the course join code to access the teacher dashboard of the
              course.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="text-gray-400 text-sm">
                Need your course codes?
              </span>
              <button
                onClick={() => router.push("/teacher/courses")}
                className="text-blue-300 hover:text-blue-200 underline transition-colors font-medium"
              >
                View Your Courses →
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-800 text-white p-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label className="block text-lg font-medium mb-2">
                Course Join Code
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={handleJoinCodeChange}
                className="w-full px-4 py-3 rounded bg-blue-200 text-black text-center font-mono text-lg tracking-wider"
                placeholder="XXXX-XXXX"
                autoComplete="off"
              />
              <p className="text-sm text-gray-400 mt-1">
                Format: XXXX-XXXX (letters and numbers only)
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-3 rounded-md font-medium transition-colors
                  ${
                    isLoading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
              >
                {isLoading ? "Connecting..." : "Access Course"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
