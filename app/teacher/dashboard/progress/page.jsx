"use client";
import { useState, useEffect, Fragment, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/teacher_components/TeacherSidebar";
import { fetchAllStudentCourseProgress } from "../../../library/services/teacher_services/student_progress";
import {
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Clock,
  Award,
  Download,
  RefreshCw,
  Eye,
  BookOpen,
  FileText,
  Monitor,
} from "lucide-react";
// Helper function to parse and organize data
const parseAndOrganizeData = (responseData) => {
  // Parse settings data
  const settings = responseData.course_settings_data[0];
  const moduleSettings = JSON.parse(settings.module_settings || "[]");
  const quizSettings = JSON.parse(settings.quiz_settings || "[]");
  const studentSettings = JSON.parse(settings.student_settings || "[]");

  // NEW: Create a mapping of quiz names to their total scores from the quizzes table
  const quizScoreMap = {};
  if (
    responseData.quiz_information_data &&
    Array.isArray(responseData.quiz_information_data)
  ) {
    responseData.quiz_information_data.forEach((quiz) => {
      // Map by both name and ID for flexible lookup
      if (quiz.name) {
        quizScoreMap[quiz.name] = quiz.total_score;
      }
      if (quiz.id) {
        quizScoreMap[quiz.id] = quiz.total_score;
      }
    });
  }

  // Create module lookup by name for progress mapping
  const modulesByName = {};
  moduleSettings.forEach((module) => {
    // Clean module name for matching
    const cleanName = module.name.replace(/^(Pre-)?Module \d+:\s*/, "");
    modulesByName[cleanName] = {
      ...module,
      number: module.module_rank,
      visible: module.visibility === "Yes",
    };
  });

  // Organize quiz settings by type and merge with total_score from quizzes table
  const organizedQuizzes = {
    module: [],
    survey: [],
    pre_post_test: [],
  };

  quizSettings.forEach((quiz) => {
    if (quiz.visibility === "Yes") {
      // UPDATED: Merge the total_score from the quizzes table
      const enhancedQuiz = {
        ...quiz,
        // Priority: quizzes table score > existing total_score > default 0
        total_score:
          quizScoreMap[quiz.name] ||
          quizScoreMap[quiz.id] ||
          quiz.total_score ||
          0,
      };
      organizedQuizzes[quiz.type]?.push(enhancedQuiz);
    }
  });

  // Process student data with their progress
  const processedStudents = responseData.students_demographic_data.map(
    (student) => {
      const progressRecord = responseData.students_progress_data.find(
        (p) => p.student_id === student.id
      );

      // Transform module progress to use module numbers as keys
      const transformedProgress = {};
      if (progressRecord?.module_progress) {
        Object.entries(progressRecord.module_progress).forEach(
          ([moduleName, progress]) => {
            // Try exact match first
            let moduleInfo = modulesByName[moduleName];

            // If not found, try without the module prefix
            if (!moduleInfo) {
              const cleanModuleName = moduleName.replace(
                /^(Pre-)?Module \d+:\s*/,
                ""
              );
              moduleInfo = modulesByName[cleanModuleName];
            }

            // If still not found, search through all modules for partial match
            if (!moduleInfo) {
              const foundModule = moduleSettings.find(
                (m) =>
                  m.name.includes(moduleName) ||
                  moduleName.includes(
                    m.name.replace(/^(Pre-)?Module \d+:\s*/, "")
                  )
              );
              if (foundModule) {
                moduleInfo = {
                  ...foundModule,
                  number: foundModule.module_rank,
                  visible: foundModule.visibility === "Yes",
                };
              }
            }

            if (moduleInfo) {
              transformedProgress[moduleInfo.number] = {
                ...progress,
                name: moduleName,
                visible: moduleInfo.visible,
              };
            }
          }
        );
      }

      // Process grades by module
      const gradesByModule = {};
      responseData.students_grade_data
        .filter((grade) => grade.student_id === student.id)
        .forEach((grade) => {
          // Map grade to module based on quiz name or module number
          const moduleNum = grade.module_number || grade.quiz_module_number;
          if (moduleNum !== undefined) {
            if (!gradesByModule[moduleNum]) {
              gradesByModule[moduleNum] = [];
            }
            gradesByModule[moduleNum].push(grade);
          }
        });

      return {
        ...student,
        progress: transformedProgress,
        quizGrades: gradesByModule,
      };
    }
  );

  return {
    students: processedStudents,
    modules: moduleSettings.sort((a, b) => a.module_rank - b.module_rank),
    quizzes: organizedQuizzes,
    visibleModules: moduleSettings
      .filter((m) => m.visibility === "Yes")
      .sort((a, b) => a.module_rank - b.module_rank),
    allGrades: responseData.students_grade_data || [],
    quizScoreMap: quizScoreMap, // NEW: Add this for reference if needed elsewhere
  };
};

export default function StudentProgress() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [organizedData, setOrganizedData] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedQuizzes, setExpandedQuizzes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [filterOptions, setFilterOptions] = useState({
    showCompleted: true,
    showIncomplete: true,
    moduleFilter: "all",
  });
  const router = useRouter();

  // Fetch data function using the actual service
  const fetchAllData = async (courseId) => {
    setIsLoading(true);
    try {
      const response = await fetchAllStudentCourseProgress({ courseId });

      if (response.success && response.data) {
        console.log("Successfully fetched data:", response.data);
        const organized = parseAndOrganizeData(response.data);
        setOrganizedData(organized);
      } else {
        console.error("Failed to fetch data:", response.error);
        // You might want to show an error toast or message here
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // You might want to show an error toast or message here
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Get courseData from sessionStorage
    const storedData = sessionStorage.getItem("courseData");
    console.log("Retrieved courseData from sessionStorage:", storedData);

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setCourseData(parsedData);
      fetchAllData(parsedData.id);
    } else {
      // If no courseData, might want to redirect or show error
      console.error("No course data found in sessionStorage");
      // router.push('/teacher/courses'); // Uncomment to redirect
    }
  }, []);

  const handleRefresh = () => {
    if (courseData?.id) {
      setIsRefreshing(true);
      fetchAllData(courseData.id);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return "N/A";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getCompletionStats = useMemo(() => {
    if (!organizedData) return { overall: 0, byModule: {}, byStudent: {} };

    const stats = {
      overall: 0,
      byModule: {},
      byStudent: {},
    };

    organizedData.students.forEach((student) => {
      let totalTasks = 0;
      let completedTasks = 0;

      Object.entries(student.progress).forEach(([moduleNum, progress]) => {
        if (!progress.visible) return;

        // UPDATED: Removed 'introduction_video' from tasks array
        const tasks = [
          "getting_started",
          "mini_lecture",
          "workbook",
          "software",
          "quiz",
        ];
        const moduleTasks = tasks.filter(
          (task) => progress[task] !== undefined
        );
        const moduleCompleted = moduleTasks.filter(
          (task) => progress[task] === true
        );

        totalTasks += moduleTasks.length;
        completedTasks += moduleCompleted.length;

        if (!stats.byModule[moduleNum]) {
          stats.byModule[moduleNum] = { total: 0, completed: 0 };
        }
        stats.byModule[moduleNum].total += moduleTasks.length;
        stats.byModule[moduleNum].completed += moduleCompleted.length;
      });

      stats.byStudent[student.id] = {
        percentage:
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        completed: completedTasks,
        total: totalTasks,
      };
    });

    // Calculate overall average
    const studentPercentages = Object.values(stats.byStudent).map(
      (s) => s.percentage
    );
    stats.overall =
      studentPercentages.length > 0
        ? Math.round(
            studentPercentages.reduce((a, b) => a + b, 0) /
              studentPercentages.length
          )
        : 0;

    return stats;
  }, [organizedData]);

  const exportToCSV = () => {
    if (!organizedData) return;

    // Prepare CSV data
    const csvRows = [];
    const headers = [
      "Student Name",
      "Username",
      "Overall Progress (%)",
      "Modules Completed",
    ];

    // Add module headers
    organizedData.visibleModules.forEach((module) => {
      headers.push(`Module ${module.module_rank}`);
    });

    csvRows.push(headers);

    organizedData.students.forEach((student) => {
      const studentStats = getCompletionStats.byStudent[student.id];
      const row = [
        `${student.student_first_name} ${student.student_last_name}`,
        student.student_username,
        studentStats?.percentage || 0,
        `${studentStats?.completed || 0}/${studentStats?.total || 0}`,
      ];

      // Add module percentages
      organizedData.visibleModules.forEach((module) => {
        const moduleProgress = student.progress[module.module_rank];
        if (!moduleProgress) {
          row.push(0);
        } else {
          // UPDATED: Removed 'introduction_video' from tasks array
          const tasks = [
            "getting_started",
            "mini_lecture",
            "workbook",
            "software",
            "quiz",
          ];
          const completed = tasks.filter(
            (t) => moduleProgress[t] === true
          ).length;
          const percentage = Math.round((completed / tasks.length) * 100);
          row.push(percentage);
        }
      });

      csvRows.push(row);
    });

    // Convert to CSV string
    const csvContent = csvRows.map((row) => row.join(",")).join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute(
      "download",
      `student_progress_${courseData?.course_name || "course"}_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    a.click();
  };

  const TaskIcon = ({ completed }) => {
    return completed ? (
      <Check className="text-green-500 inline" size={16} />
    ) : (
      <X className="text-gray-500 inline" size={16} />
    );
  };

  const ProgressBar = ({ percentage, size = "default" }) => {
    const height = size === "small" ? "h-2" : "h-4";
    const bgColor =
      percentage === 100
        ? "bg-green-500"
        : percentage > 50
        ? "bg-yellow-500"
        : "bg-red-500";

    return (
      <div
        className={`flex items-center gap-2 ${
          size === "small" ? "w-20" : "flex-1"
        }`}
      >
        <div className={`flex-1 bg-gray-700 rounded-full ${height}`}>
          <div
            className={`${height} rounded-full transition-all ${bgColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {size !== "small" && (
          <span className="text-sm text-gray-300 w-12 text-right">
            {percentage}%
          </span>
        )}
      </div>
    );
  };

  if (isLoading || !courseData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-xl">Loading Progress Data...</p>
        </div>
      </div>
    );
  }

  const stats = getCompletionStats;

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={sidebarOpen}
        setIsSidebarOpen={setSidebarOpen}
        courseData={courseData}
      />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Student Progress Tracking
              </h1>
              <p className="text-lg text-blue-300">{courseData?.course_name}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors"
                disabled={isRefreshing}
              >
                <RefreshCw
                  size={16}
                  className={isRefreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Total Students</p>
              <p className="text-2xl font-bold">
                {organizedData?.students.length || 0}
              </p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Average Progress</p>
              <p className="text-2xl font-bold">{stats.overall}%</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Active Modules</p>
              <p className="text-2xl font-bold">
                {organizedData?.visibleModules.length || 0}
              </p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Active Quizzes</p>
              <p className="text-2xl font-bold">
                {organizedData
                  ? Object.values(organizedData.quizzes).flat().length
                  : 0}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "overview"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <BookOpen className="inline mr-2" size={16} />
            Module Progress
          </button>
          <button
            onClick={() => setActiveTab("quizzes")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "quizzes"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <FileText className="inline mr-2" size={16} />
            Quiz Results
          </button>
          <button
            onClick={() => setActiveTab("detailed")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "detailed"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <Monitor className="inline mr-2" size={16} />
            Detailed View
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "overview" && organizedData && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Module Completion Overview
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="text-left py-3 px-4">Student</th>
                    <th className="py-3 px-4">Overall</th>
                    {organizedData.visibleModules.map((module) => (
                      <th key={module.id} className="py-3 px-4 text-center">
                        <div className="text-xs">
                          {module.name
                            .replace(/^(Pre-)?Module \d+:\s*/, "")
                            .substring(0, 15)}
                          {module.name.replace(/^(Pre-)?Module \d+:\s*/, "")
                            .length > 15
                            ? "..."
                            : ""}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {organizedData.students.map((student) => {
                    const studentStats = stats.byStudent[student.id];
                    return (
                      <tr
                        key={student.id}
                        className="border-b border-gray-700/50 hover:bg-gray-700/30"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">
                              {student.student_first_name}{" "}
                              {student.student_last_name}
                            </p>
                            <p className="text-xs text-gray-400">
                              @{student.student_username}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <ProgressBar
                            percentage={studentStats?.percentage || 0}
                            size="small"
                          />
                        </td>
                        {organizedData.visibleModules.map((module) => {
                          const moduleProgress =
                            student.progress[module.module_rank];
                          if (!moduleProgress) {
                            return (
                              <td
                                key={module.id}
                                className="py-3 px-4 text-center"
                              >
                                -
                              </td>
                            );
                          }

                          // UPDATED: Removed 'introduction_video' from tasks array
                          const tasks = [
                            "getting_started",
                            "mini_lecture",
                            "workbook",
                            "software",
                            "quiz",
                          ];
                          const completed = tasks.filter(
                            (t) => moduleProgress[t] === true
                          ).length;
                          const percentage = Math.round(
                            (completed / tasks.length) * 100
                          );

                          return (
                            <td key={module.id} className="py-3 px-4">
                              <div className="flex justify-center">
                                <div
                                  className={`text-sm font-medium px-2 py-1 rounded ${
                                    percentage === 100
                                      ? "bg-green-600/30 text-green-400"
                                      : percentage > 0
                                      ? "bg-yellow-600/30 text-yellow-400"
                                      : "bg-gray-600/30 text-gray-400"
                                  }`}
                                >
                                  {completed}/{tasks.length}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "quizzes" && organizedData && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quiz Performance</h2>

            {/* Quiz Type Sections */}
            <div className="space-y-6">
              {/* Module Quizzes */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-blue-300">
                  Module Quizzes
                </h3>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  {organizedData.quizzes.module.length > 0 ? (
                    <div className="space-y-3">
                      {organizedData.quizzes.module.map((quiz) => {
                        const isQuizExpanded =
                          expandedQuizzes[`quiz-${quiz.id}`];
                        // Get all grades for this quiz
                        const quizGrades = organizedData.allGrades.filter(
                          (g) => g.quiz_id === quiz.id
                        );

                        return (
                          <div
                            key={quiz.id}
                            className="bg-gray-800 rounded-lg overflow-hidden"
                          >
                            <div
                              className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-700/30"
                              onClick={() =>
                                setExpandedQuizzes((prev) => ({
                                  ...prev,
                                  [`quiz-${quiz.id}`]: !prev[`quiz-${quiz.id}`],
                                }))
                              }
                            >
                              <div className="flex items-center gap-3">
                                {isQuizExpanded ? (
                                  <ChevronDown size={16} />
                                ) : (
                                  <ChevronRight size={16} />
                                )}
                                <span className="font-medium">{quiz.name}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-400">
                                  {quizGrades.length} submission
                                  {quizGrades.length !== 1 ? "s" : ""}
                                </span>
                                <span className="text-sm text-gray-400">
                                  {quiz.attempts} attempts allowed
                                </span>
                              </div>
                            </div>

                            {isQuizExpanded && (
                              <div className="border-t border-gray-700 p-3">
                                {quizGrades.length > 0 ? (
                                  <div className="space-y-2">
                                    {organizedData.students.map((student) => {
                                      const studentGrades = quizGrades.filter(
                                        (g) => g.student_id === student.id
                                      );
                                      if (studentGrades.length === 0)
                                        return null;

                                      const isStudentExpanded =
                                        expandedQuizzes[
                                          `quiz-${quiz.id}-student-${student.id}`
                                        ];

                                      return (
                                        <div
                                          key={student.id}
                                          className="bg-gray-900/50 rounded p-2"
                                        >
                                          <div
                                            className="flex items-center justify-between cursor-pointer hover:bg-gray-700/30 p-1"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setExpandedQuizzes((v) => ({
                                                ...prev,
                                                [`quiz-${quiz.id}-student-${student.id}`]:
                                                  !prev[
                                                    `quiz-${quiz.id}-student-${student.id}`
                                                  ],
                                              }));
                                            }}
                                          >
                                            <div className="flex items-center gap-2">
                                              {isStudentExpanded ? (
                                                <ChevronDown size={14} />
                                              ) : (
                                                <ChevronRight size={14} />
                                              )}
                                              <span className="text-sm">
                                                {student.student_first_name}{" "}
                                                {student.student_last_name}
                                              </span>
                                            </div>
                                            <span className="text-sm text-gray-400">
                                              {studentGrades.length} attempt
                                              {studentGrades.length !== 1
                                                ? "s"
                                                : ""}
                                            </span>
                                          </div>

                                          {isStudentExpanded && (
                                            <div className="mt-2 ml-6 space-y-1">
                                              {studentGrades.map(
                                                (grade, idx) => {
                                                  const maxScore =
                                                    grade.submitted_answers
                                                      ?.maxScore ||
                                                    quiz.total_score ||
                                                    0;
                                                  const percentage =
                                                    maxScore > 0
                                                      ? Math.round(
                                                          (grade.score /
                                                            maxScore) *
                                                            100
                                                        )
                                                      : 0;

                                                  return (
                                                    <div
                                                      key={grade.id}
                                                      className="flex items-center gap-4 text-xs bg-gray-800 rounded p-2"
                                                    >
                                                      <span className="text-gray-400">
                                                        Attempt #{idx + 1}
                                                      </span>
                                                      <div className="flex items-center gap-2">
                                                        <Award
                                                          size={12}
                                                          className="text-yellow-500"
                                                        />
                                                        <span
                                                          className={`font-medium ${
                                                            percentage >= 80
                                                              ? "text-green-400"
                                                              : percentage >= 60
                                                              ? "text-yellow-400"
                                                              : "text-red-400"
                                                          }`}
                                                        >
                                                          {grade.score}/
                                                          {maxScore} (
                                                          {percentage}%)
                                                        </span>
                                                      </div>
                                                      <div className="flex items-center gap-2">
                                                        <Clock
                                                          size={12}
                                                          className="text-gray-500"
                                                        />
                                                        <span className="text-gray-400">
                                                          {formatTime(
                                                            grade.time_taken
                                                          )}
                                                        </span>
                                                      </div>
                                                      <span className="text-gray-400">
                                                        {new Date(
                                                          grade.time_submitted
                                                        ).toLocaleDateString(
                                                          "en-US",
                                                          {
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                          }
                                                        )}
                                                      </span>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    No submissions yet
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">No module quizzes available</p>
                  )}
                </div>
              </div>

              {/* Surveys */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-green-300">
                  Surveys
                </h3>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  {organizedData.quizzes.survey.length > 0 ? (
                    <div className="space-y-3">
                      {organizedData.quizzes.survey.map((quiz) => {
                        const isQuizExpanded =
                          expandedQuizzes[`quiz-${quiz.id}`];
                        const quizGrades = organizedData.allGrades.filter(
                          (g) => g.quiz_id === quiz.id
                        );

                        return (
                          <div
                            key={quiz.id}
                            className="bg-gray-800 rounded-lg overflow-hidden"
                          >
                            <div
                              className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-700/30"
                              onClick={() =>
                                setExpandedQuizzes((prev) => ({
                                  ...prev,
                                  [`quiz-${quiz.id}`]: !prev[`quiz-${quiz.id}`],
                                }))
                              }
                            >
                              <div className="flex items-center gap-3">
                                {isQuizExpanded ? (
                                  <ChevronDown size={16} />
                                ) : (
                                  <ChevronRight size={16} />
                                )}
                                <span className="font-medium">{quiz.name}</span>
                              </div>
                              <span className="text-sm text-gray-400">
                                {quizGrades.length} response
                                {quizGrades.length !== 1 ? "s" : ""}
                              </span>
                            </div>

                            {isQuizExpanded && (
                              <div className="border-t border-gray-700 p-3">
                                {quizGrades.length > 0 ? (
                                  <div className="space-y-2">
                                    {organizedData.students.map((student) => {
                                      const studentGrades = quizGrades.filter(
                                        (g) => g.student_id === student.id
                                      );
                                      if (studentGrades.length === 0)
                                        return null;

                                      return (
                                        <div
                                          key={student.id}
                                          className="bg-gray-900/50 rounded p-2"
                                        >
                                          <div className="flex items-center justify-between p-1">
                                            <span className="text-sm">
                                              {student.student_first_name}{" "}
                                              {student.student_last_name}
                                            </span>
                                            <span className="text-sm text-gray-400">
                                              Submitted:{" "}
                                              {new Date(
                                                studentGrades[0].time_submitted
                                              ).toLocaleDateString()}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    No responses yet
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">No surveys available</p>
                  )}
                </div>
              </div>

              {/* Pre/Post Tests */}
              <div>
                <h3 className="text-lg font-medium mb-3 text-purple-300">
                  Pre/Post Tests
                </h3>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  {organizedData.quizzes.pre_post_test.length > 0 ? (
                    <div className="space-y-3">
                      {organizedData.quizzes.pre_post_test.map((quiz) => {
                        const isQuizExpanded =
                          expandedQuizzes[`quiz-${quiz.id}`];
                        const quizGrades = organizedData.allGrades.filter(
                          (g) => g.quiz_id === quiz.id
                        );

                        return (
                          <div
                            key={quiz.id}
                            className="bg-gray-800 rounded-lg overflow-hidden"
                          >
                            <div
                              className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-700/30"
                              onClick={() =>
                                setExpandedQuizzes((prev) => ({
                                  ...prev,
                                  [`quiz-${quiz.id}`]: !prev[`quiz-${quiz.id}`],
                                }))
                              }
                            >
                              <div className="flex items-center gap-3">
                                {isQuizExpanded ? (
                                  <ChevronDown size={16} />
                                ) : (
                                  <ChevronRight size={16} />
                                )}
                                <span className="font-medium">{quiz.name}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-400">
                                  Max Score: {quiz.total_score || "N/A"}
                                </span>
                                <span className="text-sm text-gray-400">
                                  {quizGrades.length} submission
                                  {quizGrades.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>

                            {isQuizExpanded && (
                              <div className="border-t border-gray-700 p-3">
                                {quizGrades.length > 0 ? (
                                  <div className="space-y-2">
                                    {organizedData.students.map((student) => {
                                      const studentGrades = quizGrades.filter(
                                        (g) => g.student_id === student.id
                                      );
                                      if (studentGrades.length === 0)
                                        return null;

                                      const isStudentExpanded =
                                        expandedQuizzes[
                                          `quiz-${quiz.id}-student-${student.id}`
                                        ];

                                      return (
                                        <div
                                          key={student.id}
                                          className="bg-gray-900/50 rounded p-2"
                                        >
                                          <div
                                            className="flex items-center justify-between cursor-pointer hover:bg-gray-700/30 p-1"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setExpandedQuizzes((prev) => ({
                                                ...prev,
                                                [`quiz-${quiz.id}-student-${student.id}`]:
                                                  !prev[
                                                    `quiz-${quiz.id}-student-${student.id}`
                                                  ],
                                              }));
                                            }}
                                          >
                                            <div className="flex items-center gap-2">
                                              {isStudentExpanded ? (
                                                <ChevronDown size={14} />
                                              ) : (
                                                <ChevronRight size={14} />
                                              )}
                                              <span className="text-sm">
                                                {student.student_first_name}{" "}
                                                {student.student_last_name}
                                              </span>
                                            </div>
                                            <span className="text-sm text-gray-400">
                                              {studentGrades.length} attempt
                                              {studentGrades.length !== 1
                                                ? "s"
                                                : ""}
                                            </span>
                                          </div>

                                          {isStudentExpanded && (
                                            <div className="mt-2 ml-6 space-y-1">
                                              {studentGrades.map(
                                                (grade, idx) => {
                                                  const maxScore =
                                                    quiz.total_score ||
                                                    grade.submitted_answers
                                                      ?.maxScore ||
                                                    0;
                                                  const percentage =
                                                    maxScore > 0
                                                      ? Math.round(
                                                          (grade.score /
                                                            maxScore) *
                                                            100
                                                        )
                                                      : 0;

                                                  return (
                                                    <div
                                                      key={grade.id}
                                                      className="flex items-center gap-4 text-xs bg-gray-800 rounded p-2"
                                                    >
                                                      <span className="text-gray-400">
                                                        Attempt #{idx + 1}
                                                      </span>
                                                      <div className="flex items-center gap-2">
                                                        <Award
                                                          size={12}
                                                          className="text-yellow-500"
                                                        />
                                                        <span
                                                          className={`font-medium ${
                                                            percentage >= 80
                                                              ? "text-green-400"
                                                              : percentage >= 60
                                                              ? "text-yellow-400"
                                                              : "text-red-400"
                                                          }`}
                                                        >
                                                          {grade.score}/
                                                          {maxScore} (
                                                          {percentage}%)
                                                        </span>
                                                      </div>
                                                      <span className="text-gray-400">
                                                        {new Date(
                                                          grade.time_submitted
                                                        ).toLocaleDateString(
                                                          "en-US",
                                                          {
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                          }
                                                        )}
                                                      </span>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    No submissions yet
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">No pre/post tests available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "detailed" && organizedData && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Detailed Student Progress
            </h2>
            <div className="space-y-4">
              {organizedData.students.map((student) => {
                const studentStats = stats.byStudent[student.id];
                const isExpanded = expandedRows[student.id];

                return (
                  <div
                    key={student.id}
                    className="bg-gray-900/50 rounded-lg overflow-hidden"
                  >
                    {/* Student Header */}
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-700/30"
                      onClick={() =>
                        setExpandedRows((prev) => ({
                          ...prev,
                          [student.id]: !prev[student.id],
                        }))
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div className="transition-transform duration-200">
                          {isExpanded ? (
                            <ChevronDown size={20} />
                          ) : (
                            <ChevronRight size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-lg">
                            {student.student_first_name}{" "}
                            {student.student_last_name}
                          </p>
                          <p className="text-sm text-gray-400">
                            @{student.student_username}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <ProgressBar
                          percentage={studentStats?.percentage || 0}
                        />
                        <div className="text-right">
                          <p className="text-sm text-gray-400">
                            Tasks Completed
                          </p>
                          <p className="font-medium">
                            {studentStats?.completed || 0} /{" "}
                            {studentStats?.total || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content - UPDATED: Removed Intro column */}
                    {isExpanded && (
                      <div className="p-4 pt-0">
                        <div className="bg-gray-800 rounded-lg p-4">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-2">Module</th>
                                <th className="py-2 text-center">
                                  Getting Started
                                </th>
                                <th className="py-2 text-center">
                                  Mini Lecture
                                </th>
                                <th className="py-2 text-center">Workbook</th>
                                <th className="py-2 text-center">Software</th>
                                <th className="py-2 text-center">Quiz</th>
                              </tr>
                            </thead>
                            <tbody>
                              {organizedData.visibleModules.map((module) => {
                                const progress =
                                  student.progress[module.module_rank];
                                if (!progress) return null;

                                return (
                                  <tr
                                    key={module.id}
                                    className="border-b border-gray-700/30"
                                  >
                                    <td className="py-2 font-medium">
                                      {module.name.replace(
                                        /^(Pre-)?Module \d+:\s*/,
                                        ""
                                      )}
                                    </td>
                                    <td className="py-2 text-center">
                                      <TaskIcon
                                        completed={progress.getting_started}
                                      />
                                    </td>
                                    <td className="py-2 text-center">
                                      <TaskIcon
                                        completed={progress.mini_lecture}
                                      />
                                    </td>
                                    <td className="py-2 text-center">
                                      <TaskIcon completed={progress.workbook} />
                                    </td>
                                    <td className="py-2 text-center">
                                      <TaskIcon completed={progress.software} />
                                    </td>
                                    <td className="py-2 text-center">
                                      <TaskIcon completed={progress.quiz} />
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
