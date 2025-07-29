"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ResponsiveButton from "../../../components/page_blocks/ResponsiveButton";

export default function TeacherHomePage() {
  const router = useRouter();
  const [teacherData, setTeacherData] = useState(null);
  const [trainingCompleted, setTrainingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only access sessionStorage on the client-side
    try {
      const storedData = sessionStorage.getItem("teacherData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setTeacherData(parsedData);
        setTrainingCompleted(parsedData?.training_complete || false);
      }
    } catch (error) {
      console.error("Error parsing teacher data from sessionStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Show loading state while checking sessionStorage
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!trainingCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Teacher Home Page</h1>
        <p className="text-lg">Welcome to the teacher home page {teacherData?.username || "Guest"}</p>
        <p> Records indicate that this is a new profile and you have not completed the training yet. Please do so by following the below link. </p>
        <div className="mt-8 w-full max-w-2xl">
          <ResponsiveButton
          onClick={() => router.push("/teacher/training")}
          label="Complete your Teacher Training"
        />
        </div>
        
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">Teacher Home Page!</h1>
      <p className="text-lg">
        Welcome to the teacher home page test! {teacherData?.username || "Guest"}
      </p>

      <div className="mt-8 w-full max-w-2xl">
        <button
          onClick={() => router.push("/teacher/training")}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Training has been completed.
        </button>
      </div>
    </div>
  );
}