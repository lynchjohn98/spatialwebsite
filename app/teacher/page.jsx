"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { validateTeacherCode } from "../../utils/helpers";
import ResponsiveButton from "../../components/page_blocks/ResponsiveButton";

export default function TeacherMainPage() {
  const router = useRouter();
  const [adminCode, setAdminCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminCodeSubmit = async () => {
    setError("");
    if (!adminCode.trim()) {
      setError("Please enter the admin passcode");
      setError("");
      return;
    }
    if (validateTeacherCode(adminCode.trim())) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid admin passcode. Access denied.");
      setAdminCode("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdminCodeSubmit();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const resetAuthentication = () => {
    setIsAuthenticated(false);
    setAdminCode("");
    setError("");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Admin Access Required</h1>
            <p className="text-gray-400">
              Please enter the admin passcode to access the teacher portal
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-600 text-white rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2">
                Admin Passcode:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 pr-12 rounded bg-blue-200 text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter admin passcode"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.414 1.414M14.12 14.12L9.878 9.878m4.242 4.242L9.878 9.878"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="w-full ">
              <ResponsiveButton
                onClick={handleAdminCodeSubmit}
                label="Submit Admin Passcode"
                className="w-full py-3 rounded-md font-medium transition-colors bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white"
              />
              
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
      <div className="w-full max-w-md sm:max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center flex-1">
            Welcome to Spatial Thinking for Teachers
          </h1>
        </div>

        <div className="flex flex-col items-center space-y-12 mb-8">
          <div className="w-full sm:w-1/2">
            <ResponsiveButton
              label="Log Into Your Teacher Account"
              onClick={() => router.push("/teacher/login")}
            />
      
          </div>

          <div className="w-full sm:w-1/2">
            <ResponsiveButton
              label="Create Your Teacher Account"
              onClick={() => router.push("/teacher/create")}
            />
            
          </div>

          <div className="w-full sm:w-1/2">
            <ResponsiveButton
              label="Need Help? View Teacher Walkthrough"
              onClick={() => router.push("/teacher/walkthrough")}
            />
            
          </div>
        </div>
      </div>
    </div>
  );
}
