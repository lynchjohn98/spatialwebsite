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
  const [courseData, setCourseData] = useState(null);
  const [studentInfo, setStudentInfo] = useState([
    {
      first_name: "John",
      last_name: "Lynch",
      student_code: generateStudentCode(),
      gender: "Male",
      grade: "12th",
    },
  ]);
  const router = useRouter();

  const assignmentData = [
    {
      name: "Module 1",
      description: "This is the first module",
      visible: true,
    },
    {
      name: "Module 2",
      description: "This is the second module",
      visible: false,
    },
    {
      name: "Module 3",
      description: "This is the third module",
      visible: true,
    },
  ];
  const moduleData = [
    {
      name: "Module 1",
      description: "This is the first module",
      visible: true,
    },
    {
      name: "Module 2",
      description: "This is the second module",
      visible: false,
    },
    {
      name: "Module 3",
      description: "This is the third module",
      visible: true,
    },
  ];
  const studentData = [
    {
      first_name: "John",
      last_name: "Lynch",
      student_code: generateStudentCode(),
      gender: "Male",
      grade: "12th"
    },
    {
      first_name: "Jane",
      last_name: "Doe",
      student_code: generateStudentCode(),
      gender: "Female",
      grade: "11th",
    },
    {
      first_name: "John",
      last_name: "Smith",
      student_code: generateStudentCode(),
      gender: "Male",
      grade: "10th",
    },
  ];

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
