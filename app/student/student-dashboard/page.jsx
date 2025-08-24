"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentSidebar from "../../../components/student_components/StudentSidebar";
import { useStudentSidebar } from "../../utils/hooks/useStudentSidebar"; // Import the hook

export default function StudentDashboard() {
  const router = useRouter();

  const {isSidebarOpen, setIsSidebarOpen} = useStudentSidebar();
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState(null);

  

  useEffect(() => {
    const storedCourseData = sessionStorage.getItem("courseData");
    const storedStudentData = sessionStorage.getItem("studentData");
    if (storedCourseData && storedStudentData) {
      try {
        setCourseData(JSON.parse(storedCourseData));
        setStudentData(JSON.parse(storedStudentData));
                console.log(courseData);
        console.log(studentData);
      } catch (error) {
        console.error("Error parsing session storage data:", error);
        sessionStorage.removeItem("courseData");
        sessionStorage.removeItem("studentData");
        router.push("/student-join");
      }
    } else {
      router.push("/student-join");
    }
  }, [router]);

  if (!courseData || !studentData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white text-xl">
        Loading...
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
      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-1/4" : ""
        }`}
      >
        <div className="lg:hidden mb-6 pt-8"></div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Dashboard</h1>
            <p className="text-xl mb-4 text-blue-300">
              Welcome to your spatial thinking course.
            </p>
            <p className="mb-6">
              Please use the navigation on the left side to access the course
              materials.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-blue-300">
              Important Information
            </h2>

            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white mr-3 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                </span>
                <span>
                  Please use the sidebar on the leftside to access your modules
                  and quizzes. If none are visible, please inform your
                  instructor.
                </span>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white mr-3 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                </span>
                <span>
                  You can view your grades on previous quiz attempts in the
                  Grades section of the sidebar.
                </span>
              </li>

              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white mr-3 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                </span>
                <span>
                  If there are any technical issues, please email:{" "}
                  <a
                    href="mailto:lynchjohn98@gmail.com?subject=Spatial%20Thinking%20LMS"
                    className="text-blue-300 underline hover:text-blue-200 transition-colors"
                  >
                    lynchjohn98@gmail.com
                  </a>{" "}
                  with "Spatial Thinking LMS" in the subject line.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
