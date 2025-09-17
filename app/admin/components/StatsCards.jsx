// StatsCards.jsx
import React from 'react';
import { Users, User, BookOpen, TrendingUp, Award, FileText, School, UserX } from 'lucide-react';

export function StatsCards({ stats }) {
  const getProgressBarColor = (percentage) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-400">Total Teachers</h3>
          <Users className="text-blue-400" size={20} />
        </div>
        <p className="text-2xl font-bold">{stats.totalTeachers}</p>
        <p className="text-xs text-gray-500 mt-1">Registered</p>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-400">Active This Week</h3>
          <User className="text-green-400" size={20} />
        </div>
        <p className="text-2xl font-bold">{stats.activeTeachers}</p>
        <p className="text-xs text-gray-500 mt-1">
          {stats.totalTeachers > 0 
            ? `${Math.round((stats.activeTeachers / stats.totalTeachers) * 100)}%` 
            : '0%'} of total
        </p>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-400">With Courses</h3>
          <School className="text-cyan-400" size={20} />
        </div>
        <p className="text-2xl font-bold">{stats.teachersWithCourses || 0}</p>
        <p className="text-xs text-gray-500 mt-1">
          {stats.totalTeachers > 0 
            ? `${Math.round(((stats.teachersWithCourses || 0) / stats.totalTeachers) * 100)}%` 
            : '0%'} creating
        </p>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-400">Without Courses</h3>
          <UserX className="text-orange-400" size={20} />
        </div>
        <p className="text-2xl font-bold">{stats.teachersWithoutCourses || 0}</p>
        <p className="text-xs text-gray-500 mt-1">
          {stats.totalTeachers > 0 
            ? `${Math.round(((stats.teachersWithoutCourses || 0) / stats.totalTeachers) * 100)}%` 
            : '0%'} not started
        </p>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-400">Total Courses</h3>
          <BookOpen className="text-purple-400" size={20} />
        </div>
        <p className="text-2xl font-bold">{stats.totalCourses}</p>
        <p className="text-xs text-gray-500 mt-1">Created</p>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-400">Avg. Progress</h3>
          <TrendingUp className="text-yellow-400" size={20} />
        </div>
        <p className="text-2xl font-bold">{stats.averageProgress}%</p>
        <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
          <div 
            className={`h-1 rounded-full ${getProgressBarColor(stats.averageProgress)}`}
            style={{ width: `${stats.averageProgress}%` }}
          />
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-400">Completed</h3>
          <Award className="text-green-400" size={20} />
        </div>
        <p className="text-2xl font-bold">{stats.completedTraining}</p>
        <p className="text-xs text-gray-500 mt-1">
          {stats.totalTeachers > 0
            ? `${Math.round((stats.completedTraining / stats.totalTeachers) * 100)}%`
            : '0%'} done
        </p>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-400">Quiz Attempts</h3>
          <FileText className="text-indigo-400" size={20} />
        </div>
        <p className="text-2xl font-bold">{stats.totalQuizAttempts}</p>
        <p className="text-xs text-gray-500 mt-1">Submissions</p>
      </div>
    </div>
  );
}