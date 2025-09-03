"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getAllTeacherCourses, updateTeacherCourseSettings
} from "../../library/services/teacher_actions";
import { deleteCourse, updateCourse } from "../../library/services/course_actions";

export default function TeacherCoursesPage() {
  const router = useRouter();
  const [teacherData, setTeacherData] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showActions, setShowActions] = useState({}); // For mobile menu
  
  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    course_name: '',

    course_county: '',
    course_urbanicity: '',
    course_gender: '',
    course_deis: '',
    course_research: false,
    course_research_type: '',
    course_language: ''
  });

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
      
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
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

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteCourse(courseToDelete.id);
      if (result.success) {
        // Remove the course from the list
        setAllCourses(allCourses.filter(c => c.id !== courseToDelete.id));
        setShowDeleteModal(false);
        setCourseToDelete(null);
        
        // Update session storage if needed
        const storedData = JSON.parse(sessionStorage.getItem("teacherData"));
        if (storedData && storedData.courses) {
          storedData.courses = storedData.courses.filter(c => c.id !== courseToDelete.id);
          sessionStorage.setItem("teacherData", JSON.stringify(storedData));
        }
      } else {
        alert("Failed to delete course. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("An error occurred while deleting the course.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (course) => {
    setCourseToEdit(course);
    setEditFormData({
      course_name: course.course_name || '',
      course_county: course.course_county || '',
      course_urbanicity: course.course_urbanicity || '',
      course_gender: course.course_gender || '',
      course_deis: course.course_deis || '',
      course_research: course.course_research || false,
      course_research_type: course.course_research_type || '',
      course_language: course.course_language || ''
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditConfirm = async () => {
    if (!courseToEdit) return;

    setIsUpdating(true);
    try {
      const result = await updateTeacherCourseSettings(editFormData, courseToEdit.id);
      if (result.success) {
        // Update the course in the list
        setAllCourses(allCourses.map(c => 
          c.id === courseToEdit.id 
            ? { ...c, ...editFormData, updated_at: new Date().toISOString() }
            : c
        ));
        setShowEditModal(false);
        setCourseToEdit(null);
        
        // Update session storage if needed
        const storedData = JSON.parse(sessionStorage.getItem("teacherData"));
        if (storedData && storedData.courses) {
          storedData.courses = storedData.courses.map(c => 
            c.id === courseToEdit.id 
              ? { ...c, ...editFormData }
              : c
          );
          sessionStorage.setItem("teacherData", JSON.stringify(storedData));
        }
      } else {
        alert("Failed to update course. Please try again.");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("An error occurred while updating the course.");
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleActions = (courseId) => {
    setShowActions(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
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
      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 border border-gray-700 my-8">
            <h3 className="text-xl font-semibold mb-6 text-white">Edit Course</h3>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Course Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Course Name
                </label>
                <input
                  type="text"
                  value={editFormData.course_name}
                  onChange={(e) => handleEditFormChange('course_name', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter course name"
                />
              </div>


              {/* County */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  County
                </label>
                <input
                  type="text"
                  value={editFormData.course_county}
                  onChange={(e) => handleEditFormChange('course_county', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter county"
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={editFormData.course_language}
                  onChange={(e) => handleEditFormChange('course_language', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Irish">Irish</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>

              {/* Urbanicity */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Area Type
                </label>
                <select
                  value={editFormData.course_urbanicity}
                  onChange={(e) => handleEditFormChange('course_urbanicity', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Area Type</option>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  School Gender Type
                </label>
                <select
                  value={editFormData.course_gender}
                  onChange={(e) => handleEditFormChange('course_gender', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Gender Type</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              {/* DEIS */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  School Type
                </label>
                <select
                  value={editFormData.course_deis}
                  onChange={(e) => handleEditFormChange('course_deis', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select School Type</option>
                  <option value="DEIS">DEIS</option>
                  <option value="Non-DEIS">Non-DEIS</option>
                </select>
              </div>

              {/* Research */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Research Participation
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={editFormData.course_research === true}
                      onChange={() => handleEditFormChange('course_research', true)}
                      className="mr-2 text-blue-600"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={editFormData.course_research === false}
                      onChange={() => handleEditFormChange('course_research', false)}
                      className="mr-2"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {/* Research Type (shown only if research is true) */}
              {editFormData.course_research && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Research Type
                  </label>
                  <select
                    value={editFormData.course_research_type}
                    onChange={(e) => handleEditFormChange('course_research_type', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Research Type</option>
                    <option value="Control">Control</option>
                    <option value="Experimental">Experimental</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setCourseToEdit(null);
                }}
                disabled={isUpdating}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditConfirm}
                disabled={isUpdating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-white">Delete Course</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-semibold text-white">
                {courseToDelete?.course_name || 'this course'}
              </span>? This action cannot be undone and will remove all associated students, grades, and settings.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCourseToDelete(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete Course</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
                        <th className="px-8 py-4 text-center text-sm font-medium text-gray-400 uppercase tracking-wider">Actions</th>
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
                              
                              <div className="flex items-center gap-2 mb-2">
                                <div className="text-sm text-blue-300 font-mono">
                                  <span>Join Code: </span>{course.course_join_code}
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
                                
                                {/* Join Course button */}
                                <button
                                  onClick={() => router.push(`/teacher/join?code=${course.course_join_code}`)}
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors flex items-center gap-1"
                                  title="Join this course"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                  </svg>
                                  Join
                                </button>
                                
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
                          <td className="px-8 py-6">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEditClick(course)}
                                className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors group"
                                title="Edit course"
                              >
                                <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(course)}
                                className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors group"
                                title="Delete course"
                              >
                                <svg className="w-5 h-5 text-red-400 group-hover:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
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
                  {/* Course Header with Actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-white text-lg mb-2">
                        {course.course_name || 'Unnamed Course'}
                      </h3>
                      
                      {/* Join Code with Copy and Join Buttons - Mobile */}
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
                        
                        {/* Join Course button for mobile */}
                        <button
                          onClick={() => router.push(`/teacher/join?code=${course.course_join_code}`)}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                          title="Join this course"
                        >
                          Join
                        </button>
                        
                        {copiedCode === course.course_join_code && (
                          <span className="text-xs text-green-400 font-medium animate-fade-in">
                            Copied!
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Mobile Actions Menu */}
                    <div className="relative">
                      <button
                        onClick={() => toggleActions(course.id)}
                        className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      
                      {showActions[course.id] && (
                        <div className="absolute right-0 top-10 z-20 bg-gray-700 rounded-lg shadow-lg border border-gray-600 overflow-hidden">
                          <button
                            onClick={() => {
                              handleEditClick(course);
                              setShowActions({});
                            }}
                            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-600 transition-colors text-blue-400 w-full text-left"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit Course</span>
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteClick(course);
                              setShowActions({});
                            }}
                            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-600 transition-colors text-red-400 w-full text-left"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete Course</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Research Badge */}
                  <div className="mb-4">
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