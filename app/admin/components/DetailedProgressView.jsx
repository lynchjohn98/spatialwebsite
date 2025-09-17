// DetailedProgressView.jsx
import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp, X } from 'lucide-react';

export function DetailedProgressView({ teachers }) {
  const [expandedModules, setExpandedModules] = useState({});

  const toggleModuleExpansion = (teacherId, moduleName) => {
    const key = `${teacherId}-${moduleName}`;
    setExpandedModules(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getProgressColor = (percentage) => {
    if (percentage === 100) return 'text-green-400';
    if (percentage >= 75) return 'text-blue-400';
    if (percentage >= 50) return 'text-yellow-400';
    if (percentage >= 25) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {teachers.map(teacher => (
        <div key={teacher.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          {/* Teacher Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
            <div>
              <h3 className="text-xl font-bold">{teacher.name || 'N/A'}</h3>
              <p className="text-sm text-gray-400">
                {teacher.username} • {teacher.email}
              </p>
              {teacher.totalStudents > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {teacher.totalStudents} students • {teacher.activeStudents} active
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                <span className={getProgressColor(teacher.overallTrainingProgress || 0)}>
                  {teacher.overallTrainingProgress || 0}%
                </span>
              </div>
              <p className="text-xs text-gray-400">Overall Progress</p>
            </div>
          </div>
          
          {/* Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-gray-700/30 p-3 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Pretest</span>
                {teacher.pretest_complete ? 
                  <CheckCircle className="w-4 h-4 text-green-400" /> : 
                  <Clock className="w-4 h-4 text-gray-400" />
                }
              </div>
              <span className="text-sm font-medium">
                {teacher.pretest_complete ? 'Complete' : 'Pending'}
              </span>
            </div>
            
            <div className="bg-gray-700/30 p-3 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Training</span>
                {teacher.training_complete ? 
                  <CheckCircle className="w-4 h-4 text-green-400" /> : 
                  <Clock className="w-4 h-4 text-gray-400" />
                }
              </div>
              <span className="text-sm font-medium">
                {teacher.training_complete ? 'Complete' : 'In Progress'}
              </span>
            </div>
            
            <div className="bg-gray-700/30 p-3 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Posttest</span>
                {teacher.posttest_complete ? 
                  <CheckCircle className="w-4 h-4 text-green-400" /> : 
                  <Clock className="w-4 h-4 text-gray-400" />
                }
              </div>
              <span className="text-sm font-medium">
                {teacher.posttest_complete ? 'Complete' : 'Pending'}
              </span>
            </div>
            
            <div className="bg-gray-700/30 p-3 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Research</span>
                {teacher.research_consent ? 
                  <CheckCircle className="w-4 h-4 text-green-400" /> : 
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                }
              </div>
              <span className="text-sm font-medium">
                {teacher.research_consent ? 'Consented' : 'No Consent'}
              </span>
            </div>
          </div>
          
          {/* Module Details */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-300 mb-2">Module Progress Details</h4>
            {Object.entries(teacher.moduleProgressDetails || {}).map(([moduleName, moduleData]) => {
              const key = `${teacher.id}-${moduleName}`;
              const isExpanded = expandedModules[key];
              
              return (
                <div key={moduleName} className="bg-gray-700/30 rounded overflow-hidden">
                  <button
                    onClick={() => toggleModuleExpansion(teacher.id, moduleName)}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {moduleData.isComplete ? 
                        <CheckCircle className="w-5 h-5 text-green-400" /> :
                        moduleData.percentage > 0 ?
                        <Clock className="w-5 h-5 text-yellow-400" /> :
                        <AlertCircle className="w-5 h-5 text-gray-400" />
                      }
                      <span className="font-medium text-sm">{moduleName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressBarColor(moduleData.percentage)}`}
                            style={{ width: `${moduleData.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm">{moduleData.percentage}%</span>
                      </div>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-3 py-2 bg-gray-800/30 border-t border-gray-600">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        {['introduction_video', 'mini_lecture', 'getting_started', 'software', 'workbook', 'quiz'].map(component => {
                          const componentExists = component in moduleData;
                          const isCompleted = moduleData[component] === true;
                          
                          if (!componentExists) return null;
                          
                          return (
                            <div key={component} className="flex items-center gap-1">
                              {isCompleted ? 
                                <CheckCircle className="w-3 h-3 text-green-400" /> :
                                <X className="w-3 h-3 text-gray-500" />
                              }
                              <span className={isCompleted ? 'text-green-400' : 'text-gray-500'}>
                                {component.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {moduleData.completed_at && (
                        <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
                          Completed: {formatDateTime(moduleData.completed_at)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            
            {(!teacher.moduleProgressDetails || Object.keys(teacher.moduleProgressDetails).length === 0) && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No module progress data available
              </div>
            )}
          </div>
          
          {/* Quiz Performance Summary */}
          {teacher.quizMetrics?.totalAttempts > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="font-semibold text-sm text-gray-300 mb-2">Quiz Performance</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-700/30 p-2 rounded text-center">
                  <div className="text-lg font-bold">{teacher.quizMetrics.totalAttempts}</div>
                  <div className="text-xs text-gray-400">Total Attempts</div>
                </div>
                <div className="bg-gray-700/30 p-2 rounded text-center">
                  <div className="text-lg font-bold">{teacher.quizMetrics.completedQuizzes}</div>
                  <div className="text-xs text-gray-400">Unique Quizzes</div>
                </div>
                <div className="bg-gray-700/30 p-2 rounded text-center">
                  <div className={`text-lg font-bold ${getProgressColor(teacher.quizMetrics.averageScore)}`}>
                    {teacher.quizMetrics.averageScore}%
                  </div>
                  <div className="text-xs text-gray-400">Average Score</div>
                </div>
                <div className="bg-gray-700/30 p-2 rounded text-center">
                  <div className={`text-lg font-bold ${getProgressColor(teacher.quizMetrics.bestScore)}`}>
                    {teacher.quizMetrics.bestScore}%
                  </div>
                  <div className="text-xs text-gray-400">Best Score</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Course Summary */}
          {teacher.coursesCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="font-semibold text-sm text-gray-300 mb-2">Courses Created</h4>
              <div className="flex flex-wrap gap-2">
                {teacher.courses.map(course => (
                  <div key={course.id} className="bg-gray-700/30 px-3 py-1 rounded text-sm">
                    {course.course_name || course.course_school_name || 'Unnamed'}
                    <span className="text-xs text-gray-400 ml-2">
                      ({course.course_join_code})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      
      {teachers.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No teachers found matching the current filters.
        </div>
      )}
    </div>
  );
}