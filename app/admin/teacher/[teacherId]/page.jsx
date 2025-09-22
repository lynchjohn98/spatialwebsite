// app/admin/teacher/[teacherId]/page.jsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  ArrowLeft, Download, Search, Filter, RefreshCw, 
  Award, Clock, Target, TrendingUp, Calendar, 
  CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp,
  FileText, BookOpen
} from 'lucide-react';

// Quiz name mapping
const QUIZ_NAMES = {
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
  16: "Math Instrument Post-Test",
  17: "Practice Quiz",
  18: "Mathematics Motivation Survey",
  19: "STEM Attitudes Survey",
  20: "STEM Career Survey"
};

// Quiz categories
const QUIZ_CATEGORIES = {
  'pre-tests': [1, 2, 3],
  'module-quizzes': [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17],
  'post-tests': [14, 15, 16],
  'surveys': [18, 19, 20]
};

export default function TeacherQuizDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.teacherId;
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [expandedQuizzes, setExpandedQuizzes] = useState({});
  const [viewMode, setViewMode] = useState('categories'); // 'categories' or 'timeline'
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    const adminAuth = sessionStorage.getItem("adminAuthorized");
    if (adminAuth !== "true") {
      router.push("/admin");
    } else {
      setIsAuthorized(true);
      fetchTeacherData();
    }
  }, [teacherId]);

  const fetchTeacherData = async () => {
    setIsLoading(true);
    try {
      // Fetch teacher information
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', teacherId)
        .single();

      if (teacherError) throw teacherError;
      setTeacher(teacherData);

      // Fetch all quiz attempts for this teacher
      const { data: attemptsData, error: attemptsError } = await supabase
        .from('teachers_grades')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('time_submitted', { ascending: false });

      if (attemptsError) throw attemptsError;
      
      // Process quiz attempts with proper quiz names
      const processedAttempts = attemptsData.map(attempt => ({
        ...attempt,
        quiz_name: QUIZ_NAMES[attempt.quiz_id] || `Quiz ${attempt.quiz_id}`,
        passed: attempt.score >= 80,
        duration: calculateDuration(attempt.time_started, attempt.time_submitted),
        formattedDate: formatDate(attempt.time_submitted),
        formattedTime: formatTime(attempt.time_submitted)
      }));
      
      setQuizAttempts(processedAttempts);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const calculateDuration = (start, end) => {
    if (!start && !end) return 'N/A';
    // If we only have end time, try to use time_taken field
    const startTime = start ? new Date(start) : null;
    const endTime = end ? new Date(end) : null;
    
    if (startTime && endTime) {
      const diffMs = endTime - startTime;
      const diffMins = Math.round(diffMs / 60000);
      
      if (diffMins < 60) {
        return `${diffMins} min`;
      } else {
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        return `${hours}h ${mins}m`;
      }
    }
    return 'N/A';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeTaken = (seconds) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getQuizCategory = (quizId) => {
    const id = parseInt(quizId);
    if (QUIZ_CATEGORIES['pre-tests'].includes(id)) return 'pre-tests';
    if (QUIZ_CATEGORIES['module-quizzes'].includes(id)) return 'module-quizzes';
    if (QUIZ_CATEGORIES['post-tests'].includes(id)) return 'post-tests';
    if (QUIZ_CATEGORIES['surveys'].includes(id)) return 'surveys';
    return 'other';
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'pre-tests': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'module-quizzes': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'post-tests': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'surveys': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  // Group attempts by quiz
  const groupedAttempts = useMemo(() => {
    const groups = {};
    quizAttempts.forEach(attempt => {
      const quizName = attempt.quiz_name;
      const quizId = attempt.quiz_id;
      
      if (!groups[quizId]) {
        groups[quizId] = {
          quizName: quizName,
          quizId: quizId,
          category: getQuizCategory(quizId),
          attempts: [],
          bestScore: 0,
          averageScore: 0,
          totalAttempts: 0,
          passRate: 0,
          lastAttempt: null
        };
      }
      groups[quizId].attempts.push(attempt);
    });

    // Calculate statistics for each quiz
    Object.keys(groups).forEach(quizId => {
      const quizData = groups[quizId];
      const scores = quizData.attempts.map(a => a.score || 0);
      
      quizData.totalAttempts = quizData.attempts.length;
      quizData.bestScore = Math.max(...scores);
      quizData.averageScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
      quizData.passRate = Math.round((quizData.attempts.filter(a => a.passed).length / quizData.attempts.length) * 100);
      quizData.lastAttempt = quizData.attempts[0]; // Already sorted by date desc
    });

    return groups;
  }, [quizAttempts]);

  // Filter attempts by category
  const filteredQuizzes = useMemo(() => {
    if (selectedCategory === 'all') {
      return groupedAttempts;
    }
    
    const filtered = {};
    Object.entries(groupedAttempts).forEach(([quizId, data]) => {
      if (data.category === selectedCategory) {
        filtered[quizId] = data;
      }
    });
    return filtered;
  }, [groupedAttempts, selectedCategory]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    if (quizAttempts.length === 0) {
      return {
        totalAttempts: 0,
        uniqueQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        passRate: 0,
        categoryCounts: {
          'pre-tests': 0,
          'module-quizzes': 0,
          'post-tests': 0,
          'surveys': 0
        }
      };
    }

    const uniqueQuizzes = new Set(quizAttempts.map(a => a.quiz_id)).size;
    const scores = quizAttempts.map(a => a.score || 0);
    const passedAttempts = quizAttempts.filter(a => a.passed).length;

    // Count attempts by category
    const categoryCounts = {
      'pre-tests': 0,
      'module-quizzes': 0,
      'post-tests': 0,
      'surveys': 0
    };

    Object.values(groupedAttempts).forEach(quiz => {
      if (categoryCounts[quiz.category] !== undefined) {
        categoryCounts[quiz.category]++;
      }
    });

    return {
      totalAttempts: quizAttempts.length,
      uniqueQuizzes,
      averageScore: Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length),
      bestScore: Math.max(...scores),
      passRate: Math.round((passedAttempts / quizAttempts.length) * 100),
      categoryCounts
    };
  }, [quizAttempts, groupedAttempts]);

  const toggleQuizExpansion = (quizId) => {
    setExpandedQuizzes(prev => ({
      ...prev,
      [quizId]: !prev[quizId]
    }));
  };

  const downloadCSV = () => {
    const headers = [
      'Quiz Name', 'Quiz ID', 'Category', 'Score', 'Passed', 'Date', 'Time',
      'Duration', 'Time Started', 'Time Submitted', 'Attempt Number'
    ];
    
    const rows = quizAttempts.map(attempt => [
      attempt.quiz_name || '',
      attempt.quiz_id || '',
      getQuizCategory(attempt.quiz_id),
      attempt.score || 0,
      attempt.passed ? 'Yes' : 'No',
      attempt.formattedDate,
      attempt.formattedTime,
      attempt.duration,
      attempt.time_started || '',
      attempt.time_submitted || '',
      attempt.attempt_number || 1
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
    link.download = `${teacher?.name || 'teacher'}_quiz_attempts_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (!isAuthorized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading quiz data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-2xl font-bold">Teacher Quiz Performance</h1>
              <p className="text-gray-400">
                {teacher?.name || 'Unknown Teacher'} ({teacher?.email})
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Download size={18} />
              Export CSV
            </button>
            <button
              onClick={fetchTeacherData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Target size={18} />
              <span className="text-sm">Total Attempts</span>
            </div>
            <div className="text-2xl font-bold">{overallStats.totalAttempts}</div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <BookOpen size={18} />
              <span className="text-sm">Unique Quizzes</span>
            </div>
            <div className="text-2xl font-bold">{overallStats.uniqueQuizzes}</div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <TrendingUp size={18} />
              <span className="text-sm">Average Score</span>
            </div>
            <div className="text-2xl font-bold">{overallStats.averageScore}%</div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Award size={18} />
              <span className="text-sm">Best Score</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{overallStats.bestScore}%</div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <CheckCircle size={18} />
              <span className="text-sm">Pass Rate</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">{overallStats.passRate}%</div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Calendar size={18} />
              <span className="text-sm">Last Attempt</span>
            </div>
            <div className="text-sm font-medium">
              {quizAttempts.length > 0 ? quizAttempts[0].formattedDate : 'N/A'}
            </div>
          </div>
        </div>

        {/* Category Progress Overview */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Progress by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-400 font-medium">Pre-Tests</span>
                <span className="text-2xl font-bold text-yellow-400">
                  {overallStats.categoryCounts['pre-tests']}/3
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${(overallStats.categoryCounts['pre-tests'] / 3) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-blue-400/10 border border-blue-400/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400 font-medium">Module Quizzes</span>
                <span className="text-2xl font-bold text-blue-400">
                  {overallStats.categoryCounts['module-quizzes']}/11
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full"
                  style={{ width: `${(overallStats.categoryCounts['module-quizzes'] / 11) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-medium">Post-Tests</span>
                <span className="text-2xl font-bold text-green-400">
                  {overallStats.categoryCounts['post-tests']}/3
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full"
                  style={{ width: `${(overallStats.categoryCounts['post-tests'] / 3) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-purple-400/10 border border-purple-400/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-400 font-medium">Surveys</span>
                <span className="text-2xl font-bold text-purple-400">
                  {overallStats.categoryCounts['surveys']}/3
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-400 h-2 rounded-full"
                  style={{ width: `${(overallStats.categoryCounts['surveys'] / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              All Quizzes ({Object.keys(groupedAttempts).length})
            </button>
            <button
              onClick={() => setSelectedCategory('pre-tests')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === 'pre-tests'
                  ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-400/30'
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              Pre-Tests ({overallStats.categoryCounts['pre-tests']})
            </button>
            <button
              onClick={() => setSelectedCategory('module-quizzes')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === 'module-quizzes'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-400/30'
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              Module Quizzes ({overallStats.categoryCounts['module-quizzes']})
            </button>
            <button
              onClick={() => setSelectedCategory('post-tests')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === 'post-tests'
                  ? 'bg-green-600/20 text-green-400 border border-green-400/30'
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              Post-Tests ({overallStats.categoryCounts['post-tests']})
            </button>
            <button
              onClick={() => setSelectedCategory('surveys')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === 'surveys'
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-400/30'
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              Surveys ({overallStats.categoryCounts['surveys']})
            </button>
          </div>
        </div>

        {/* Quiz Attempts by Category */}
        <div className="space-y-4">
          {Object.keys(filteredQuizzes).length === 0 ? (
            <div className="bg-gray-800 p-8 rounded-lg text-center">
              <AlertCircle size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No quiz attempts found for this category.</p>
            </div>
          ) : (
            Object.entries(filteredQuizzes).map(([quizId, quizData]) => {
              const isExpanded = expandedQuizzes[quizId];
              const categoryColor = getCategoryColor(quizData.category);
              
              return (
                <div 
                  key={quizId} 
                  className={`bg-gray-800 rounded-lg border ${
                    quizData.category === 'pre-tests' ? 'border-yellow-400/30' :
                    quizData.category === 'module-quizzes' ? 'border-blue-400/30' :
                    quizData.category === 'post-tests' ? 'border-green-400/30' :
                    quizData.category === 'surveys' ? 'border-purple-400/30' :
                    'border-gray-700'
                  } overflow-hidden`}
                >
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-750 transition-colors"
                    onClick={() => toggleQuizExpansion(quizId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${categoryColor}`}>
                          <FileText size={20} />
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-lg">{quizData.quizName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className={`px-2 py-1 rounded text-xs ${categoryColor}`}>
                              {quizData.category.replace('-', ' ').toUpperCase()}
                            </span>
                            <span>{quizData.totalAttempts} attempt{quizData.totalAttempts !== 1 ? 's' : ''}</span>
                            <span>Last: {quizData.lastAttempt?.formattedDate}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-xs text-gray-400">Best</p>
                            <p className="text-xl font-bold text-green-400">{quizData.bestScore}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Average</p>
                            <p className="text-xl font-bold">{quizData.averageScore}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Pass Rate</p>
                            <p className="text-xl font-bold text-blue-400">{quizData.passRate}%</p>
                          </div>
                        </div>
                        
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            quizData.averageScore >= 80 ? 'bg-green-500' :
                            quizData.averageScore >= 60 ? 'bg-blue-500' :
                            quizData.averageScore >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${quizData.averageScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="border-t border-gray-700 p-4 bg-gray-850">
                      <h4 className="text-sm font-semibold mb-3 text-gray-300">Individual Attempts</h4>
                      <div className="space-y-2">
                        {quizData.attempts.map((attempt, idx) => (
                          <div key={attempt.id} className="bg-gray-700/50 rounded p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-1 rounded ${attempt.passed ? 'bg-green-900' : 'bg-red-900'}`}>
                                  {attempt.passed ? 
                                    <CheckCircle size={16} className="text-green-400" /> : 
                                    <XCircle size={16} className="text-red-400" />
                                  }
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Attempt {quizData.attempts.length - idx}</span>
                                  <div className="flex items-center gap-4 text-xs text-gray-400">
                                    <span>{attempt.formattedDate}</span>
                                    <span>{attempt.formattedTime}</span>
                                    <span className="flex items-center gap-1">
                                      <Clock size={12} />
                                      {attempt.time_taken ? formatTimeTaken(attempt.time_taken) : attempt.duration}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className={`text-xl font-bold ${
                                  attempt.score >= 90 ? 'text-green-400' :
                                  attempt.score >= 80 ? 'text-blue-400' :
                                  attempt.score >= 70 ? 'text-yellow-400' :
                                  'text-red-400'
                                }`}>
                                  {attempt.score || 0}%
                                </div>
                                <div className="text-xs text-gray-400">
                                  {attempt.passed ? 'Passed' : 'Failed'}
                                </div>
                              </div>
                            </div>
                            
                            {attempt.submitted_answers && (
                              <div className="mt-2 text-xs text-gray-500">
                                {typeof attempt.submitted_answers === 'object' && 
                                 Array.isArray(attempt.submitted_answers) ? 
                                  `${attempt.submitted_answers.length} questions answered` :
                                  'Answers submitted'
                                }
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}