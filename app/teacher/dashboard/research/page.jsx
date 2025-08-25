"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/teacher_components/TeacherSidebar";
import ResearchConsentTable from "../../../../components/teacher_components/ResearchConsentTable";
import FileUploadSection from "../../../../components/teacher_components/FileUploadSection";
import { retrieveCourseSettings, updateStudentSettings } from "../../../library/services/course_actions";
import { fetchUploadedFiles } from "../../../library/services/teacher_actions";

export default function ResearchConsent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [researchData, setResearchData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teacherId, setTeacherId] = useState(null);
  const researchTableRef = useRef();
  const router = useRouter();

  const fetchCourseData = async () => {
    setIsLoading(true);
    const storedData = sessionStorage.getItem("courseData");

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setCourseData(parsedData);
      setTeacherId(JSON.parse(sessionStorage.getItem("teacherData") || "{}")?.id);

      // Fetch course settings including student data
      const response = await retrieveCourseSettings({ id: parsedData.id });
      if (response.success) {
        const settings = response.data;
        const parsedStudentSettings = JSON.parse(settings.student_settings || "{}");
        const parsedResearchData = JSON.parse(settings.research_consent_data || "{}");
        
        // Format student data for the research table
        const formattedStudents = Array.isArray(parsedStudentSettings) 
          ? parsedStudentSettings 
          : Object.values(parsedStudentSettings);
        
        setStudentData(formattedStudents);
        setResearchData(parsedResearchData);
        
        // Fetch existing uploaded files using the server action
        const filesData = await fetchUploadedFiles(parsedData.id);
        if (filesData.success) {
          setUploadedFiles(filesData.data || []);
        }
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
    fetchCourseData();
  }, []);

  const handleSaveChanges = async () => {
    if (!courseData) {
      setSaveMessage({
        type: 'error',
        text: 'Course data not found. Please try refreshing the page.'
      });
      return;
    }
    
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });
    
    try {
      const updatedResearchData = researchTableRef.current?.getUpdatedData() || researchData;
      
      // Update course settings with research consent data
      const payload = {
        courseId: courseData.id,
        researchConsentData: JSON.stringify(updatedResearchData)
      };
      
      const result = await updateStudentSettings(payload);
      
      if (result.success) {
        setSaveMessage({
          type: 'success',
          text: 'Research consent data saved successfully!'
        });
        
        // Refresh data
        await fetchCourseData();
      } else {
        setSaveMessage({
          type: 'error',
          text: `Failed to save: ${result.error}`
        });
      }
    } catch (error) {
      console.error("Error saving research data:", error);
      setSaveMessage({
        type: 'error',
        text: 'An unexpected error occurred while saving.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFilesUploaded = (newFiles) => {
    setUploadedFiles(prev => [...newFiles, ...prev]);
  };

  const handleFileDeleted = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
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
        isSidebarOpen={sidebarOpen}
        setIsSidebarOpen={setSidebarOpen}
        courseData={courseData}
      />
      
      <div className="flex-1 p-6 overflow-auto">
        {/* Header Section */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Research Consent Management</h1>
          <p className="text-lg mb-4 text-blue-300">
            Track student research consent forms and upload supporting documentation.
          </p>
          <div className="bg-yellow-900/30 border border-yellow-600 rounded p-3">
            <p className="text-yellow-300">
              <strong>Important:</strong> Please ensure all consent forms are properly collected before marking students as consented. 
              Upload scanned copies of signed forms for record keeping.
            </p>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage.text && (
          <div className={`mb-4 p-3 rounded-lg text-center font-bold ${
            saveMessage.type === 'success' ? 'bg-green-800 text-white' : 'bg-red-800 text-white'
          }`}>
            {saveMessage.text}
          </div>
        )}

        {/* Research Consent Table */}
        <ResearchConsentTable
          ref={researchTableRef}
          studentData={studentData}
          researchData={researchData}
        />

        {/* File Upload Section */}
        <FileUploadSection
          courseId={courseData.id}
          teacherId={teacherId}
          uploadedFiles={uploadedFiles}
          onFilesUploaded={handleFilesUploaded}
          onFileDeleted={handleFileDeleted}
        />

        {/* Save Button */}
        <div className="mt-6 border border-gray-600 rounded bg-gray-700 p-3 flex justify-center">
          <button 
            className={`${
              isSaving 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-700'
            } text-white font-bold py-2 px-4 rounded transition-colors duration-200`}
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Research Data'}
          </button>
        </div>
      </div>
    </div>
  );
}