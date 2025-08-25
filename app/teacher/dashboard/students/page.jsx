"use client";
import { useState, useEffect, useRef } from "react";
import Sidebar from "../../../../components/teacher_components/TeacherSidebar";
import StudentTable from "../../../../components/teacher_components/StudentTable";
import { retrieveCourseSettings } from "../../../library/services/course_actions";
import { updateStudentSettings, deleteStudent } from "../../../library/services/teacher_services/student_management"

export default function Settings() {
  const [studentSettingsOpen, setStudentSettingsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [courseData, setCourseData] = useState(null);
  const [courseSettings, setCourseSettings] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const studentTableRef = useRef();

  const fetchCourseSettings = async () => {
    setIsLoading(true);
    const storedData = sessionStorage.getItem("courseData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setCourseData(parsedData);
      const response = await retrieveCourseSettings({ id: parsedData.id });
      if (response.success) {
        const settings = response.data;
        const parsedStudentSettings = JSON.parse(settings.student_settings || "[]");
        setCourseSettings(settings);
        setStudentData(parsedStudentSettings);
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

  const handleSubmitStudents = async () => {
    try {
      setIsSaving(true);
      setSaveMessage({ type: '', text: 'Saving students to your course...' });
      const updatedStudentData = studentTableRef.current?.getUpdatedData() || studentData;
      const payload = {
        courseId: courseData.id,
        studentSettings: JSON.stringify(updatedStudentData)
      };
      const result = await updateStudentSettings(payload);
      if (result.success) {
        setSaveMessage({
          type: 'success',
          text: 'Student Data Updated Successfully.'
        });
      }
    } catch (error) {
      console.error("Error updating student data:", error);
      setSaveMessage({
        type: 'error',
        text: 'Failed to update student data. Please try again.'
      });
    } finally {
      setIsSaving(false);
      // Clear the message after 5 seconds
      setTimeout(() => {
        setSaveMessage({ type: '', text: '' });
      }, 5000);
    }
  }

  // Updated handleRemoveStudent to integrate with backend
  const handleRemoveStudent = async ({ studentId, studentUsername, courseId, index, studentData: student }) => {
    try {
      // Call your deleteStudent function from student_management service
      // Adjust parameters based on what your deleteStudent function expects
      const deletePayload = {
        studentId: student.id || student.student_id, // Use the actual student ID from your data
        courseId: courseData.id,
        studentUsername: student.student_username,
        // Add any other required fields for your deleteStudent function
      };

      console.log("Deleting student with payload:", deletePayload);
      
      // Call your backend delete function
      const result = await deleteStudent(deletePayload);
      
      if (result && result.success) {
        // Update local state to reflect the removal
        setStudentData(prevData => prevData.filter((_, i) => i !== index));
        
        // Show success message
        setSaveMessage({
          type: 'success',
          text: `Successfully removed ${student.first_name} ${student.last_name} from the course.`
        });
        
        // Clear message after 5 seconds
        setTimeout(() => {
          setSaveMessage({ type: '', text: '' });
        }, 5000);
        
        return { success: true };
      } else {
        // Handle failure
        const errorMessage = result?.error || 'Failed to remove student from the course.';
        setSaveMessage({
          type: 'error',
          text: errorMessage
        });
        
        setTimeout(() => {
          setSaveMessage({ type: '', text: '' });
        }, 5000);
        
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Error removing student:", error);
      
      setSaveMessage({
        type: 'error',
        text: `Error removing student: ${error.message || 'Unknown error occurred'}`
      });
      
      setTimeout(() => {
        setSaveMessage({ type: '', text: '' });
      }, 5000);
      
      return { success: false, error: error.message };
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

  // Get course type for display
  const getCourseTypeInfo = () => {
    if (courseData?.course_gender === 'Male') return 'Male-only';
    if (courseData?.course_gender === 'Female') return 'Female-only';
    if (courseData?.course_gender === 'Mixed') return 'Mixed gender';
    return 'Standard';
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar
        isSidebarOpen={studentSettingsOpen}
        setIsSidebarOpen={setStudentSettingsOpen}
        courseData={courseData}
      />
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              Student Management
              <button 
                className="ml-2 text-gray-400 hover:text-white transition-colors"
                title="Help"
              >
                <svg className="w-6 h-6 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </h1>
            {courseData && (
              <div className="text-sm bg-gray-700 px-3 py-1 rounded">
                Course Type: <span className="font-semibold">{getCourseTypeInfo()}</span>
              </div>
            )}
          </div>
          <p className="text-lg mb-2 text-blue-300">
            Use this page to add, remove, and edit your students' information.
          </p>
          <p className="text-sm text-gray-400">
            Once you enter a student's first and last name, a unique username will be automatically generated for them to join the course.
            {courseData?.course_gender && (courseData.course_gender === 'Male' || courseData.course_gender === 'Female') && (
              <span className="block mt-1 text-yellow-400">
                Note: This is a {courseData.course_gender}-only course. All students will be set to {courseData.course_gender} gender by default.
              </span>
            )}
          </p>
        </div>

        {saveMessage.text && (
          <div className={`mb-4 p-4 rounded-lg text-center font-semibold flex items-center justify-center gap-2 ${
            saveMessage.type === 'success' 
              ? 'bg-green-800/50 text-green-200 border border-green-600' 
              : saveMessage.type === 'error'
              ? 'bg-red-800/50 text-red-200 border border-red-600'
              : 'bg-yellow-800/50 text-yellow-200 border border-yellow-600'
          }`}>
            {saveMessage.type === 'success' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : saveMessage.type === 'error' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {saveMessage.text}
          </div>
        )}
        
        <StudentTable
          ref={studentTableRef}
          tableTitle={"My Students"}
          tableData={studentData}
          teacherName={courseData?.course_teacher_name}
          countyName={courseData?.course_county}
          courseData={courseData}
          onRemoveStudent={handleRemoveStudent} // Pass the handler here
        />
        
        <div className="mt-6 border border-gray-600 rounded bg-gray-700/50 p-4 flex flex-col items-center">
          <button 
            className={`${
              isSaving 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
            } text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg`}
            onClick={handleSubmitStudents}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Submit Changes</span>
              </>
            )}
          </button>
          {!isSaving && studentData.length === 0 && (
            <p className="text-sm text-gray-400 mt-2">
              Add at least one student to save changes
            </p>
          )}
        </div>
      </div>
    </div>
  );
}