// TeacherOverviewTable.jsx
import React, { useState } from 'react';
import { CheckCircle, Clock, ChevronDown, ChevronUp, Users, BookOpen } from 'lucide-react';

export function TeacherOverviewTable({ teachers, router }) {
  const [expandedTeacher, setExpandedTeacher] = useState(null);

  const toggleTeacherExpansion = (teacherId) => {
    setExpandedTeacher(expandedTeacher === teacherId ? null : teacherId);
  };

  const getProgressBarColor = (percentage) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status) => {
    if (status) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const navigateToCourse = (courseId) => {
    router.push(`/admin/course/${courseId}`);
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Teacher Progress Overview</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr className="bg-gray-800/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Teacher Info
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Module Progress
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Assessment Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Quiz Performance
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Courses & Students
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Last Activity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {teachers.map((teacher) => (
              <React.Fragment key={teacher.id}>
                <tr className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleTeacherExpansion(teacher.id)}
                      className="text-left hover:text-blue-400 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {teacher.coursesCount > 0 && (
                          expandedTeacher === teacher.id ? 
                          <ChevronUp size={16} /> : 
                          <ChevronDown size={16} />
                        )}
                        <div>
                          <div className="font-medium">{teacher.name || 'N/A'}</div>
                          <div className="text-sm text-gray-400">{teacher.username}</div>
                          <div className="text-xs text-gray-500">{teacher.email}</div>
                        </div>
                      </div>
                    </button>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-700 rounded-full h-2 max-w-[150px]">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(teacher.moduleProgressPercentage || 0)}`}
                            style={{ width: `${teacher.moduleProgressPercentage || 0}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {teacher.moduleProgressPercentage || 0}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {teacher.completedModules || 0}/{teacher.totalModules || 0} modules
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(teacher.pretest_complete)}
                        <span className="text-xs">Pretest</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(teacher.training_complete)}
                        <span className="text-xs">Training</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(teacher.posttest_complete)}
                        <span className="text-xs">Posttest</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(teacher.research_consent)}
                        <span className="text-xs">Research</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    {teacher.quizMetrics?.totalAttempts > 0 ? (
                      <div className="space-y-1">
                        <div className="text-sm">
                          Avg: <span className="font-medium">{teacher.quizMetrics.averageScore}%</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Best: {teacher.quizMetrics.bestScore}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {teacher.quizMetrics.totalAttempts} attempts
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No attempts</span>
                    )}
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">
                          {teacher.coursesCount || 0} courses
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-400" />
                        <span className="text-sm">
                          {teacher.totalStudents || 0} students
                        </span>
                      </div>
                      {teacher.activeStudents > 0 && (
                        <div className="text-xs text-gray-400">
                          {teacher.activeStudents} active
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-400">
                      {formatDate(teacher.lastActivity)}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <button
                      onClick={() => router.push(`/admin/teacher/${teacher.id}`)}
                      className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
                
                {/* Expanded Courses Section */}
                {expandedTeacher === teacher.id && teacher.coursesCount > 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-3 bg-gray-750/50">
                      <div className="pl-8">
                        <h4 className="text-sm font-semibold mb-3 text-gray-300">Created Courses:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {teacher.courses.map(course => (
                            <div
                              key={course.id}
                              className="flex items-center justify-between p-3 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {course.course_name || course.course_school_name || 'Unnamed Course'}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  <span>Code: {course.course_join_code}</span>
                                  <span className="ml-3">County: {course.course_county || 'N/A'}</span>
                                  {course.course_research_type && (
                                    <span className="ml-3">Type: {course.course_research_type}</span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Teacher: {course.course_teacher_name}
                                  {course.course_language && (
                                    <span className="ml-3">Language: {course.course_language}</span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => navigateToCourse(course.id)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors ml-3"
                              >
                                View →
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            
            {teachers.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                  No teachers found matching the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}