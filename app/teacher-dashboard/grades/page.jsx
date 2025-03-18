"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { retrieveStudentData } from "../../actions";
import Sidebar from "../../../components/Sidebar";

export default function Grades() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [gradeData, setGradeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const loadData = useCallback(async () => {
    if (!isMounted) return;
    setIsLoading(true);
    try {
      const storedData = sessionStorage.getItem("courseData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setCourseData(parsedData);
        console.log(parsedData);
        const studentResponse = await retrieveStudentData(parsedData.id);
        if (studentResponse.data) {
          setStudentData(studentResponse.data);
          console.log("Final data provided here:", studentData);
        } else {
            console.log("studentResponse if did not work");
        }
      }
    } catch (error) {
      console.error("Error loading course data:", error);
      router.push("/teacher-join");
    } finally {
      setIsLoading(false);
    }
  }, [router, isMounted]);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const checkWindowSize = () => {
        setIsSidebarOpen(window.innerWidth >= 1024);
      };
      
      checkWindowSize();
      window.addEventListener('resize', checkWindowSize);
      
      return () => window.removeEventListener('resize', checkWindowSize);
    }
  }, []);
  useEffect(() => {
    if (isMounted) {
      loadData();
    }
  }, [loadData, isMounted]);
  if (!isMounted) {
    return null;
  }
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white text-4xl font-bold">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p>Loading...</p>
        </div>
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
      <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-1/4' : ''}`}>
        <div className="lg:hidden mb-6 pt-8">
        </div>
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Student Grades</h1>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <p>This is the student grades page. Here you'll be able to view and manage student grades.</p>
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-3">Example Grade Data</h2>
                  <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="p-3 border border-gray-600">Student</th>
                      <th className="p-3 border border-gray-600">Quiz</th>
                      <th className="p-3 border border-gray-600">Score</th>
                      <th className="p-3 border border-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gray-700 hover:bg-gray-600">
                      <td className="p-3 border border-gray-600">John Doe</td>
                      <td className="p-3 border border-gray-600">Module 1 Quiz</td>
                      <td className="p-3 border border-gray-600">85%</td>
                      <td className="p-3 border border-gray-600">2023-09-15</td>
                    </tr>
                    <tr className="bg-gray-700 hover:bg-gray-600">
                      <td className="p-3 border border-gray-600">Jane Smith</td>
                      <td className="p-3 border border-gray-600">Module 2 Quiz</td>
                      <td className="p-3 border border-gray-600">92%</td>
                      <td className="p-3 border border-gray-600">2023-09-18</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}