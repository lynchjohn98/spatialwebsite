// AnalyticsView.jsx
import React, { useMemo } from 'react';
import { BarChart3, BookOpen, FileText, Calendar, Users } from 'lucide-react';

const QUIZ_MODULE_MAPPING = {
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

export function AnalyticsView({ teachers, courses, quizAttempts }) {
  // Calculate analytics data
  const analytics = useMemo(() => {
    // Progress distribution
    const progressDistribution = {
      '0-25%': 0,
      '26-50%': 0,
      '51-75%': 0,
      '76-99%': 0,
      '100%': 0
    };
    
    teachers.forEach(teacher => {
      const progress = teacher.moduleProgressPercentage || 0;
      if (progress === 100) progressDistribution['100%']++;
      else if (progress >= 76) progressDistribution['76-99%']++;
      else if (progress >= 51) progressDistribution['51-75%']++;
      else if (progress >= 26) progressDistribution['26-50%']++;
      else progressDistribution['0-25%']++;
    });
    
    // Module completion rates
    const moduleCompletionRates = {};
    teachers.forEach(teacher => {
      Object.entries(teacher.moduleProgressDetails || {}).forEach(([moduleName, data]) => {
        if (!moduleCompletionRates[moduleName]) {
          moduleCompletionRates[moduleName] = { completed: 0, total: 0, percentage: 0 };
        }
        moduleCompletionRates[moduleName].total++;
        if (data.isComplete) {
          moduleCompletionRates[moduleName].completed++;
        }
      });
    });
    
    Object.keys(moduleCompletionRates).forEach(module => {
      const rate = moduleCompletionRates[module];
      rate.percentage = rate.total > 0 ? Math.round((rate.completed / rate.total) * 100) : 0;
    });
    
    // Quiz performance by type
    const quizPerformance = {};
    quizAttempts.forEach(attempt => {
      const quizName = QUIZ_MODULE_MAPPING[attempt.quiz_id] || `Quiz ${attempt.quiz_id}`;
      if (!quizPerformance[quizName]) {
        quizPerformance[quizName] = {
          attempts: 0,
          totalScore: 0,
          averageScore: 0,
          bestScore: 0
        };
      }
      quizPerformance[quizName].attempts++;
      quizPerformance[quizName].totalScore += attempt.score || 0;
      quizPerformance[quizName].bestScore = Math.max(
        quizPerformance[quizName].bestScore, 
        attempt.score || 0
      );
    });
    
    Object.keys(quizPerformance).forEach(quiz => {
      const perf = quizPerformance[quiz];
      perf.averageScore = perf.attempts > 0 
        ? Math.round(perf.totalScore / perf.attempts) 
        : 0;
    });
    
    // Activity timeline
    const activityTimeline = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      activityTimeline[dateKey] = 0;
    }
    
    teachers.forEach(teacher => {
      if (teacher.lastActivity) {
        const activityDate = new Date(teacher.lastActivity).toISOString().split('T')[0];
        if (activityTimeline[activityDate] !== undefined) {
          activityTimeline[activityDate]++;
        }
      }
    });
    
    // County distribution
    const countyDistribution = {};
    courses.forEach(course => {
      const county = course.course_county || 'Unknown';
      countyDistribution[county] = (countyDistribution[county] || 0) + 1;
    });
    
    // Research type distribution
    const researchTypeDistribution = {};
    courses.forEach(course => {
      const type = course.course_research_type || 'No Research';
      researchTypeDistribution[type] = (researchTypeDistribution[type] || 0) + 1;
    });
    
    return {
      progressDistribution,
      moduleCompletionRates,
      quizPerformance,
      activityTimeline,
      countyDistribution,
      researchTypeDistribution
    };
  }, [teachers, courses, quizAttempts]);
  
  const getBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="space-y-6">
      {/* Progress Distribution */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          Progress Distribution
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(analytics.progressDistribution).map(([range, count]) => {
            const percentage = teachers.length > 0 
              ? Math.round((count / teachers.length) * 100) 
              : 0;
            const maxCount = Math.max(...Object.values(analytics.progressDistribution));
            const barHeight = maxCount > 0 ? (count / maxCount) * 100 : 0;
            
            return (
              <div key={range} className="text-center">
                <div className="h-32 flex flex-col justify-end mb-2">
                  <div 
                    className="bg-blue-500 rounded-t transition-all duration-500 relative group"
                    style={{ height: `${barHeight}%`, minHeight: count > 0 ? '4px' : '0' }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {count} teachers
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">{range}</div>
                <div className="text-sm font-medium">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Module Completion Rates */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-green-400" />
          Module Completion Rates
        </h3>
        <div className="space-y-3">
          {Object.entries(analytics.moduleCompletionRates)
            .sort((a, b) => b[1].percentage - a[1].percentage)
            .slice(0, 10)
            .map(([moduleName, data]) => (
              <div key={moduleName} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{moduleName}</span>
                    <span className="text-xs text-gray-400">
                      {data.completed}/{data.total} teachers
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getBarColor(data.percentage)}`}
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm font-bold w-12 text-right">
                  {data.percentage}%
                </div>
              </div>
            ))}
            
            {Object.keys(analytics.moduleCompletionRates).length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No module data available
              </div>
            )}
        </div>
      </div>
      
      {/* Quiz Performance */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          Quiz Performance Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Quiz Name</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-400 uppercase">Attempts</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-400 uppercase">Avg Score</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-400 uppercase">Best Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {Object.entries(analytics.quizPerformance)
                .sort((a, b) => b[1].attempts - a[1].attempts)
                .map(([quizName, data]) => (
                  <tr key={quizName} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-3 py-2 text-sm">{quizName}</td>
                    <td className="px-3 py-2 text-sm text-center">{data.attempts}</td>
                    <td className="px-3 py-2 text-sm text-center">
                      <span className={`font-medium ${
                        data.averageScore >= 80 ? 'text-green-400' :
                        data.averageScore >= 60 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {data.averageScore}%
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-center">
                      <span className={`font-medium ${
                        data.bestScore >= 80 ? 'text-green-400' :
                        data.bestScore >= 60 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {data.bestScore}%
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          
          {Object.keys(analytics.quizPerformance).length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No quiz data available
            </div>
          )}
        </div>
      </div>
      
      {/* Activity Timeline */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-yellow-400" />
          7-Day Activity Timeline
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {Object.entries(analytics.activityTimeline).map(([date, count]) => {
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
            const maxActivity = Math.max(...Object.values(analytics.activityTimeline));
            const barHeight = maxActivity > 0 ? (count / maxActivity) * 100 : 0;
            
            return (
              <div key={date} className="text-center">
                <div className="h-20 flex flex-col justify-end mb-2">
                  <div 
                    className="bg-yellow-500 rounded-t transition-all duration-500"
                    style={{ height: `${barHeight}%`, minHeight: count > 0 ? '4px' : '0' }}
                  />
                </div>
                <div className="text-xs text-gray-400">{dayName}</div>
                <div className="text-sm font-medium">{count}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Distribution Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* County Distribution */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Course Distribution by County
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(analytics.countyDistribution)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([county, count]) => (
                <div key={county} className="bg-gray-700/30 p-3 rounded">
                  <div className="text-sm font-medium truncate">{county}</div>
                  <div className="text-2xl font-bold text-indigo-400">{count}</div>
                  <div className="text-xs text-gray-400">
                    {courses.length > 0 
                      ? `${Math.round((count / courses.length) * 100)}%` 
                      : '0%'
                    } of total
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        {/* Research Type Distribution */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Research Type Distribution
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(analytics.researchTypeDistribution)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([type, count]) => (
                <div key={type} className="bg-gray-700/30 p-3 rounded">
                  <div className="text-sm font-medium truncate">{type}</div>
                  <div className="text-2xl font-bold text-cyan-400">{count}</div>
                  <div className="text-xs text-gray-400">
                    {courses.length > 0 
                      ? `${Math.round((count / courses.length) * 100)}%` 
                      : '0%'
                    } of total
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      
      {/* Summary Statistics */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/30 p-3 rounded">
            <div className="text-xs text-gray-400 mb-1">Completion Rate</div>
            <div className="text-xl font-bold">
              {teachers.length > 0 
                ? Math.round((teachers.filter(t => t.training_complete).length / teachers.length) * 100)
                : 0}%
            </div>
          </div>
          <div className="bg-gray-700/30 p-3 rounded">
            <div className="text-xs text-gray-400 mb-1">Avg Modules/Teacher</div>
            <div className="text-xl font-bold">
              {teachers.length > 0 
                ? (teachers.reduce((sum, t) => sum + (t.completedModules || 0), 0) / teachers.length).toFixed(1)
                : 0}
            </div>
          </div>
          <div className="bg-gray-700/30 p-3 rounded">
            <div className="text-xs text-gray-400 mb-1">Research Consent Rate</div>
            <div className="text-xl font-bold">
              {teachers.length > 0 
                ? Math.round((teachers.filter(t => t.research_consent).length / teachers.length) * 100)
                : 0}%
            </div>
          </div>
          <div className="bg-gray-700/30 p-3 rounded">
            <div className="text-xs text-gray-400 mb-1">Avg Courses/Teacher</div>
            <div className="text-xl font-bold">
              {teachers.length > 0 
                ? (courses.length / teachers.length).toFixed(1)
                : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}