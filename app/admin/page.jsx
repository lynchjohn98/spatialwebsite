// Main Admin Dashboard Component
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  ChevronDown, ChevronUp, Search, Filter, Download, LogOut, Users, 
  BookOpen, TrendingUp, X, RefreshCw, User
} from 'lucide-react';

// Import sub-components (these would be in separate files)
import { AdminLogin } from './components/AdminLogin';
import { AdminHeader } from './components/AdminHeader';
import { StatsCards } from './components/StatsCards';
import { FilterBar } from './components/FilterBar';
import { TeacherOverviewTable } from './components/TeacherOverviewTable';
import { DetailedProgressView } from './components/DetailedProgressView';
import { AnalyticsView } from './components/AnalyticsView';

// Constants
export const MODULE_ORDER = [
  "Introduction to Spatial Visualization",
  "Combining Solids",
  "Surfaces and Solids of Revolution",
  "Coordinate Systems",
  "Orthographic Projection",
  "Inclined and Curved Surfaces",
  "Flat Patterns",
  "Rotation of Objects About a Single Axis",
  "Rotation of Objects About Two or More Axes",
  "Reflection and Symmetry",
  "Cross-Sections of Solids"
];

export const QUIZ_MODULE_MAPPING = {
  1: "PSVT:R Pre-Test",
  2: "DAT:SR Pre-Test",
  3: "Math Instrument Pre-Test",
  4: "Combining Solids",
  5: "Surfaces and Solids of Revolution",
  6: "Isometric Drawings and Coded Plans",
  7: "Flat Patterns",
  8: "Rotation of Objects About a Single Axis",
  9: "Reflections and Symmetry",
  10: "Cutting Planes and Cross-Sections",
  11: "Rotation of Objects About Two or More Axes",
  12: "Orthographic Projection",
  13: "Inclined and Curved Surfaces",
  14: "PSVT:R Post-Test",
  15: "DAT:SR Post-Test",
  16: "Math Instrument Post-Test"
};

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [dataError, setDataError] = useState("");
  const router = useRouter();
  
  // Dashboard states
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teacherProgress, setTeacherProgress] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // View modes
  const [viewMode, setViewMode] = useState('overview');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    county: "",
    researchConsent: "",
    trainingComplete: "",
    pretestComplete: "",
    posttestComplete: "",
    progressRange: "",
    moduleCompletion: "",
    researchType: "",
    language: "",
    hasStudents: "",
    hasCourses: ""
  });
  
  const [filterOptions, setFilterOptions] = useState({
    counties: [],
    researchTypes: [],
    languages: [],
    progressRanges: [
      { value: "0-25", label: "0-25%" },
      { value: "26-50", label: "26-50%" },
      { value: "51-75", label: "51-75%" },
      { value: "76-99", label: "76-99%" },
      { value: "100", label: "100%" }
    ]
  });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  
  const supabase = createClientComponentClient();

  // Auto-refresh functionality - disabled by default to prevent unwanted refreshes
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60000); // 60 seconds default
  
  useEffect(() => {
    let intervalId;
    
    if (isAuthorized && autoRefreshEnabled) {
      intervalId = setInterval(() => {
        handleRefresh();
      }, refreshInterval);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAuthorized, autoRefreshEnabled, refreshInterval]);

  useEffect(() => {
    const adminAuth = sessionStorage.getItem("adminAuthorized");
    if (adminAuth === "true") {
      setIsAuthorized(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchAllData();
    }
  }, [isAuthorized]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllData();
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const fetchAllData = async () => {
    setIsLoadingData(true);
    setDataError("");
    
    try {
      // Fetch all data from database
      const [teachersResult, progressResult, quizResult, coursesResult, settingsResult, studentsResult, studentProgressResult] = await Promise.all([
        supabase.from('teachers').select('*').order('created_at', { ascending: false }),
        supabase.from('teachers_progress').select('*'),
        supabase.from('teachers_grades').select('*').order('time_submitted', { ascending: false }),
        supabase.from('courses').select('*').order('created_at', { ascending: false }),
        supabase.from('courses_settings').select('*'),
        supabase.from('students').select('*'),
        supabase.from('students_progress').select('*')
      ]);

      if (teachersResult.error) throw teachersResult.error;
      if (progressResult.error) throw progressResult.error;
      if (coursesResult.error) throw coursesResult.error;
      
      const teachersData = teachersResult.data || [];
      const progressData = progressResult.data || [];
      const quizData = quizResult.data || [];
      const coursesData = coursesResult.data || [];
      const studentsData = studentsResult.data || [];
      const studentProgressData = studentProgressResult.data || [];
      
      // Process teacher data
      const processedTeachers = teachersData.map(teacher => {
        const progress = progressData?.find(p => p.teacher_id === teacher.id);
        const teacherCourses = coursesData?.filter(c => c.course_teacher_id === teacher.id) || [];
        const teacherQuizAttempts = quizData?.filter(q => q.teacher_id === teacher.id) || [];
        
        // Get students in teacher's courses
        const teacherStudents = studentsData?.filter(student => 
          teacherCourses.some(course => course.id === student.course_id)
        ) || [];
        
        const activeStudents = teacherStudents.filter(student => {
          const studentProgress = studentProgressData?.find(sp => sp.student_id === student.id);
          return studentProgress && studentProgress.module_progress;
        }).length;
        
        // Calculate module progress
        const moduleData = processModuleProgress(progress?.module_progress);
        
        // Calculate quiz metrics
        const quizMetrics = calculateQuizMetrics(teacherQuizAttempts);
        
        // Calculate overall progress
        const overallTrainingProgress = calculateOverallProgress(teacher);
        
        return {
          ...teacher,
          progress: progress || {},
          ...moduleData,
          courses: teacherCourses,
          coursesCount: teacherCourses.length,
          totalStudents: teacherStudents.length,
          activeStudents,
          quizAttempts: teacherQuizAttempts,
          quizMetrics,
          overallTrainingProgress,
          lastActivity: calculateLastActivity(progress, teacherQuizAttempts)
        };
      });
      
      setTeachers(processedTeachers);
      setTeacherProgress(progressData);
      setCourses(coursesData);
      setQuizAttempts(quizData);
      
      // Extract filter options
      const counties = [...new Set(coursesData?.map(c => c.course_county).filter(Boolean))].sort();
      const researchTypes = [...new Set(coursesData?.map(c => c.course_research_type).filter(Boolean))].sort();
      const languages = [...new Set(coursesData?.map(c => c.course_language).filter(Boolean))].sort();
      
      setFilterOptions(prev => ({ 
        ...prev, 
        counties,
        researchTypes,
        languages
      }));
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setDataError("Failed to load data. Please try again.");
    } finally {
      setIsLoadingData(false);
    }
  };

  // Helper functions
  const processModuleProgress = (moduleProgress) => {
    let moduleProgressDetails = {};
    let completedModules = 0;
    let totalModules = 0;
    let moduleProgressPercentage = 0;
    
    if (moduleProgress) {
      const moduleData = typeof moduleProgress === 'string' 
        ? JSON.parse(moduleProgress) 
        : moduleProgress;
      
      Object.entries(moduleData).forEach(([moduleName, moduleInfo]) => {
        const components = ['quiz', 'software', 'workbook', 'mini_lecture', 'getting_started', 'introduction_video'];
        const completedComponents = components.filter(comp => moduleInfo[comp] === true).length;
        const modulePercentage = Math.round((completedComponents / components.length) * 100);
        
        moduleProgressDetails[moduleName] = {
          ...moduleInfo,
          percentage: modulePercentage,
          componentsComplete: completedComponents,
          totalComponents: components.length,
          isComplete: modulePercentage === 100 || moduleInfo.completed_at !== null
        };
        
        totalModules++;
        if (moduleProgressDetails[moduleName].isComplete) {
          completedModules++;
        }
        moduleProgressPercentage += modulePercentage;
      });
      
      if (totalModules > 0) {
        moduleProgressPercentage = Math.round(moduleProgressPercentage / totalModules);
      }
    }
    
    return {
      moduleProgressDetails,
      completedModules,
      totalModules,
      moduleProgressPercentage
    };
  };

  const calculateQuizMetrics = (attempts) => {
    if (!attempts || attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        completedQuizzes: 0,
        uniqueQuizzes: 0
      };
    }
    
    const uniqueQuizzes = [...new Set(attempts.map(a => a.quiz_id))];
    const scores = attempts.map(a => a.score || 0);
    
    return {
      totalAttempts: attempts.length,
      averageScore: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
      bestScore: Math.max(...scores),
      completedQuizzes: uniqueQuizzes.length,
      uniqueQuizzes: uniqueQuizzes
    };
  };

  const calculateOverallProgress = (teacher) => {
    const trainingComponents = [
      teacher.pretest_complete,
      teacher.training_complete,
      teacher.posttest_complete,
      teacher.research_consent
    ];
    const completedComponents = trainingComponents.filter(Boolean).length;
    return Math.round((completedComponents / trainingComponents.length) * 100);
  };

  const calculateLastActivity = (progress, quizAttempts) => {
    const dates = [];
    
    if (progress?.updated_at) {
      dates.push(new Date(progress.updated_at));
    }
    
    if (quizAttempts && quizAttempts.length > 0) {
      const lastQuiz = quizAttempts[0];
      if (lastQuiz.time_submitted) {
        dates.push(new Date(lastQuiz.time_submitted));
      }
    }
    
    return dates.length === 0 ? null : new Date(Math.max(...dates));
  };

  // Filter logic
  const filteredTeachers = useMemo(() => {
    let filtered = [...teachers];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(teacher => 
        teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply all filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "") {
        switch(key) {
          case 'county':
            filtered = filtered.filter(t => t.courses.some(c => c.course_county === value));
            break;
          case 'researchType':
            filtered = filtered.filter(t => t.courses.some(c => c.course_research_type === value));
            break;
          case 'language':
            filtered = filtered.filter(t => t.courses.some(c => c.course_language === value));
            break;
          case 'researchConsent':
            filtered = filtered.filter(t => t.research_consent === (value === "true"));
            break;
          case 'trainingComplete':
            filtered = filtered.filter(t => t.training_complete === (value === "true"));
            break;
          case 'pretestComplete':
            filtered = filtered.filter(t => t.pretest_complete === (value === "true"));
            break;
          case 'posttestComplete':
            filtered = filtered.filter(t => t.posttest_complete === (value === "true"));
            break;
          case 'progressRange':
            const [min, max] = value.split('-').map(Number);
            filtered = filtered.filter(t => {
              const progress = t.moduleProgressPercentage;
              return max ? (progress >= min && progress <= max) : (progress === min);
            });
            break;
          case 'moduleCompletion':
            const targetModules = parseInt(value);
            filtered = filtered.filter(t => t.completedModules >= targetModules);
            break;
          case 'hasStudents':
            filtered = filtered.filter(t => value === "true" ? t.totalStudents > 0 : t.totalStudents === 0);
            break;
          case 'hasCourses':
            filtered = filtered.filter(t => value === "true" ? t.coursesCount > 0 : t.coursesCount === 0);
            break;
        }
      }
    });
    
    return filtered;
  }, [teachers, searchTerm, filters]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const downloadCSV = () => {
    const headers = [
      'Teacher Name', 'Username', 'Email', 'Overall Progress %', 
      'Module Progress %', 'Modules Completed', 'Total Modules',
      'Courses Count', 'Total Students', 'Active Students',
      'Research Consent', 'Pretest Complete', 'Training Complete',
      'Posttest Complete', 'Quiz Attempts', 'Average Quiz Score',
      'Best Quiz Score', 'Last Activity'
    ];
    
    const rows = filteredTeachers.map(teacher => [
      teacher.name || '',
      teacher.username || '',
      teacher.email || '',
      teacher.overallTrainingProgress || 0,
      teacher.moduleProgressPercentage || 0,
      teacher.completedModules || 0,
      teacher.totalModules || 0,
      teacher.coursesCount || 0,
      teacher.totalStudents || 0,
      teacher.activeStudents || 0,
      teacher.research_consent ? 'Yes' : 'No',
      teacher.pretest_complete ? 'Yes' : 'No',
      teacher.training_complete ? 'Yes' : 'No',
      teacher.posttest_complete ? 'Yes' : 'No',
      teacher.quizMetrics?.totalAttempts || 0,
      teacher.quizMetrics?.averageScore || 0,
      teacher.quizMetrics?.bestScore || 0,
      teacher.lastActivity ? new Date(teacher.lastActivity).toLocaleDateString() : 'N/A'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        const value = String(cell);
        return value.includes(',') || value.includes('"') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `teacher_progress_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Calculate aggregate statistics
  const aggregateStats = {
    totalTeachers: teachers.length,
    totalCourses: courses.length,
    averageProgress: teachers.length > 0 
      ? Math.round(teachers.reduce((acc, t) => acc + t.moduleProgressPercentage, 0) / teachers.length)
      : 0,
    completedTraining: teachers.filter(t => t.training_complete).length,
    activeTeachers: teachers.filter(t => t.lastActivity && 
      (new Date() - new Date(t.lastActivity)) / (1000 * 60 * 60 * 24) < 7
    ).length,
    totalQuizAttempts: quizAttempts.length,
    teachersWithCourses: teachers.filter(t => t.coursesCount > 0).length,
    teachersWithoutCourses: teachers.filter(t => t.coursesCount === 0).length
  };

  // If not authorized, show login
  if (!isAuthorized) {
    return <AdminLogin onAuthorized={() => setIsAuthorized(true)} />;
  }

  // Loading state
  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading comprehensive data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader 
        lastRefresh={lastRefresh}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        autoRefreshEnabled={autoRefreshEnabled}
        onToggleAutoRefresh={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
        refreshInterval={refreshInterval}
        onChangeRefreshInterval={setRefreshInterval}
        onLogout={() => {
          sessionStorage.removeItem("adminAuthorized");
          setIsAuthorized(false);
        }}
      />

      <div className="max-w-full px-6 py-6">
        <StatsCards stats={aggregateStats} />

        {/* View Mode Tabs */}
        <div className="bg-gray-800 p-1 rounded-lg inline-flex mb-6">
          {['overview', 'detailed', 'analytics'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === mode 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={(name, value) => {
            setFilters(prev => ({ ...prev, [name]: value }));
            setCurrentPage(1);
          }}
          filterOptions={filterOptions}
          onDownload={downloadCSV}
          onReset={() => {
            setFilters({
              county: "",
              researchConsent: "",
              trainingComplete: "",
              pretestComplete: "",
              posttestComplete: "",
              progressRange: "",
              moduleCompletion: "",
              researchType: "",
              language: "",
              hasStudents: ""
            });
            setSearchTerm("");
            setCurrentPage(1);
          }}
        />

        {/* Main Content Area */}
        {viewMode === 'overview' && (
          <TeacherOverviewTable 
            teachers={currentItems}
            router={router}
          />
        )}
        
        {viewMode === 'detailed' && (
          <DetailedProgressView 
            teachers={currentItems}
          />
        )}
        
        {viewMode === 'analytics' && (
          <AnalyticsView 
            teachers={filteredTeachers}
            courses={courses}
            quizAttempts={quizAttempts}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTeachers.length)} of {filteredTeachers.length} teachers
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 text-white disabled:bg-gray-700 disabled:text-gray-500"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 text-white disabled:bg-gray-700 disabled:text-gray-500"
              >
                Previous
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNumber 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-600 hover:bg-gray-500 text-white'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 text-white disabled:bg-gray-700 disabled:text-gray-500"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 text-white disabled:bg-gray-700 disabled:text-gray-500"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
      
      {dataError && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg">
          {dataError}
        </div>
      )}
    </div>
  );
}