"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { TrainingCard } from "../../../components/teacher_components/TrainingCard";
import { getTeacherData } from "../../library/services/teacher_actions";

export default function TeacherTraining() {
  const router = useRouter();
  const [teacherData, setTeacherData] = useState(null);
  const [trainingCompleted, setTrainingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [moduleData, setModuleData] = useState({}); // Initialize as empty object

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const storedData = JSON.parse(sessionStorage.getItem("teacherData"));
        console.log("Stored Teacher Data:", storedData);
        if (!storedData?.id) {
          console.error("No teacher ID found in sessionStorage");
          setIsLoading(false);
          return;
        }
        const result = await getTeacherData(storedData);
        if (result.success && result.data) {
          const freshData = result.data;
          setTeacherData(freshData);
          // Get module progress - keep it as an object
          const moduleProgress = freshData.teachers_progress?.[0]?.module_progress || {};
          setModuleData(moduleProgress);
          console.log("Fetched fresh teacher data for modules:", moduleProgress);
          sessionStorage.setItem("moduleProgress", JSON.stringify(moduleProgress));
        } else {
          setTeacherData(storedData);
          setModuleData({}); // Set empty object if no data
        }
      } catch (error) {
        console.error("Error loading teacher data:", error);
        setModuleData({}); // Set empty object on error
      } finally {
        setIsLoading(false);
      }
    };
    console.log("Current Module Data:", moduleData);
    loadTeacherData();
  }, []);
  const handleRestrictedAccess = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const isPretestComplete = teacherData?.pretest_complete || false;
  const isPostTestComplete = teacherData?.posttest_complete || false;

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

  // Navigation function for modules
  const navigateToModule = (moduleOrder) => {
    // Convert module name to URL-friendly format

    router.push(`/teacher/training/module${moduleOrder}`);
  };

  if (isLoading || !teacherData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white text-xl">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
          Loading...
        </div>
      </div>
    );
  }

  // Sort modules by their order property
  const sortedModules = Object.entries(moduleData)
    .sort((a, b) => (a[1].order || 0) - (b[1].order || 0))
    .map(([name, data]) => ({ name, ...data }));

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      {/* Alert Banner */}
      {showAlert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg border border-red-500 animate-bounce">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Complete the PSVTR Pre-Test first!</span>
          </div>
        </div>
      )}

      {/* Sticky Header with Back Button */}
      <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/teacher/homepage")}
              className="flex items-center text-gray-300 hover:text-white transition-colors group"
            >
              <svg
                className="h-5 w-5 mr-2 group-hover:translate-x-[-2px] transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Return to Teacher Homepage</span>
            </button>
            
            <div className="text-sm text-gray-400">
              Training Progress
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] w-full px-4 py-8">
        <h1 className="text-3xl sm:text-4xl mt-2 font-bold mb-8">
          Spatial Thinking Teacher Training
        </h1>
        
        <div className="text-center mb-6">
          <p className="text-lg mb-2">
            Welcome, {teacherData?.username || "Guest"}!
          </p>
        </div>

        {/* Access Control Notice */}
        {!isPretestComplete && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-red-300 font-semibold">Required: Complete Pre-Test First</span>
            </div>
            <p className="text-red-200 text-sm">
              You must complete the PSVTR Pre-Test before accessing other training modules. This helps us assess your current spatial skills level.
            </p>
          </div>
        )}

        <div className="w-full max-w-6xl">
          {/* PSVTR Pre-Test - Always Accessible - Using TrainingCard */}
          <div className="mb-6">
            <TrainingCard
              module={{
                id: 'pretest',
                name: 'PSVTR Pre-Test: Assessing Your Spatial Skills',
                description: 'Purdue Spatial Visualization Pre-Test. Must complete before accessing other course content.',
                estimatedTime: '20 minutes',
                href: '/teacher/training/quizzes/psvtr_pretest',
                requiresPretest: false
              }}
              moduleProgress={{
                module_name: 'PSVTR Pre-Test',
                assessment_completed: teacherData?.pretest_complete || false
              }}
              isPretestComplete={true} // Pre-test is always accessible
              onRestrictedClick={handleRestrictedAccess}
            />
          </div>

          {/* All Training Modules */}
          <div className="space-y-4">
            {sortedModules.map((module) => {
              const progressPercentage = calculateModuleProgress(module);
              const moduleStatus = getModuleStatus(module);
              const displayNumber = module.order === 0 ? "Pre-Module" : `Module ${module.order}`;

              return (
                <div
                  key={module.name}
                  className={`p-5 ${moduleStatus.bgColor} rounded-lg shadow-md ${moduleStatus.hoverColor} cursor-pointer transition-all duration-200 border-2 ${moduleStatus.borderColor}`}
                  onClick={() => navigateToModule(module.order)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${moduleStatus.statusColor}`}>
                          {moduleStatus.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">
                        {displayNumber}: {module.name}
                      </h3>
                    </div>
                    {moduleStatus.icon}
                  </div>

                  <p className="text-gray-300 mb-3">
                    Complete activities to master spatial visualization concepts.
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className={progressPercentage === 100 ? "text-green-400" : "text-gray-400"}>
                        {progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${getProgressBarColor(progressPercentage)} transition-all duration-500`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PSVTR Post-Test - Always Accessible - Using TrainingCard */}
          <div className="mb-6 mt-4">
            <TrainingCard
              module={{
                id: 'posttest',
                name: 'PSVTR Post-Test: Assessing Your Spatial Skills',
                description: 'Purdue Spatial Visualization Post-Test. Must complete before accessing other course content.',
                estimatedTime: '20 minutes',
                href: '/teacher/training/quizzes/psvtr_posttest',
                requiresPretest: false
              }}
              moduleProgress={{
                module_name: 'PSVTR Post-Test',
                assessment_completed: teacherData?.posttest_complete || false
              }}
              isPostTestComplete={true} // Post-test is always accessible
              onRestrictedClick={handleRestrictedAccess}
            />
          </div>

          
        </div>
        
      </div>
    </div>
  );
}