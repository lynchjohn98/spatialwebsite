"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getAllTeacherCourses,
} from "../../library/services/teacher_actions";

export default function TeacherCoursesPage() {
  const router = useRouter();
  const [teacherData, setTeacherData] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const storedData = JSON.parse(sessionStorage.getItem("teacherData"));
        console.log("Stored teacher data:", storedData);
        setTeacherData(storedData);
        const coursesResult = await getAllTeacherCourses(storedData);
        if (coursesResult.success && coursesResult.data) {
          setAllCourses(coursesResult.data);
          console.log("Loaded courses:", coursesResult.data);
        } else {
          console.error("Failed to load courses:", coursesResult.message);
        }
      } catch (error) {
        console.error("Error loading teacher data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeacherData();
  }, []);

 const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

const handleCopy = async (joinCode) => {
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopiedCode(joinCode);
      
      // Reset the "copied" state after 2 seconds
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = joinCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedCode(joinCode);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const getBadgeColor = (type, value) => {
    switch (type) {
      case 'research':
        return value ? 'bg-green-600' : 'bg-gray-600';
      case 'deis':
        return value === 'DEIS' ? 'bg-blue-600' : 'bg-purple-600';
      case 'gender':
        return value === 'Male' ? 'bg-blue-600' : value === 'Female' ? 'bg-pink-600' : 'bg-cyan-600';
      case 'urbanicity':
        return value === 'Urban' ? 'bg-orange-600' : 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
              <span className="font-medium">Back to Homepage</span>
            </button>
            
            <div className="text-sm text-gray-400">
              {allCourses.length} Course{allCourses.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">User's {teacherData?.username} Courses</h1>
          {teacherData && (
            <p className="text-gray-400">Welcome to your courses, {teacherData.name}</p>
          )}
        </div>

        {allCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <button onClick={() => router.push("/teacher/create-course")}>
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No courses found</h3>
            <p className="text-gray-500">You haven't created any courses yet.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Course Info</th>
                        <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Location</th>
                        <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Demographics</th>
                        <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Research</th>
                        <th className="px-8 py-4 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {allCourses.map((course) => (
                        <tr key={course.id} className="hover:bg-gray-700/30 transition-colors">
                          <td className="px-8 py-6">
                            <div>
                              <div className="font-medium text-white mb-2 text-base">
                                {course.course_name || 'Unnamed Course'}
                              </div>
                              
                              {/* Join Code with Copy Button */}
                              <div className="flex items-center gap-2 mb-2">
                                <div className="text-sm text-blue-300 font-mono">
                                  <span>Teacher Join Code: </span>{course.course_join_code}
                                </div>
                                
                                <button
                                  onClick={() => handleCopy(course.course_join_code)}
                                  className="group relative flex items-center justify-center w-6 h-6 rounded hover:bg-gray-700/50 transition-colors"
                                  title={copiedCode === course.course_join_code ? "Copied!" : "Copy join code"}
                                >
                                  {copiedCode === course.course_join_code ? (
                                    <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                  )}
                                </button>
                                
                                {/* "Code copied" text */}
                                {copiedCode === course.course_join_code && (
                                  <span className="text-xs text-green-400 font-medium animate-fade-in">
                                    Code copied!
                                  </span>
                                )}
                              </div>
                              
                              <div className="text-sm text-gray-400">
                                <span>Language: </span>
                                {course.course_language}
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-sm">
                              <div className="text-white text-base mb-2">{course.course_county}</div>
                              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full text-white ${getBadgeColor('urbanicity', course.course_urbanicity)}`}>
                                {course.course_urbanicity}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-2">
                              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full text-white w-fit ${getBadgeColor('gender', course.course_gender)}`}>
                                {course.course_gender}
                              </span>
                              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full text-white w-fit ${getBadgeColor('deis', course.course_deis)}`}>
                                {course.course_deis}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-2">
                              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full text-white w-fit ${getBadgeColor('research', course.course_research)}`}>
                                {course.course_research ? 'Yes' : 'No'}
                              </span>
                              {course.course_research && (
                                <span className="text-sm text-gray-400">
                                  {course.course_research_type}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm text-gray-400">
                            {formatDate(course.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {allCourses.map((course) => (
                <div key={course.id} className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
                  {/* Course Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-white text-lg mb-2">
                        {course.course_name || 'Unnamed Course'}
                      </h3>
                      
                      {/* Join Code with Copy Button - Mobile */}
                      <div className="flex items-center gap-2">
                        <div className="text-blue-300 font-mono text-sm">
                          {course.course_join_code}
                        </div>
                        
                        <button
                          onClick={() => handleCopy(course.course_join_code)}
                          className="group relative flex items-center justify-center w-6 h-6 rounded hover:bg-gray-700/50 transition-colors"
                          title={copiedCode === course.course_join_code ? "Copied!" : "Copy join code"}
                        >
                          {copiedCode === course.course_join_code ? (
                            <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                        
                        {/* "Code copied" text */}
                        {copiedCode === course.course_join_code && (
                          <span className="text-xs text-green-400 font-medium animate-fade-in">
                            Code copied!
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full text-white ${getBadgeColor('research', course.course_research)}`}>
                      Research: {course.course_research ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {/* Course Details Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Language:</span>
                      <div className="text-white">{course.course_language}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">County:</span>
                      <div className="text-white">{course.course_county}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Area:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full text-white ml-2 ${getBadgeColor('urbanicity', course.course_urbanicity)}`}>
                        {course.course_urbanicity}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Gender:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full text-white ml-2 ${getBadgeColor('gender', course.course_gender)}`}>
                        {course.course_gender}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">School Type:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full text-white ml-2 ${getBadgeColor('deis', course.course_deis)}`}>
                        {course.course_deis}
                      </span>
                    </div>
                    {course.course_research && (
                      <div>
                        <span className="text-gray-400">Research Type:</span>
                        <div className="text-white">{course.course_research_type}</div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-400">
                    Created: {formatDate(course.created_at)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}