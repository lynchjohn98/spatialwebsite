"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateStudentCode } from "../../../utils/helpers";
import Sidebar from "../../../components/Sidebar";
import MainContent from "../../../components/MainContent";
import VisibilityTable from "../../../components/VisibilityTable";
import StudentTable from "../../../components/StudentTable";
import { retrieveCourseSettings } from "../../actions";

export default function Settings() {
  const [studentSettingsOpen, setStudentSettingsOpen] = useState(false);
  const router = useRouter();
  const [courseData, setCourseData] = useState(null);
  const [courseSettings, setCourseSettings] = useState(null);

  const [studentData, setStudentData] = useState([]);
  const [moduleData, setModuleData] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // ✅ Track loading state

  useEffect(() => {
    const fetchCourseSettings = async () => {
      setIsLoading(true); // ✅ Start loading
      const storedData = sessionStorage.getItem("courseData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setCourseData(parsedData);

        const response = await retrieveCourseSettings({ id: parsedData.id });
        if (response.success) {
          const settings = response.data;

          // ✅ Parse JSON fields immediately
          const parsedStudentSettings = JSON.parse(settings.student_settings || "{}");
          const parsedModuleSettings = JSON.parse(settings.module_settings || "[]");
          const parsedQuizSettings = JSON.parse(settings.quiz_settings || "[]");

          // ✅ Set State
          setCourseSettings(settings);
          setStudentData(parsedStudentSettings);
          setModuleData(parsedModuleSettings);
          setQuizData(parsedQuizSettings);
        } else {
          console.error("Error retrieving course settings:", response.error);
        }
      }
      setIsLoading(false);
    };

    fetchCourseSettings();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white text-4xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar
        isSidebarOpen={studentSettingsOpen}
        setIsSidebarOpen={setStudentSettingsOpen}
        courseData={courseData}
      />
      <div className="flex-1 p-6 overflow-auto">
        <StudentTable
          tableTitle={"Student Information"}
          tableData={studentData}
        />
        <VisibilityTable
          tableTitle={"Module Visibility"}
          tableData={moduleData}
          moniker={"Module"}
        />
        <VisibilityTable
          tableTitle={"Quiz Visibility"}
          tableData={quizData}
          moniker={"Quiz"}
        />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold center py-2 px-4 rounded">
          Submit Changes
        </button>
        
      </div>
      
    </div>
  );
}
