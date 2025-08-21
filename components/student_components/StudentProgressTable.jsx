"use client";
import { useState, useEffect } from "react";
import { fetchStudentProgressPage } from "../../app/library/services/student_actions";
import { defaultModuleProgress } from "../../app/library/helpers/helpers";

export default function StudentProgressTracker({ studentData, courseData }) {
  const [progressData, setProgressData] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const moduleNames = Object.values(defaultModuleProgress).map(module => module.title);

  useEffect(() => {
    const loadProgressData = async () => {
      if (!studentData?.id) {
        setError("No student ID found");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetchStudentProgressPage(studentData.id);
        if (response.success) {
          setProgressData(response.data);
        } else {
          setError(response.error || "Failed to load progress data");
        }
      } catch (err) {
        console.error("Error loading progress:", err);
        setError("An error occurred while loading progress data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProgressData();
  }, [studentData]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const calculateModuleProgress = (moduleData) => {
    if (!moduleData) return 0;
    const components = ['quiz', 'software', 'workbook', 'mini_lecture', 'getting_started_videos'];
    const completed = components.filter(comp => moduleData[comp]).length;
    return (completed / components.length) * 100;
  };

  const calculateOverallProgress = () => {
    if (!progressData?.module_progress) return 0;
    const modules = progressData.module_progress;
    const totalModules = Object.keys(modules).length;
    const completedModules = Object.values(modules).filter(m => m.completed_at).length;
    return Math.round((completedModules / totalModules) * 100);
  };

  const getStatusColor = (isComplete) => {
    return isComplete ? 'text-green-400' : 'text-gray-500';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 30) return 'bg-yellow-500';
    return 'bg-gray-600';
  };

  const getStatusIcon = (isComplete) => {
    return isComplete ? (
      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading progress data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-300 text-lg font-medium mb-2">Unable to Load Progress</p>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  const moduleProgress = progressData?.module_progress || {};
  const overallProgress = calculateOverallProgress();

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Overall Course Progress</h2>
          <span className="text-2xl font-bold text-blue-400">{overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <div 
            className={`h-full ${getProgressBarColor(overallProgress)} transition-all duration-500`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">
              {Object.values(moduleProgress).filter(m => m.completed_at).length}
            </p>
            <p className="text-sm text-gray-400">Modules Complete</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400">
              {Object.values(moduleProgress).filter(m => calculateModuleProgress(m) > 0 && !m.completed_at).length}
            </p>
            <p className="text-sm text-gray-400">In Progress</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-400">
              {Object.values(moduleProgress).filter(m => calculateModuleProgress(m) === 0).length}
            </p>
            <p className="text-sm text-gray-400">Not Started</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">
              {Object.values(moduleProgress).reduce((acc, m) => acc + (m.quiz ? 1 : 0), 0)}
            </p>
            <p className="text-sm text-gray-400">Quizzes Passed</p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Module Progress</h3>
        <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Modules Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {Object.entries(moduleProgress).map(([moduleId, moduleData]) => {
          const progress = calculateModuleProgress(moduleData);
          const isExpanded = expandedModules[moduleId];
          const isComplete = moduleData.completed_at !== null;

          return (
            <div
              key={moduleId}
              className={`bg-gray-800 rounded-lg border transition-all duration-200 ${
                isComplete ? 'border-green-600' : 'border-gray-700'
              } p-4`}
            >
              {/* Module Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {isComplete ? (
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : progress > 0 ? (
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <span className="text-xs font-medium text-gray-400">Module {moduleId}</span>
                  </div>
                  <h3 className="font-semibold text-base">{moduleNames[parseInt(moduleId) - 1] || `Module ${moduleId}`}</h3>
                </div>
                <button
                  onClick={() => toggleModule(moduleId)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <svg className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className={progress === 100 ? 'text-green-400' : 'text-gray-400'}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${getProgressBarColor(progress)} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Component Status */}
              {(isExpanded || viewMode === 'list') && (
                <div className="space-y-2 pt-3 border-t border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className={getStatusColor(moduleData.mini_lecture)}>Mini Lecture</span>
                    {getStatusIcon(moduleData.mini_lecture)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={getStatusColor(moduleData.getting_started_videos)}>Getting Started Videos</span>
                    {getStatusIcon(moduleData.getting_started_videos)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={getStatusColor(moduleData.software)}>Interactive Software</span>
                    {getStatusIcon(moduleData.software)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={getStatusColor(moduleData.workbook)}>Workbook Activities</span>
                    {getStatusIcon(moduleData.workbook)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={getStatusColor(moduleData.quiz)}>Module Quiz</span>
                    {getStatusIcon(moduleData.quiz)}
                  </div>

                  {moduleData.completed_at && (
                    <div className="pt-2 mt-2 border-t border-gray-700">
                      <p className="text-xs text-gray-400">
                        Completed: {new Date(moduleData.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}