"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import MainContent from "../../../components/MainContent";

export default function Modules() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = sessionStorage.getItem("courseData");
    if (storedData) {
      try {
        setCourseData(JSON.parse(storedData)); // ✅ Parse data and set state
      } catch (error) {
        sessionStorage.removeItem("courseData");
        router.push("/teacher-join"); // Redirect if data is corrupted
      }
    } else {
      router.push("/teacher-join"); // Redirect if no data
    }
  }, []);

  if (!courseData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white text-4xl font-bold">
        Loading...
      </div>
    );
  }
  

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        courseData={courseData}
      />

      <MainContent
        pageTitle="All Modules"
        pageContent="Please select from the list of modules below."
      />
    </div>
  );
}
