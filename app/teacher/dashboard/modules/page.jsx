// app/teacher/dashboard/modules/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { retrieveTeacherModulePage } from "../../../library/services/teacher_actions";
import Sidebar from "../../../../components/teacher_components/TeacherSidebar";

export default function TeacherCourseModules() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [moduleSettings, setModuleSettings] = useState([]);
  const [teacherProgress, setTeacherProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("training"); // "training" or "manage"
  const router = useRouter();

  useEffect(() => {
    const checkWindowSize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", checkWindowSize);
    checkWindowSize();
    return () => window.removeEventListener("resize", checkWindowSize);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const storedCourseData = sessionStorage.getItem("courseData");
    const storedTeacherData = sessionStorage.getItem("teacherData");
    
    if (!storedCourseData) {
      router.push("/teacher-join");
      return;
    }
    
    try {
      const parsedCourseData = JSON.parse(storedCourseData);
      const parsedTeacherData = JSON.parse(storedTeacherData || "{}");
      setCourseData(parsedCourseData);

      // Fetch teacher module progress and module settings
      const result = await retrieveTeacherModulePage(parsedTeacherData.id, parsedCourseData.id);
      console.log("Returned data:", result);

      // Process module settings - filter only visible modules
      if (result.module_settings) {
        let modules = result.module_settings;
        
        // Convert to array if it's an object
        if (!Array.isArray(modules)) {
          modules = Object.values(modules);
        }
        
        // Filter only visible modules and sort by module_rank
        const visibleModules = modules
          .filter(m => m.visibility === "Yes")
          .sort((a, b) => (a.module_rank || 0) - (b.module_rank || 0));
          
        setModuleSettings(visibleModules);
      }

      // Set teacher progress
      if (result.teacher_module_progress) {
        setTeacherProgress(result.teacher_module_progress);
        sessionStorage.setItem("moduleProgress", JSON.stringify(result.teacher_module_progress));
      }

    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Map module rank to training module names for progress tracking
  const getModuleNameForProgress = (moduleRank) => {
    const moduleNames = {
      0: "Pre-Module: The Importance of Spatial Skills",
      1: "Combining Solids", 
      2: "Surfaces and Solids of Revolution",
      3: "Isometric Drawings and Coded Plans",
      4: "Flat Patterns",
      5: "Rotation of Objects about a Single Axis",
      6: "Rotation of Objects about Two or More Axes",
      7: "Object Reflections and Symmetry",
      8: "Cutting Planes and Cross Sections",
      9: "Scaling and Projection Theory",
      10: "Orthographic Projection"
    };
    return moduleNames[moduleRank] || null;
  };

  // Get progress for a specific module
  const getModuleProgress = (module) => {
    const progressName = getModuleNameForProgress(module.module_rank);
    if (!progressName) return {};
    return teacherProgress[progressName] || {};
  };

  // Calculate completion percentage
  const calculateProgress = (moduleProgress) => {
    if (!moduleProgress || Object.keys(moduleProgress).length === 0) return 0;
    
    const components = [
      'quiz', 'software', 'workbook', 
      'mini_lecture', 'getting_started', 'introduction_video'
    ];
    const completed = components.filter(comp => moduleProgress[comp] === true).length;
    return Math.round((completed / components.length) * 100);
  };

  // Navigate to training module
  const navigateToTraining = (moduleRank) => {
    router.push(`/teacher/dashboard/modules/${moduleRank}`);
  };

  // Navigate to quiz
  const navigateToQuiz = (moduleRank) => {
    router.push(`/teacher/dashboard/modules/${moduleRank}/quiz`);
  };

  // Navigate to settings
  const navigateToSettings = () => {
    router.push("/teacher/dashboard/settings");
  };

  // Refresh data
  const refreshData = () => {
    loadData();
  };

  if (isLoading || !courseData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p>Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        courseData={courseData}
      />
      
      <main className={`flex-1 p-6 transition-all duration-300 ${
        isSidebarOpen ? "lg:ml-1/4" : ""
      }`}>
        <div className="lg:hidden mb-6 pt-8"></div>

        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Course Modules</h1>
              <p className="text-gray-400 text-sm mt-1">
                {viewMode === "training" 
                  ? `${moduleSettings.length} modules visible to students` 
                  : "Manage module visibility settings"}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={refreshData}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                title="Refresh"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("training")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === "training" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                My Training
              </button>
              <button
                onClick={() => setViewMode("manage")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === "manage" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Manage
              </button>
            </div>
          </div>

          {/* Content based on view mode and module availability */}
          {moduleSettings.length === 0 ? (
            // No modules visible
            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 text-yellow-400 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">No Modules Visible to Students</h3>
              <p className="text-gray-300 mb-4">
                You haven't made any modules visible to students yet. 
                Go to settings to enable modules for your students.
              </p>
              <button
                onClick={navigateToSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Go to Course Settings
              </button>
            </div>
          ) : viewMode === "training" ? (
            // Training View
            <>
              <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-300">
                  📚 Access training for the modules you've made visible to students. Complete all components to ensure you're fully prepared to teach each module.
                </p>
              </div>

              <div className="space-y-4">
                {moduleSettings.map((module) => {
                  const progress = getModuleProgress(module);
                  const progressPercentage = calculateProgress(progress);
                  const isComplete = progressPercentage === 100;
                  
                  return (
                    <div
                      key={module.id}
                      className={`p-6 bg-gray-800 rounded-lg border-2 transition-all duration-200 ${
                        isComplete ? 'border-green-600' : 'border-gray-700'
                      } hover:shadow-lg`}
                    >
                      {/* Module Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{module.name}</h3>
                            {isComplete ? (
                              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Complete
                              </span>
                            ) : progressPercentage > 0 ? (
                              <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                                In Progress
                              </span>
                            ) : (
                              <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                                Not Started
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{module.description}</p>
                          
                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-400">Training Progress</span>
                              <span className={isComplete ? "text-green-400" : "text-gray-400"}>
                                {progressPercentage}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isComplete ? 'bg-green-500' : 
                                  progressPercentage >= 60 ? 'bg-blue-500' :
                                  progressPercentage > 0 ? 'bg-yellow-500' : 'bg-gray-600'
                                }`}
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>

                          {/* Component Status Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                            {[
                              { key: 'introduction_video', label: 'Intro Video', icon: '🎥' },
                              { key: 'mini_lecture', label: 'Mini Lecture', icon: '📖' },
                              { key: 'getting_started', label: 'Getting Started', icon: '🚀' },
                              { key: 'software', label: 'Software', icon: '💻' },
                              { key: 'workbook', label: 'Workbook', icon: '📝' },
                              { key: 'quiz', label: 'Quiz', icon: '✅' }
                            ].map(component => (
                              <div 
                                key={component.key}
                                className={`flex items-center gap-2 text-xs p-2 rounded transition-colors ${
                                  progress[component.key] 
                                    ? 'bg-green-900/30 text-green-400 border border-green-800' 
                                    : 'bg-gray-700/30 text-gray-500 border border-gray-700'
                                }`}
                              >
                                <span className="text-base">{component.icon}</span>
                                <span className="flex-1">{component.label}</span>
                                {progress[component.key] && (
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => navigateToTraining(module.module_rank)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              {isComplete ? 'Review Training' : progressPercentage > 0 ? 'Continue Training' : 'Start Training'}
                            </button>
                            {progress.quiz ? (
                              <button
                                onClick={() => navigateToQuiz(module.module_rank)}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Retake Quiz
                              </button>
                            ) : (
                              <button
                                onClick={() => navigateToQuiz(module.module_rank)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                              >
                                Take Quiz
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
                  <p className="text-2xl font-bold text-green-400">
                    {moduleSettings.filter(m => calculateProgress(getModuleProgress(m)) === 100).length}
                  </p>
                  <p className="text-sm text-gray-400">Complete</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
                  <p className="text-2xl font-bold text-yellow-400">
                    {moduleSettings.filter(m => {
                      const p = calculateProgress(getModuleProgress(m));
                      return p > 0 && p < 100;
                    }).length}
                  </p>
                  <p className="text-sm text-gray-400">In Progress</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
                  <p className="text-2xl font-bold text-gray-400">
                    {moduleSettings.filter(m => calculateProgress(getModuleProgress(m)) === 0).length}
                  </p>
                  <p className="text-sm text-gray-400">Not Started</p>
                </div>
              </div>
            </>
          ) : (
            // Manage View
            <>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-300">
                  ⚙️ These modules are currently visible to your students. Training progress is shown for each module.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {moduleSettings.map((module) => {
                  const progress = getModuleProgress(module);
                  const progressPercentage = calculateProgress(progress);
                  const isComplete = progressPercentage === 100;
                  
                  return (
                    <div
                      key={module.id}
                      className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold flex-1">{module.name}</h3>
                        <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded ml-2">
                          Visible
                        </span>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{module.description}</p>
                      
                      {/* Mini Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Training</span>
                          <span className={isComplete ? "text-green-400" : "text-gray-500"}>
                            {progressPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div
                            className={`h-full rounded-full ${
                              isComplete ? 'bg-green-500' : 
                              progressPercentage > 0 ? 'bg-yellow-500' : 'bg-gray-600'
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                      
                      {!isComplete && (
                        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded p-2 mb-3">
                          <p className="text-xs text-yellow-300">
                            ⚠️ Training incomplete
                          </p>
                        </div>
                      )}
                      
                      <button
                        onClick={() => navigateToTraining(module.module_rank)}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm transition-colors"
                      >
                        Go to Training
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={navigateToSettings}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Manage Module Visibility in Settings
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}