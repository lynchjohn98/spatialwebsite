"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import MainContent from "../../components/MainContent";


export default function TeacherDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const router = useRouter();

  



  useEffect(() => {
    const storedData = sessionStorage.getItem("courseData");
    if (storedData) {
      try {
        setCourseData(JSON.parse(storedData)); // ✅ Parse data and set state
        console.log("Course data loaded", JSON.parse(storedData));
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
        pageTitle="Dashboard"
        pageContent="This is the main content area. Add tables, charts, and other interactive elements here. 
        Please interact with the menu on the left side to navigate the learning system."
      />
    </div>
  );
}
