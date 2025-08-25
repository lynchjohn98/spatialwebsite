"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/teacher_components/TeacherSidebar";
import ResearchConsentTable from "../../../../components/teacher_components/ResearchConsentTable";
import FileUploadSection from "../../../../components/teacher_components/FileUploadSection";
import { retrieveCourseSettings, updateStudentConsentSettings } from "../../../library/services/course_actions";
import { fetchUploadedFiles } from "../../../library/services/teacher_actions";
import { researchMaterial } from "../../../library/helpers/clienthelpers";

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

  const handleSaveConsentData = async (updatedConsentData) => {
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
      // Prepare the update payload with consent information
      const updatePayload = Object.keys(updatedConsentData).map(username => {
        const consentData = updatedConsentData[username];
        
        return {
          student_username: username,
          student_consent: consentData?.consented || false,
          student_notes: consentData?.notes || '',
          consent_date: consentData?.consent_date || null
        };
      });
      
      // Call the updated function with both the payload and courseId
      const result = await updateStudentConsentSettings(updatePayload, courseData.id);
      
      if (result.success) {
        setSaveMessage({
          type: 'success',
          text: 'Student consent data saved successfully!'
        });
        
        // Store the updated research data for next refresh
        setResearchData(updatedConsentData);
        
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setSaveMessage({ type: '', text: '' });
        }, 3000);
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
        text: 'An unexpected error occurred while saving consent data.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFilesUploaded = (newFiles) => {
    setUploadedFiles(prev => [...newFiles, ...prev]);
    setSaveMessage({
      type: 'success',
      text: `${newFiles.length} file(s) uploaded successfully!`
    });
    setTimeout(() => {
      setSaveMessage({ type: '', text: '' });
    }, 3000);
  };

  const handleFileDeleted = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setSaveMessage({
      type: 'success',
      text: 'File deleted successfully!'
    });
    setTimeout(() => {
      setSaveMessage({ type: '', text: '' });
    }, 3000);
  };

  const handleUploadSignedForms = () => {
    // Scroll to file upload section
    const uploadSection = document.getElementById('file-upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
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
        isSidebarOpen={sidebarOpen}
        setIsSidebarOpen={setSidebarOpen}
        courseData={courseData}
      />
      
      <div className="flex-1 p-6 overflow-auto">
        {/* Enhanced Header Section */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Research Consent Management</h1>
          <p className="text-lg mb-4 text-blue-300">
            Track student research consent forms and upload supporting documentation.
          </p>

          {/* Research Documents Section */}
          <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-600/50 rounded-lg p-6">
            <div className="flex items-start mb-4">
              <svg className="w-6 h-6 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h2 className="text-green-300 font-semibold text-lg mb-2">Research Documents</h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  This course has been created with the research feature added. The below documents include the research consent form 
                  and information sheet that can be provided to students. After you download these, you can distribute them to students and use the upload feature below to upload signed forms.
                </p> 
              </div>
            </div>

            {/* Document Download Cards */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {researchMaterial.map((material, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">{material.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{material.description}</p>
                      <a 
                        href={material.downloadUrl} 
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          />
                        </svg>
                        Download PDF
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-4 border-t border-gray-600/50">
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={handleUploadSignedForms}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Jump to Upload Section
                </button>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4 mt-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-300 font-semibold mb-1">How This Works</p>
                <p className="text-blue-200/90 text-sm">
                  <b>1. Track Consent:</b> Use the table below to manually track which students have provided consent.<br/>
                  <b>2. Upload Documentation:</b> Upload scanned consent forms in the file upload section for record keeping.<br/>
                  These are independent actions - you can update consent status now and upload files later.
                </p>
              </div>
            </div>
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

        {/* Research Consent Table with its own save */}
        <ResearchConsentTable
          ref={researchTableRef}
          studentData={studentData}
          researchData={researchData}
          onSave={handleSaveConsentData}
          isSaving={isSaving}
        />

        {/* File Upload Section - Independent functionality */}
        <div id="file-upload-section">
          <FileUploadSection
            courseId={courseData.id}
            teacherId={teacherId}
            uploadedFiles={uploadedFiles}
            onFilesUploaded={handleFilesUploaded}
            onFileDeleted={handleFileDeleted}
          />
        </div>
      </div>
    </div>
  );
}