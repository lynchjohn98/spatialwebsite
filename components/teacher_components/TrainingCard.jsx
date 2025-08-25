import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Circle, Lock, BookOpen, PlayCircle, FileText, BookOpenCheck, Monitor } from 'lucide-react';

export const TrainingCard = ({ module, moduleProgress, isPretestComplete, onRestrictedClick }) => {
  const router = useRouter();
  
  // Calculate progress percentage based on module sections
  const calculateModuleProgress = (progress) => {
    if (!progress || typeof progress !== 'object') return 0;
    
    // Get all keys except 'completed_at' which is metadata
    const sections = Object.keys(progress).filter(key => 
      key !== 'completed_at' && key !== 'module_name'
    );
    
    if (sections.length === 0) return 0;
    
    // Count how many sections are true/completed
    const completedSections = sections.filter(key => 
      progress[key] === true || progress[key] === 'completed'
    ).length;
    
    return Math.round((completedSections / sections.length) * 100);
  };
  
  // Determine module status based on progress
  const getModuleStatus = (progressPercentage) => {
    if (!isPretestComplete && module.requiresPretest) {
      return {
        status: 'Locked',
        bgColor: 'bg-gray-800/50',
        borderColor: 'border-gray-600',
        hoverColor: 'hover:bg-gray-800/70',
        statusColor: 'text-gray-400',
        icon: <Lock className="w-6 h-6 text-gray-400" />
      };
    }
    
    if (progressPercentage === 100) {
      return {
        status: 'Completed',
        bgColor: 'bg-green-900/20',
        borderColor: 'border-green-500',
        hoverColor: 'hover:bg-green-900/30',
        statusColor: 'text-green-400',
        icon: <CheckCircle className="w-6 h-6 text-green-400" />
      };
    } else if (progressPercentage > 0) {
      return {
        status: 'In Progress',
        bgColor: 'bg-blue-900/20',
        borderColor: 'border-blue-500',
        hoverColor: 'hover:bg-blue-900/30',
        statusColor: 'text-blue-400',
        icon: <PlayCircle className="w-6 h-6 text-blue-400" />
      };
    } else {
      return {
        status: 'Not Started',
        bgColor: 'bg-gray-800/30',
        borderColor: 'border-gray-600',
        hoverColor: 'hover:bg-gray-800/50',
        statusColor: 'text-gray-300',
        icon: <Circle className="w-6 h-6 text-gray-400" />
      };
    }
  };
  
  const progressPercentage = calculateModuleProgress(moduleProgress);
  const moduleStatus = getModuleStatus(progressPercentage);
  
  const handleClick = () => {
    if (!isPretestComplete && module.requiresPretest) {
      onRestrictedClick();
    } else if (module.href) {
      router.push(module.href);
    }
  };
  
  // Map section names to more user-friendly display names and icons
  const getSectionDetails = () => {
    if (!moduleProgress || typeof moduleProgress !== 'object') return [];
    
    const sectionMap = {
      'getting_started': { name: 'Getting Started', icon: BookOpen },
      'introduction_video': { name: 'Introduction Video', icon: PlayCircle },
      'mini_lecture': { name: 'Mini Lecture', icon: FileText },
      'quiz': { name: 'Quiz', icon: CheckCircle },
      'software': { name: 'Software', icon: Monitor },
      'workbook': { name: 'Workbook', icon: BookOpenCheck },
      'assessment_completed': { name: 'Assessment', icon: CheckCircle },
      'video_watched': { name: 'Video', icon: PlayCircle },
      'slides_viewed': { name: 'Slides', icon: FileText },
      'activity_completed': { name: 'Activity', icon: BookOpen }
    };
    
    // Get all sections from the progress object
    return Object.entries(moduleProgress)
      .filter(([key]) => key !== 'completed_at' && key !== 'module_name' && sectionMap[key])
      .map(([key, value]) => ({
        ...sectionMap[key],
        completed: value === true || value === 'completed',
        key
      }))
      .sort((a, b) => {
        // Sort by predefined order
        const order = ['getting_started', 'introduction_video', 'mini_lecture', 'quiz', 'software', 'workbook'];
        return order.indexOf(a.key) - order.indexOf(b.key);
      });
  };
  
  const sections = getSectionDetails();
  
  return (
    <div
      className={`p-6 ${moduleStatus.bgColor} rounded-lg shadow-lg ${moduleStatus.hoverColor} 
        cursor-pointer transition-all duration-200 border-2 ${moduleStatus.borderColor}
        ${!isPretestComplete && module.requiresPretest ? 'opacity-60' : ''} w-full`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold uppercase tracking-wider ${moduleStatus.statusColor}`}>
              {moduleStatus.status}
            </span>
   
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{module.name}</h3>
          <p className="text-gray-300 text-sm">{module.description}</p>
        </div>
        <div className="ml-4">
          {moduleStatus.icon}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">Progress</span>
          <span className="text-xs font-semibold text-gray-300">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              progressPercentage === 100 ? 'bg-green-500' : 
              progressPercentage > 0 ? 'bg-blue-500' : 'bg-gray-600'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Section Indicators */}
      {sections.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div 
                key={section.key}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs ${
                  section.completed 
                    ? 'text-green-400 bg-green-900/20 border border-green-800' 
                    : 'text-gray-400 bg-gray-800/30 border border-gray-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="font-medium">{section.name}</span>
                {section.completed && <CheckCircle className="w-3 h-3 ml-1" />}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Show section count if no detailed sections */}
      {sections.length === 0 && moduleProgress && (
        <div className="text-xs text-gray-500">
          No progress data available
        </div>
      )}
    </div>
  );
};