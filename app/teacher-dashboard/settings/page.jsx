"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { generateStudentCode } from "../../../utils/helpers";
import Sidebar from "../../../components/Sidebar";
import MainContent from "../../../components/MainContent";
import VisibilityTable from "../../../components/VisibilityTable";
import StudentTable from "../../../components/StudentTable";
import { retrieveCourseSettings, updateCourseSettings } from "../../actions";

export default function Settings() {
  const [studentSettingsOpen, setStudentSettingsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const router = useRouter();
  const [courseData, setCourseData] = useState(null);
  const [courseSettings, setCourseSettings] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [moduleData, setModuleData] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create refs to access child component methods
  const studentTableRef = useRef();
  const moduleTableRef = useRef();
  const quizTableRef = useRef();
  
  // Function to fetch course settings
  const fetchCourseSettings = async () => {
    setIsLoading(true);
    const storedData = sessionStorage.getItem("courseData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setCourseData(parsedData);

      const response = await retrieveCourseSettings({ id: parsedData.id });
      if (response.success) {
        const settings = response.data;

        // Parse JSON fields immediately
        const parsedStudentSettings = JSON.parse(settings.student_settings || "{}");
        const parsedModuleSettings = JSON.parse(settings.module_settings || "[]");
        const parsedQuizSettings = JSON.parse(settings.quiz_settings || "[]");

        // Set State
        setCourseSettings(settings);
        setStudentData(parsedStudentSettings);
        setModuleData(parsedModuleSettings);
        setQuizData(parsedQuizSettings);
      } else {
        console.error("Error retrieving course settings:", response.error);
        setSaveMessage({
          type: 'error',
          text: 'Failed to load course settings. Please try refreshing the page.'
        });
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCourseSettings();
  }, []);

  const handleSaveChanges = async () => {
    if (!courseData || !courseSettings) {
      setSaveMessage({
        type: 'error',
        text: 'Course data not found. Please try refreshing the page.'
      });
      return;
    }
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });
    try {
      const updatedStudentData = studentTableRef.current?.getUpdatedData() || studentData;
      const updatedModuleData = moduleTableRef.current?.getUpdatedData() || moduleData;
      const updatedQuizData = quizTableRef.current?.getUpdatedData() || quizData;
      const payload = {
        courseId: courseData.id,
        studentSettings: JSON.stringify(updatedStudentData),
        moduleSettings: JSON.stringify(updatedModuleData),
        quizSettings: JSON.stringify(updatedQuizData)
      };
      const result = await updateCourseSettings(payload);
      if (result.success) {
        setSaveMessage({
          type: 'success',
          text: 'Course settings updated successfully!'
        });
        await fetchCourseSettings();
      } else {
        setSaveMessage({
          type: 'error',
          text: `Failed to update settings: ${result.error}`
        });
      }
    } catch (error) {
      console.error("Error saving course settings:", error);
      setSaveMessage({
        type: 'error',
        text: 'An unexpected error occurred while saving.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !courseData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white text-4xl font-bold">
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
        isSidebarOpen={studentSettingsOpen}
        setIsSidebarOpen={setStudentSettingsOpen}
        courseData={courseData}
      />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto mb-6 p-4 bg-gray-800 rounded-lg shadow-md text-center">
          <p className="text-lg">
            This is your course settings page. The student table will allow you to input information regarding the students in your course and provide them their join codes. The module and quiz visibility tables will allow you to toggle the visibility of modules and quizzes for your students.
          </p>
          <p className="mt-3 font-bold text-yellow-300">
            Please make sure to always press SUBMIT CHANGES at the bottom when you are done making changes. Your changes WILL NOT save until you press SUBMIT CHANGES.
          </p>
        </div>

        {/* Show save message if present */}
        {saveMessage.text && (
          <div className={`mb-4 p-3 rounded-lg text-center font-bold ${
            saveMessage.type === 'success' ? 'bg-green-800 text-white' : 'bg-red-800 text-white'
          }`}>
            {saveMessage.text}
          </div>
        )}

        <StudentTable
          ref={studentTableRef}
          tableTitle={"Student Information"}
          tableData={studentData}
        />
        <VisibilityTable
          ref={moduleTableRef}
          tableTitle={"Module Visibility"}
          tableData={moduleData}
          moniker={"Module"}
        />
        <VisibilityTable
          ref={quizTableRef}
          tableTitle={"Quiz Visibility"}
          tableData={quizData}
          moniker={"Quiz"}
        />
        
        <div className="mt-3 border border-gray-600 rounded bg-gray-700 p-3 flex justify-center">
          <button 
            className={`${
              isSaving 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-700'
            } text-white font-bold py-2 px-4 rounded transition-colors duration-200`}
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Submit Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}