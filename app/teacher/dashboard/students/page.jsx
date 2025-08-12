"use client";
import { useState, useEffect, useRef } from "react";
import Sidebar from "../../../../components/teacher_components/TeacherSidebar";
import StudentTable from "../../../../components/teacher_components/StudentTable";
import { retrieveCourseSettings, updateCourseSettings } from "../../services/actions";
import { createClient } from "../../../../utils/supabase/supabase";

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
        const parsedStudentSettings = JSON.parse(settings.student_settings || "{}");
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
      // Step 1: Update course_settings
      const payload = {
        courseId: courseData.id,
        studentSettings: JSON.stringify(updatedStudentData)
      };  
      const result = await updateCourseSettings(payload);
      const supabase = createClient();
      if (result.success) {
       const { data: existingStudents, error: fetchError } = await supabase
          .from("students")
          .select("id, student_join_code")
          .eq("course_id", courseData.id);
        if (fetchError) {
          console.error("Error fetching existing students:", fetchError);
          throw fetchError;
        }
        const existingStudentMap = {};
        existingStudents.forEach(student => {
          existingStudentMap[student.student_join_code] = student.id;
        });
        for (const student of updatedStudentData) {
          if (!student.student_join_code || !student.first_name) {
            continue;
          }
          if (existingStudentMap[student.student_join_code]) {
            await supabase
              .from("students")
              .update({
                first_name: student.first_name,
                last_name: student.last_name,
                gender: student.gender,
                grade: student.grade || null,
                other: student.other || null,
                remove_date: student.remove_date || null,
              })
              .eq("id", existingStudentMap[student.student_join_code]);
          } else {
            await supabase
              .from("students")
              .insert([{
                student_join_code: student.student_join_code,
                first_name: student.first_name,
                last_name: student.last_name,
                gender: student.gender,
                grade: student.grade || null,
                other: student.other || null,
                join_date: student.join_date || new Date().toISOString(),
                remove_date: student.remove_date || null,
                course_id: courseData.id
              }]);
          }
        }    
        setSaveMessage({
          type: 'success',
          text: 'Course settings and student data updated successfully!'
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
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Student Management </h1>
            <p className="text-xl mb-4 text-blue-300">
                           Use this page to add, remove, and edit your students information.
            </p>
            <p className="mb-6">
              A unique student ID is generated after adding a student. You will share this code with your students so they can join the course.
            </p>
          </div>

        {saveMessage.text && (
          <div className={`mb-4 p-3 rounded-lg text-center font-bold ${
            saveMessage.type === 'success' ? 'bg-green-800 text-white' : 'bg-red-800 text-white'
          }`}>
            {saveMessage.text}
          </div>
        )}
        
        
        <StudentTable
          ref={studentTableRef}
          tableTitle={"My Students"}
          tableData={studentData}
          teacherName={courseData?.course_teacher_name}
          schoolName={courseData?.course_county}
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