"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Help() {
  const [showTeacherGif, setShowTeacherGif] = useState(false);
  const [showStudentGif, setShowStudentGif] = useState(false);

  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center"> How does this platform work? </h1>
      <p className="text-xl mb-8 text-center">
      Spatial Thinking is an accountless platform to help students learn about spatial thinking.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Teacher section */}
        <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-400">For Teachers:</h2>
          <p className="text-lg mb-4 text-center">
            Create a course and share the link with your students.
          </p>
          
          <button
            onClick={() => setShowTeacherGif(!showTeacherGif)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors mb-4"
          >
            {showTeacherGif ? "Hide Demo" : "Show How It Works"}
          </button>
          
          {showTeacherGif && (
            <div className="relative w-full h-64 mt-2 overflow-hidden rounded-md">
              <Image
                src="/teacher-demo.gif" // Make sure to add this GIF to your public folder
                alt="Teacher demonstration"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          )}
        </div>

        {/* Student section */}
        <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-green-400">For Students:</h2>
          <p className="text-lg mb-4 text-center">
            Join your teacher's course using the provided code.
          </p>
          
          <button
            onClick={() => setShowStudentGif(!showStudentGif)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors mb-4"
          >
            {showStudentGif ? "Hide Demo" : "Show How It Works"}
          </button>
          
          {showStudentGif && (
            <div className="relative w-full h-64 mt-2 overflow-hidden rounded-md">
              <Image
                src="/student-demo.gif" // Make sure to add this GIF to your public folder
                alt="Student demonstration"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center">
              <button
                onClick={() => router.push("/")}
                className="mt-10 text-blue-300 hover:text-blue-200 transition-colors text-sm"
              >
                Return to Home
              </button>
            </div>
    </div>
  );
}