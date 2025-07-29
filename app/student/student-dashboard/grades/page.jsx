"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentSidebar from "../../../components/student_components/StudentSidebar";
import StudentGradeTable from "../../../components/student_components/StudentGradeTable";
import { fetchGradesStudent } from "../../actions";
export default function Grades() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gradeData, setGradeData] = useState(null);
  useEffect(() => {
    // Window size handling
    const checkWindowSize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", checkWindowSize);
    checkWindowSize();
    
    // Combined data loading function
    const loadData = async () => {
      setIsLoading(true);
      
      // Get session data
      const storedCourseData = sessionStorage.getItem("courseData");
      const storedStudentData = sessionStorage.getItem("studentData");
      
      if (!storedCourseData || !storedStudentData) {
        router.push("/student-join");
        return;
      }
      
      try {
        // Parse session data
        const parsedCourseData = JSON.parse(storedCourseData);
        const parsedStudentData = JSON.parse(storedStudentData);
        
        setCourseData(parsedCourseData);
        setStudentData(parsedStudentData);
        
        // Fetch grades using the loaded data
        const gradesResponse = await fetchGradesStudent({ 
          student_id: parsedStudentData.id,
          course_id: parsedCourseData.id 
        });
        
        if (gradesResponse.success) {
          setGradeData(gradesResponse.data);
        } else {
          console.error("Error retrieving grades:", gradesResponse.error);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        sessionStorage.removeItem("courseData");
        sessionStorage.removeItem("studentData");
        router.push("/student-join");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Cleanup
    return () => window.removeEventListener("resize", checkWindowSize);
  }, [router]);

  if (isLoading || !courseData || !studentData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white text-xl">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <StudentSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        courseData={courseData}
        studentData={studentData}
      />
      <main>

        <StudentGradeTable gradesData={gradeData} /> 
      </main>
      
    </div>
  );
}