"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard({ onLogout }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated data loading - replace with actual API calls
  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, these would be API calls to your Supabase backend
        // For now, we'll use mock data
        setCourses([
          { id: 1, name: "Experimental Group A", school: "Malahide Community School", teacherName: "John Smith", studentsCount: 24 },
          { id: 2, name: "Control Group B", school: "St Josephs Castlebar", teacherName: "Mary Johnson", studentsCount: 22 },
          { id: 3, name: "Experimental Group C", school: "Patrician High School", teacherName: "Robert Davis", studentsCount: 18 },
        ]);
        
        setStudents([
          { id: 1, name: "Alice Brown", school: "Malahide Community School", grade: "10", joinDate: "2023-09-05" },
          { id: 2, name: "Bob Smith", school: "St Josephs Castlebar", grade: "11", joinDate: "2023-09-07" },
          { id: 3, name: "Charlie Green", school: "Patrician High School", grade: "9", joinDate: "2023-09-10" },
        ]);
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Admin Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Spatial Thinking Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4">
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === "overview"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === "courses"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveTab("courses")}
            >
              Courses
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === "students"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveTab("students")}
            >
              Students
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === "settings"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-6 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">System Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-6 rounded-lg shadow">
                      <h3 className="text-lg font-medium text-blue-300 mb-2">Total Courses</h3>
                      <p className="text-3xl font-bold">{courses.length}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow">
                      <h3 className="text-lg font-medium text-blue-300 mb-2">Total Students</h3>
                      <p className="text-3xl font-bold">{students.length}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow">
                      <h3 className="text-lg font-medium text-blue-300 mb-2">Active Schools</h3>
                      <p className="text-3xl font-bold">{Array.from(new Set(courses.map(course => course.school))).length}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "courses" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Courses</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                      Create New Course
                    </button>
                  </div>
                  <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Course Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            School
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Teacher
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Students
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {courses.map((course) => (
                          <tr key={course.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{course.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{course.school}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{course.teacherName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{course.studentsCount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                              <button className="text-blue-500 hover:text-blue-400">View</button>
                              <button className="text-yellow-500 hover:text-yellow-400">Edit</button>
                              <button className="text-red-500 hover:text-red-400">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "students" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Students</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                      Add New Student
                    </button>
                  </div>
                  <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            School
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Grade
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Join Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {students.map((student) => (
                          <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{student.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{student.school}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{student.grade}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{student.joinDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                              <button className="text-blue-500 hover:text-blue-400">View</button>
                              <button className="text-yellow-500 hover:text-yellow-400">Edit</button>
                              <button className="text-red-500 hover:text-red-400">Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Admin Settings</h2>
                  <div className="bg-gray-800 p-6 rounded-lg shadow">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-blue-300 mb-4">Admin Access</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Change Admin Passcode
                          </label>
                          <input
                            type="password"
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white"
                            placeholder="New passcode"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Confirm New Passcode
                          </label>
                          <input
                            type="password"
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white"
                            placeholder="Confirm passcode"
                          />
                        </div>
                      </div>
                      <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                        Update Passcode
                      </button>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-blue-300 mb-4">Teacher Passcode</h3>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Course Creation Passcode
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white"
                            defaultValue="1234"
                          />
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-blue-300 mb-4">System Maintenance</h3>
                      <div className="space-y-4">
                        <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition-colors">
                          Backup Database
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors ml-4">
                          Clear Test Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}