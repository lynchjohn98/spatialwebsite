// app/admin/teacher/[teacherId]/page.jsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  ArrowLeft, Download, Search, Filter, RefreshCw, 
  Award, Clock, Target, TrendingUp, Calendar, 
  CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';

export default function TeacherQuizDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.teacherId;
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [expandedAttempts, setExpandedAttempts] = useState({});
  
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
      
      // Process quiz attempts to add additional computed fields
      const processedAttempts = attemptsData.map(attempt => ({
        ...attempt,
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
    if (!start || !end) return 'N/A';
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
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

  // Group attempts by quiz name
  const groupedAttempts = useMemo(() => {
    const groups = {};
    quizAttempts.forEach(attempt => {
      const quizName = attempt.name || 'Unknown Quiz';
      if (!groups[quizName]) {
        groups[quizName] = {
          attempts: [],
          bestScore: 0,
          averageScore: 0,
          totalAttempts: 0,
          passRate: 0,
          lastAttempt: null
        };
      }
      groups[quizName].attempts.push(attempt);
    });

    // Calculate statistics for each quiz
    Object.keys(groups).forEach(quizName => {
      const quizData = groups[quizName];
      const scores = quizData.attempts.map(a => a.score || 0);
      
      quizData.totalAttempts = quizData.attempts.length;
      quizData.bestScore = Math.max(...scores);
      quizData.averageScore = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
      quizData.passRate = Math.round((quizData.attempts.filter(a => a.passed).length / quizData.attempts.length) * 100);
      quizData.lastAttempt = quizData.attempts[0]; // Already sorted by date desc
    });

    return groups;
  }, [quizAttempts]);

  // Filter and sort attempts
  const filteredAttempts = useMemo(() => {
    let filtered = [...quizAttempts];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(attempt =>
        attempt.quiz_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attempt.quiz_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected quiz
    if (selectedQuiz !== "all") {
      filtered = filtered.filter(attempt => attempt.quiz_name === selectedQuiz);
    }

    // Sort attempts
    switch (sortBy) {
      case 'date_desc':
        filtered.sort((a, b) => new Date(b.time_submitted) - new Date(a.time_submitted));
        break;
      case 'date_asc':
        filtered.sort((a, b) => new Date(a.time_submitted) - new Date(b.time_submitted));
        break;
      case 'score_desc':
        filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
        break;
      case 'score_asc':
        filtered.sort((a, b) => (a.score || 0) - (b.score || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [quizAttempts, searchTerm, selectedQuiz, sortBy]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    if (quizAttempts.length === 0) {
      return {
        totalAttempts: 0,
        uniqueQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        passRate: 0,
        totalTimeSpent: 0
      };
    }

    const uniqueQuizzes = new Set(quizAttempts.map(a => a.quiz_name)).size;
    const scores = quizAttempts.map(a => a.score || 0);
    const passedAttempts = quizAttempts.filter(a => a.passed).length;

    return {
      totalAttempts: quizAttempts.length,
      uniqueQuizzes,
      averageScore: Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length),
      bestScore: Math.max(...scores),
      passRate: Math.round((passedAttempts / quizAttempts.length) * 100),
      totalTimeSpent: 'N/A' // Could calculate if needed
    };
  }, [quizAttempts]);

  const toggleAttemptExpansion = (attemptId) => {
    setExpandedAttempts(prev => ({
      ...prev,
      [attemptId]: !prev[attemptId]
    }));
  };

  const downloadCSV = () => {
    const headers = [
      'Quiz Name', 'Quiz ID', 'Score', 'Passed', 'Date', 'Time',
      'Duration', 'Time Started', 'Time Submitted', 'Attempt Number'
    ];
    
    const rows = filteredAttempts.map(attempt => [
      attempt.quiz_name || '',
      attempt.quiz_id || '',
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
              <h1 className="text-2xl font-bold">Quiz Attempts Detail</h1>
              <p className="text-gray-400">
                {teacher?.name || 'Unknown Teacher'} ({teacher?.email})
              </p>
            </div>
          </div>
          <button
            onClick={fetchTeacherData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
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
              <Award size={18} />
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

        {/* Filters and Controls */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search quiz names..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <select
              value={selectedQuiz}
              onChange={(e) => setSelectedQuiz(e.target.value)}
              className="px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Quizzes</option>
              {Object.keys(groupedAttempts).map(quizName => (
                <option key={quizName} value={quizName}>{quizName}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date_desc">Latest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="score_desc">Highest Score</option>
              <option value="score_asc">Lowest Score</option>
            </select>
            
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Quiz Summary by Type */}
        {selectedQuiz === "all" && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Quiz Performance Summary</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(groupedAttempts).map(([quizName, quizData]) => (
                <div key={quizName} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{quizName}</h3>
                    <span className="text-sm text-gray-400">
                      {quizData.totalAttempts} attempt{quizData.totalAttempts !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Best Score</p>
                      <p className="font-bold text-green-400">{quizData.bestScore}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Average</p>
                      <p className="font-bold">{quizData.averageScore}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Pass Rate</p>
                      <p className="font-bold text-blue-400">{quizData.passRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Last Attempt</p>
                      <p className="font-bold text-xs">{quizData.lastAttempt?.formattedDate}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${quizData.averageScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Attempts List */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            Individual Attempts ({filteredAttempts.length})
          </h2>
          
          {filteredAttempts.length === 0 ? (
            <div className="bg-gray-800 p-8 rounded-lg text-center">
              <AlertCircle size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No quiz attempts found matching your filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAttempts.map((attempt) => (
                <div key={attempt.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-750 transition-colors"
                    onClick={() => toggleAttemptExpansion(attempt.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${attempt.passed ? 'bg-green-900' : 'bg-red-900'}`}>
                          {attempt.passed ? <CheckCircle size={20} className="text-green-400" /> : <XCircle size={20} className="text-red-400" />}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold">{attempt.quiz_name || 'Unknown Quiz'}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>{attempt.formattedDate}</span>
                            <span>{attempt.formattedTime}</span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {attempt.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            attempt.score >= 90 ? 'text-green-400' :
                            attempt.score >= 80 ? 'text-blue-400' :
                            attempt.score >= 70 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {attempt.score || 0}%
                          </div>
                          <div className="text-sm text-gray-400">
                            {attempt.passed ? 'Passed' : 'Failed'}
                          </div>
                        </div>
                        
                        {expandedAttempts[attempt.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>
                  
                  {expandedAttempts[attempt.id] && (
                    <div className="border-t border-gray-700 p-4 bg-gray-850">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Quiz ID</p>
                          <p className="font-mono">{attempt.quiz_id}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Started</p>
                          <p>{attempt.time_started ? new Date(attempt.time_started).toLocaleString() : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Submitted</p>
                          <p>{attempt.time_submitted ? new Date(attempt.time_submitted).toLocaleString() : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Attempt #</p>
                          <p>{attempt.attempt_number || 1}</p>
                        </div>
                      </div>
                      
                      {attempt.feedback && (
                        <div className="mt-4">
                          <p className="text-gray-400 text-sm mb-1">Feedback</p>
                          <p className="text-sm bg-gray-700 p-3 rounded">{attempt.feedback}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}