"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import StudentSidebar from "../../../../components/student_components/StudentSidebar";
import { useStudentSidebar } from "../../../utils/hooks/useStudentSidebar";
import { fetchStudentProgressPage } from "../../../library/services/student_actions";
import { retrieveModules } from "../../../library/services/course_actions"; // Import your retrieve function

export default function Modules() {
  const router = useRouter();
  const { isSidebarOpen, setIsSidebarOpen } = useStudentSidebar();
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [progressData, setProgressData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [moduleData, setModuleData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false); // Add refresh state

  useEffect(() => {
    const storedCourseData = sessionStorage.getItem("courseData");
    const storedStudentData = sessionStorage.getItem("studentData");

    if (storedCourseData && storedStudentData) {
      try {
        const parsedCourseData = JSON.parse(storedCourseData);
        const parsedStudentData = JSON.parse(storedStudentData);

        let modules = parsedCourseData.settings?.module_settings;
        if (typeof modules === "string") {
          modules = JSON.parse(modules);
        }
        setCourseData(parsedCourseData);
        setStudentData(parsedStudentData);
        setModuleData(modules || []);

        // Pass the parsed student data directly to the function
        setStudentProgressSession(parsedStudentData);
      } catch (error) {
        console.error("Error parsing session storage data:", error);
        sessionStorage.removeItem("courseData");
        sessionStorage.removeItem("studentData");
        router.push("/student/student-join");
      }
    } else {
      router.push("/student/student-join");
    }
    setIsLoading(false);
  }, [router]);

  const refreshModules = async () => {
    if (!courseData) return;

    setIsRefreshing(true);
    try {
      const response = await retrieveModules({ id: studentData.course_id });

      if (response.success && response.data) {
        let modules = response.data.module_settings;
        if (typeof modules === "string") {
          modules = JSON.parse(modules);
        }

        setModuleData(modules || []);
        const updatedCourseData = {
          ...courseData,
          settings: {
            ...courseData.settings,
            module_settings: modules,
          },
        };
        setCourseData(updatedCourseData);
        sessionStorage.setItem("courseData", JSON.stringify(updatedCourseData));

        // Also refresh progress data
        if (studentData) {
          await setStudentProgressSession(studentData);
        }
      }
    } catch (error) {
      console.error("Error refreshing modules:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const setStudentProgressSession = async (student) => {
    const studentProgressData = await fetchStudentProgressPage({
      student_id: student.id,
    });

    if (studentProgressData.success && studentProgressData.data) {
      const moduleProgress = studentProgressData.data.module_progress || {};
      setProgressData(moduleProgress);
      sessionStorage.setItem(
        "studentProgressData",
        JSON.stringify(moduleProgress)
      );
    } else {
      console.error("No data in response or request failed");
    }
  };

  const calculateModuleProgress = (moduleProgress) => {
    if (!moduleProgress) return 0;

    // Updated to use actual property names from your data
    const components = [
      "quiz",
      "software",
      "workbook",
      "mini_lecture",
      "getting_started",
      "introduction_video",
    ];
    const completed = components.filter(
      (comp) => moduleProgress[comp] === true
    ).length;
    return Math.round((completed / components.length) * 100);
  };

  // Get progress bar color based on percentage
  const getProgressBarColor = (percentage) => {
    if (percentage === 100) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 30) return "bg-yellow-500";
    return "bg-gray-600";
  };

  // Get module status and styling
  const getModuleStatus = (moduleProgress) => {
    if (!moduleProgress) {
      return {
        status: "Not Started",
        borderColor: "border-gray-700",
        statusColor: "text-gray-400",
        bgColor: "bg-gray-800",
        hoverColor: "hover:bg-gray-700",
        icon: null,
      };
    }

    // Updated component list to match actual data structure
    const components = [
      "quiz",
      "software",
      "workbook",
      "mini_lecture",
      "getting_started",
      "introduction_video",
    ];
    const completedCount = components.filter(
      (comp) => moduleProgress[comp] === true
    ).length;

    if (
      completedCount === components.length ||
      moduleProgress.completed_at !== null
    ) {
      return {
        status: "Completed",
        borderColor: "border-green-600",
        statusColor: "text-green-400",
        bgColor: "bg-gray-800",
        hoverColor: "hover:bg-green-900/20",
        icon: (
          <svg
            className="w-6 h-6 text-green-400 flex-shrink-0 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        ),
      };
    } else if (completedCount > 0) {
      return {
        status: "In Progress",
        borderColor: "border-yellow-600",
        statusColor: "text-yellow-400",
        bgColor: "bg-gray-800",
        hoverColor: "hover:bg-yellow-900/20",
        icon: (
          <svg
            className="w-6 h-6 text-yellow-400 flex-shrink-0 ml-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        ),
      };
    } else {
      return {
        status: "Not Started",
        borderColor: "border-gray-700",
        statusColor: "text-gray-400",
        bgColor: "bg-gray-800",
        hoverColor: "hover:bg-gray-700",
        icon: null,
      };
    }
  };

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

  const navigateToModule = (moduleId) => {
    router.push(`/student/student-dashboard/modules/${moduleId}`);
  };

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
        <div className="w-full max-w-4xl mx-auto">
          {/* Header with title and refresh button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">All Modules</h1>
            <button
              onClick={refreshModules}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 ${
                isRefreshing ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Refresh to see updated module visibility"
            >
              <svg
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="hidden sm:inline">
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          </div>

          {/* Success message when refreshed */}
          {isRefreshing && (
            <div className="mb-4 p-3 bg-blue-600/20 border border-blue-600 rounded-lg text-blue-300 text-sm">
              Fetching latest module settings...
            </div>
          )}

          <div className="space-y-4">
            {(() => {
              let visibleModules = [];

              // Handle both array and object formats
              if (Array.isArray(moduleData) && moduleData.length > 0) {
                // If moduleData is an array
                visibleModules = moduleData
                  .filter((module) => module?.visibility === "Yes")
                  .sort((a, b) => a.id - b.id);
              } else if (
                moduleData &&
                typeof moduleData === "object" &&
                Object.keys(moduleData).length > 0
              ) {
                // If moduleData is an object
                visibleModules = Object.entries(moduleData)
                  .map(([id, module]) => ({
                    ...module,
                    id: parseInt(id),
                  }))
                  .filter((module) => module?.visibility === "Yes")
                  .sort((a, b) => a.id - b.id);
              }

              if (visibleModules.length === 0) {
                return (
                  <div className="p-4 bg-gray-800 rounded-lg text-center">
                    <p>No visible modules available at this time.</p>
                    <button
                      onClick={refreshModules}
                      className="mt-4 text-blue-400 hover:text-blue-300 underline"
                    >
                      Check for updates
                    </button>
                  </div>
                );
              }

              return visibleModules.map((module) => {
                // Extract just the title from module.name (removes "Module #: " prefix)
                const extractTitle = (fullName) => {
                  const match = fullName.match(/Module\s+\d+:\s*(.+)/);
                  return match ? match[1] : fullName;
                };

                const moduleTitle = extractTitle(module.name);

                const moduleProgress = progressData[moduleTitle];
                const progressPercentage =
                  calculateModuleProgress(moduleProgress);
                const moduleStatus = getModuleStatus(moduleProgress);

                return (
                  <div
                    key={module.id}
                    className={`p-5 ${moduleStatus.bgColor} rounded-lg shadow-md ${moduleStatus.hoverColor} cursor-pointer transition-all duration-200 border-2 ${moduleStatus.borderColor}`}
                    onClick={() => navigateToModule(module.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs font-medium ${moduleStatus.statusColor}`}
                          >
                            {moduleStatus.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold">{module.name}</h3>
                      </div>
                      {moduleStatus.icon}
                    </div>

                    <p className="text-gray-300 mb-3">{module.description}</p>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span
                          className={
                            progressPercentage === 100
                              ? "text-green-400"
                              : "text-gray-400"
                          }
                        >
                          {progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${getProgressBarColor(
                            progressPercentage
                          )} transition-all duration-500`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </main>
    </div>
  );
}
