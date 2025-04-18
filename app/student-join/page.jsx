"use client";
import { studentCourseJoin } from "../actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentJoin() {
  const [studentJoinCode, setStudentJoinCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleJoinCodeChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    //Can you add checks to ensure it is exactly 6
    setStudentJoinCode(value);
  };

  const handleSubmit = async () => {
    setError("");
    if (studentJoinCode.length != 6) {
      setError("Please enter the 6 digit student course join code provided by your teacher. Your teacher may regenerate a new code if errors persist.");
      return;
    }
    setIsLoading(true);  
    try {
      const result = await studentCourseJoin({ 
        studentJoinCode: studentJoinCode.toUpperCase(),
      });
      
      if (result.error) {
        setError("Invalid credentials. Access denied.");
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
     <div className="flex flex-col items-center justify-center flex-1 w-full px-4 py-8">
        <div className="w-full max-w-md">
          <div className="p-6 rounded-lg shadow-lg mb-8">
            <h1 className="text-2xl font-bold mb-1 text-center">Join Course as Student</h1>
            
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
                Enter Your Student Join Code
              </label>
              <input
                type="text"
                value={studentJoinCode}
                onChange={handleJoinCodeChange}
                className="w-full px-4 py-3 rounded bg-blue-200 text-black text-center font-mono text-lg tracking-wider"
                placeholder="XXXXXX"
                autoComplete="off"
              />
              <p className="text-sm text-gray-400 mt-1">
                Format: XXXXXX (A combination of six letters and numbers)
              </p>
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

