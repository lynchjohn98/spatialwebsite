"use client";
import { retrieveTeacherCourse } from "../actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherJoin() {
  const [joinCode, setJoinCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleJoinCodeChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (value.length === 4 && !value.includes('-') && joinCode.length < value.length) {
      value = value + '-';
    }
    if (value.includes('-') && value.indexOf('-') !== 4) {
      const parts = value.split('-');
      const combinedValue = parts.join('');
      
      if (combinedValue.length <= 4) {
        value = combinedValue;
      } else {
        value = combinedValue.substring(0, 4) + '-' + combinedValue.substring(4, 8);
      }
    }
    
    // Limit to 9 characters (4 + dash + 4)
    if (value.length <= 9) {
      setJoinCode(value);
    }
  };

  const handleSubmit = async () => {
    // Clear any previous errors
    setError("");
    
    // Basic validation
    if (joinCode.length < 9 || !joinCode.includes('-')) {
      setError("Please enter a complete course join code");
      return;
    }
    
    if (password.length < 1) {
      setError("Please enter your teacher password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await retrieveTeacherCourse({ 
        joinCode: joinCode.toUpperCase(),
        password: password 
      });
      
      if (result.error) {
        setError("Invalid credentials. Access denied.");
      } else {
        sessionStorage.setItem("courseData", JSON.stringify(result.data));
        router.push("/teacher-dashboard");
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
     <div className="flex flex-col items-center justify-center flex-1 w-full px-4 py-8">
        <div className="w-full max-w-md">
          <div className="p-6 rounded-lg shadow-lg mb-8">
            <h1 className="text-2xl font-bold mb-1 text-center">Join Course as Teacher</h1>
            
            <p className="text-center">
              Enter the course join code and password you created during the course setup.
            </p>
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
            
            <div>
              <label className="block text-lg font-medium mb-2">
                Teacher Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded bg-blue-200 text-black"
                placeholder="Enter your teacher password"
              />
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-3 rounded-md font-medium transition-colors
                  ${isLoading 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'}`}
              >
                {isLoading ? 'Connecting...' : 'Access Course'}
              </button>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => router.push("/")}
                className="text-blue-300 hover:text-blue-200 transition-colors text-sm"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}