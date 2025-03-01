"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateStudentCode } from "../../../utils/helpers";
import Sidebar from "../../../components/Sidebar";
import MainContent from "../../../components/MainContent";
import VisibilityTable from "../../../components/VisibilityTable";
import StudentTable from "../../../components/StudentTable";

export default function Settings() {
  const [studentSettingsOpen, setStudentSettingsOpen] = useState(false);
  const router = useRouter();
  const [courseData, setCourseData] = useState(null);
  const [courseSettings, setCourseSettings] = useState(null);


  //Grab up the jsonB so that all the data is available, then only update the data once the faculty hits
  //the save or submit changes at the bottom. Add in precaution for reload or other errors.


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
          tableTitle={"Assignment Visibility"}
          tableData={assignmentData}
          moniker={"Assignment"}
        />
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit Changes
        </button>
      </div>
    </div>
  );
}
