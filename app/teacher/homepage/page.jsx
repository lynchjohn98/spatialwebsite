"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ResponsiveButton from "../../../components/page_blocks/ResponsiveButton";

export default function TeacherHomePage() {
  const router = useRouter();
  const [teacherData, setTeacherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const storedData = JSON.parse(sessionStorage.getItem("teacherData"));
        if (!storedData?.id) {
          console.error("No teacher ID found in sessionStorage");
          setIsLoading(false);
          return;
        }
        const result = await getTeacherData(storedData);
        if (result.success && result.data) {
          const freshData = result.data;
          setTeacherData(freshData);
          sessionStorage.setItem("teacherData", JSON.stringify(freshData));
        } else {
          setTeacherData(storedData);
        }
      } catch (error) {
        console.error("Error loading teacher data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeacherData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }


    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">
          Teacher Home Page
        </h1>
        <p className="text-lg">
          Welcome {teacherData?.username || "Guest"}
        </p>     
        <div className="mt-8 w-full max-w-2xl">
          <ResponsiveButton
            onClick={() => router.push("/teacher/training")}
            label="Teacher Training"
          />
        </div>
        <div className="mt-8 w-full max-w-2xl">
          <ResponsiveButton
            onClick={() => router.push("/teacher/join")}
            label="Join Course"
          />
        </div>
      <div className="mt-8 w-full max-w-2xl">
        <ResponsiveButton
          onClick={() => router.push("/teacher/create-course")}
          label="Create Course"
        />
      </div>
      <div className="mt-8 w-full max-w-2xl">
        <ResponsiveButton

          onClick={() => router.push("/teacher/teacher-courses")}
          label="View Your Courses"
        />
      </div>
      <div className="mt-8 w-full max-w-2xl">
        <ResponsiveButton
          onClick={() => router.push("/teacher/help")}
          label="Need help? Click here"
        />
      </div>
      </div>
    );
  }


