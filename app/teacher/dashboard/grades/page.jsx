"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchGradesTeacher } from "../../../library/services/actions";
import Sidebar from "../../../../components/teacher_components/TeacherSidebar"

export default function Grades() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [gradesData, setGradesData] = useState([]);
  const [expandedStudents, setExpandedStudents] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  

  const studentGradesMap = gradesData.reduce((acc, grade) => {
    const studentId = grade.student_id;
    if (!acc[studentId]) {
      acc[studentId] = {
        id: studentId,
        name: `${grade.student?.first_name || 'Unknown'} ${grade.student?.last_name || ''}`,
        grades: []
      };
    }
    acc[studentId].grades.push({
      id: grade.id,
      quiz_name: grade.quizzes?.name || 'Unknown Quiz',
      score: grade.score,
      total_score: grade.quizzes?.total_score || 100,
      time_start: grade.time_start,
      time_end: grade.time_end,
      completion_date: grade.created_at,
      attempt_number: grade.attempt_number
    });
    
    return acc;
  }, {});

  const studentsList = Object.values(studentGradesMap);

  const loadData = useCallback(async () => {
    if (!isMounted) return;
    setIsLoading(true);
    try {
      const storedData = sessionStorage.getItem("courseData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setCourseData(parsedData);
        const response = await fetchGradesTeacher(parsedData.id);
        if (response.data) {
          setGradesData(response.data);
        }
      }
    } catch (error) {
      console.error("Error loading course data:", error);
      router.push("/teacher-join");
    } finally {
      setIsLoading(false);
    }
  }, [router, isMounted]);

  const toggleStudentExpand = (studentId) => {
    setExpandedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const checkWindowSize = () => {
        setIsSidebarOpen(window.innerWidth >= 1024);
      };
      checkWindowSize();
      window.addEventListener('resize', checkWindowSize);
      return () => window.removeEventListener('resize', checkWindowSize);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      loadData();
    }
  }, [loadData, isMounted]);
  if (!isMounted || isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white text-4xl font-bold">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p>Loading...</p>
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
      <main className="flex-1 p-6 transition-all duration-300">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Student Grades</h1>
          
          {studentsList.length > 0 ? (
            <div className="space-y-4">
              {studentsList.map((student) => (
                <div key={student.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  {/* Student Header - Always visible */}
                  <div 
                    className="p-4 bg-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-600 transition-colors"
                    onClick={() => toggleStudentExpand(student.id)}
                  >
                    <div className="font-semibold text-lg">
                      {student.name}
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{expandedStudents[student.id] ? 'Hide Grades' : 'Show Grades'}</span>
                      <span className="text-2xl transition-transform duration-300 transform">
                        {expandedStudents[student.id] ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Expandable Grades Section */}
                  <div className={`overflow-hidden transition-all duration-500 ${
                    expandedStudents[student.id] ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}>
                    <div className="p-4">
                      {student.grades.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-gray-700">
                                <th className="p-3 border border-gray-600">Quiz</th>
                                <th className="p-3 border border-gray-600">Score</th>
                                <th className="p-3 border border-gray-600">Total Points</th>
                                <th className="p-3 border border-gray-600">Time Taken</th>
                                <th className="p-3 border border-gray-600">Attempt</th>
                                <th className="p-3 border border-gray-600">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {student.grades.map((grade) => (
                                <tr key={grade.id} className="bg-gray-700 hover:bg-gray-600">
                                  <td className="p-3 border border-gray-600">{grade.quiz_name}</td>
                                  <td className="p-3 border border-gray-600">{grade.score}%</td>
                                  <td className="p-3 border border-gray-600">{grade.total_score} pts</td>
                                  <td className="p-3 border border-gray-600">
                                    {grade.time_start && grade.time_end ? 
                                      `${Math.round((new Date(grade.time_end) - new Date(grade.time_start)) / 60000)} mins` : 
                                      'N/A'}
                                  </td>
                                  <td className="p-3 border border-gray-600">{grade.attempt_number || 1}</td>
                                  <td className="p-3 border border-gray-600">
                                    {new Date(grade.completion_date).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">No quiz attempts yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
              <p className="text-center text-gray-400">No grade data available.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}