"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import StudentSidebar from "../../../../components/student_components/StudentSidebar";
import { useStudentSidebar } from "../../../utils/hooks/useStudentSidebar";
import { fetchStudentProgressPage } from "../../../library/services/student_services/student_actions";
import { retrieveModules } from "../../../library/services/course_actions";

export default function Modules() {
  const router = useRouter();
  const { isSidebarOpen, setIsSidebarOpen } = useStudentSidebar();
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [progressData, setProgressData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [moduleData, setModuleData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Separate function to fetch progress data
  const setStudentProgressSession = async (student) => {
    try {
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
    } catch (error) {
      console.error("Error fetching student progress:", error);
    }
  };

  // Function to refresh modules
  const refreshModules = async (courseId, studentInfo, showLoadingState = true) => {
    if (showLoadingState) {
      setIsRefreshing(true);
    }
    
    try {
      const response = await retrieveModules({ id: courseId });

      if (response.success && response.data) {
        let modules = response.data.module_settings;
        if (typeof modules === "string") {
          modules = JSON.parse(modules);
        }

        setModuleData(modules || []);
        
        // Update course data in state and session storage
        const currentCourseData = JSON.parse(sessionStorage.getItem("courseData"));
        const updatedCourseData = {
          ...currentCourseData,
          settings: {
            ...currentCourseData.settings,
            module_settings: modules,
          },
        };
        setCourseData(updatedCourseData);
        sessionStorage.setItem("courseData", JSON.stringify(updatedCourseData));

        // Also refresh progress data
        if (studentInfo) {
          await setStudentProgressSession(studentInfo);
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing modules:", error);
      return false;
    } finally {
      if (showLoadingState) {
        setIsRefreshing(false);
      }
    }
  };

  // Initial load effect
  useEffect(() => {
    const initializePage = async () => {
      const storedCourseData = sessionStorage.getItem("courseData");
      const storedStudentData = sessionStorage.getItem("studentData");

      if (storedCourseData && storedStudentData) {
        try {
          const parsedCourseData = JSON.parse(storedCourseData);
          const parsedStudentData = JSON.parse(storedStudentData);

          // Set initial data
          setCourseData(parsedCourseData);
          setStudentData(parsedStudentData);

          // Set initial module data from session storage
          let modules = parsedCourseData.settings?.module_settings;
          if (typeof modules === "string") {
            modules = JSON.parse(modules);
          }
          setModuleData(modules || []);

          // Fetch progress data
          await setStudentProgressSession(parsedStudentData);

          // Auto-refresh modules from database to get latest visibility settings
          await refreshModules(parsedStudentData.course_id, parsedStudentData, false);
          
          setHasInitialized(true);
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
    };

    initializePage();
  }, [router]);

  // Manual refresh handler
  const handleManualRefresh = async () => {
    if (!studentData) return;
    await refreshModules(studentData.course_id, studentData);
  };

  const calculateModuleProgress = (moduleProgress) => {
    if (!moduleProgress) return 0;

    const components = [
      "quiz",
      "software",
      "workbook",
      "mini_lecture",
      "getting_started",
    ];
    
    const completed = components.filter(
      (comp) => moduleProgress[comp] === true
    ).length;
    
    return Math.round((completed / components.length) * 100);
  };

  const getProgressBarColor = (percentage) => {
    if (percentage === 100) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 30) return "bg-yellow-500";
    return "bg-gray-600";
  };

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

    const components = [
      "quiz",
      "software",
      "workbook",
      "mini_lecture",
      "getting_started",
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
        hoverColor: "hover:shadow-lg hover:shadow-green-600/20",
        statusBg: "bg-green-600",
        icon: (
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
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
        hoverColor: "hover:shadow-lg hover:shadow-yellow-600/20",
        statusBg: "bg-yellow-600",
        icon: null,
      };
    } else {
      return {
        status: "Not Started",
        borderColor: "border-gray-700",
        statusColor: "text-gray-400",
        bgColor: "bg-gray-800",
        hoverColor: "hover:bg-gray-700",
        statusBg: "bg-gray-600",
        icon: null,
      };
    }
  };

  // Get overall stats
  const getOverallStats = () => {
    let visibleModules = [];
    if (Array.isArray(moduleData) && moduleData.length > 0) {
      visibleModules = moduleData.filter((module) => module?.visibility === "Yes");
    } else if (moduleData && typeof moduleData === "object" && Object.keys(moduleData).length > 0) {
      visibleModules = Object.entries(moduleData)
        .map(([id, module]) => ({ ...module, id: parseInt(id) }))
        .filter((module) => module?.visibility === "Yes");
    }

    const stats = {
      total: visibleModules.length,
      completed: 0,
      inProgress: 0,
      notStarted: 0
    };

    visibleModules.forEach((module) => {
      const extractTitle = (fullName) => {
        const match = fullName.match(/Module\s+\d+:\s*(.+)/);
        return match ? match[1] : fullName;
      };
      const moduleTitle = extractTitle(module.name);
      const moduleProgress = progressData[moduleTitle];
      const status = getModuleStatus(moduleProgress);
      
      if (status.status === "Completed") stats.completed++;
      else if (status.status === "In Progress") stats.inProgress++;
      else stats.notStarted++;
    });

    return stats;
  };

  if (isLoading || !courseData || !studentData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white text-xl">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
          Loading modules...
        </div>
      </div>
    );
  }

  const navigateToModule = (moduleId) => {
    router.push(`/student/student-dashboard/modules/${moduleId}`);
  };

  const stats = getOverallStats();

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <StudentSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        courseData={courseData}
        studentData={studentData}
      />
      <main
        className={`flex-1 p-4 sm:p-6 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        {/* Spacer for mobile menu button */}
        <div className="lg:hidden mb-6 pt-12"></div>
        <div className="w-full max-w-6xl mx-auto">
          {/* Header with title and refresh button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Course Modules</h1>
              <p className="text-gray-400 text-sm mt-1">
                {stats.total} modules available • {stats.completed} completed
              </p>
            </div>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 ${
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

          {/* Progress Overview Cards */}
          {stats.total > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
                <p className="text-2xl font-bold text-green-400">
                  {stats.completed}
                </p>
                <p className="text-sm text-gray-400">Completed</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
                <p className="text-2xl font-bold text-yellow-400">
                  {stats.inProgress}
                </p>
                <p className="text-sm text-gray-400">In Progress</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
                <p className="text-2xl font-bold text-gray-400">
                  {stats.notStarted}
                </p>
                <p className="text-sm text-gray-400">Not Started</p>
              </div>
            </div>
          )}

          {/* Info Banner */}
          {stats.total > 0 && (
            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-300">
                📚 Complete all components in each module to master the material. Track your progress below.
              </p>
            </div>
          )}

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
                visibleModules = moduleData
                  .filter((module) => module?.visibility === "Yes")
                  .sort((a, b) => (a.module_rank ?? a.id) - (b.module_rank ?? b.id));
              } else if (
                moduleData &&
                typeof moduleData === "object" &&
                Object.keys(moduleData).length > 0
              ) {
                visibleModules = Object.entries(moduleData)
                  .map(([id, module]) => ({
                    ...module,
                    id: parseInt(id),
                  }))
                  .filter((module) => module?.visibility === "Yes")
                  .sort((a, b) => (a.module_rank ?? a.id) - (b.module_rank ?? b.id));
              }

              if (visibleModules.length === 0) {
                return (
                  <div className="p-8 bg-gray-800 rounded-lg text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-600 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">
                      No Modules Available
                    </h3>
                    <p className="text-gray-500 mb-4">
                      No modules are currently visible. Your instructor may release them as the course progresses.
                    </p>
                    <button
                      onClick={handleManualRefresh}
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Check for updates
                    </button>
                  </div>
                );
              }

              return visibleModules.map((module) => {
                // Extract just the title from module.name
                const extractTitle = (fullName) => {
                  const match = fullName.match(/Module\s+\d+:\s*(.+)/);
                  return match ? match[1] : fullName;
                };

                const moduleTitle = extractTitle(module.name);
                const moduleProgress = progressData[moduleTitle];
                const progressPercentage = calculateModuleProgress(moduleProgress);
                const moduleStatus = getModuleStatus(moduleProgress);

                return (
                  <div
                    key={module.id}
                    className={`p-6 ${moduleStatus.bgColor} rounded-lg shadow-md ${moduleStatus.hoverColor} cursor-pointer transition-all duration-200 border-2 ${moduleStatus.borderColor}`}
                    onClick={() => navigateToModule(module.id)}
                  >
                    {/* Module Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{module.name}</h3>
                          <span className={`${moduleStatus.statusBg} text-white text-xs px-2 py-1 rounded flex items-center gap-1`}>
                            {moduleStatus.icon}
                            {moduleStatus.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{module.description}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Module Progress</span>
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
                          )} rounded-full transition-all duration-500`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Component Status Grid - Enhanced styling */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {[
                        { key: "getting_started", label: "Getting Started", icon: "🚀" },
                        { key: "mini_lecture", label: "Mini Lecture", icon: "📖" },
                        { key: "software", label: "Software", icon: "💻" },
                        { key: "workbook", label: "Workbook", icon: "📝" },
                        { key: "quiz", label: "Quiz", icon: "✅" }
                      ].map((component) => (
                        <div
                          key={component.key}
                          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                            moduleProgress?.[component.key]
                              ? "bg-green-900/30 text-green-400 border border-green-800"
                              : "bg-gray-700/30 text-gray-500 border border-gray-700"
                          }`}
                        >
                          <span className="text-lg mb-1">{component.icon}</span>
                          <span className="text-xs text-center">{component.label}</span>
                          {moduleProgress?.[component.key] && (
                            <svg className="w-3 h-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          moduleStatus.status === "Completed"
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : moduleStatus.status === "In Progress"
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-700 hover:bg-gray-600 text-white"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToModule(module.id);
                        }}
                      >
                        {moduleStatus.status === "Completed" 
                          ? "Review Module" 
                          : moduleStatus.status === "In Progress"
                          ? "Continue Learning"
                          : "Start Module"}
                      </button>
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