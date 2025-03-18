"use client";
import { useState, useEffect } from "react";

export default function QuizTimer({ 
  timeLeft, 
  totalTime, 
  onTimeUp 
}) {
  const [isWarning, setIsWarning] = useState(false);
  const [isLowTime, setIsLowTime] = useState(false);
  
  // Calculate percentage of time remaining
  const timePercentage = (timeLeft / totalTime) * 100;
  
  // Format time as mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Update warning status based on time left
  useEffect(() => {
    // Warning when 25% time left
    setIsWarning(timePercentage <= 25);
    
    // Critical warning when 10% time left
    setIsLowTime(timePercentage <= 10);
    
    // Vibration warning if supported and time is running low
    if (isLowTime && 'vibrate' in navigator) {
      try {
        navigator.vibrate(200);
      } catch (e) {
        // Ignore vibration errors
      }
    }
  }, [timePercentage, isLowTime]);

  return (
    <div className="quiz-timer relative">
      {/* Timer display */}
      <div className={`
        timer-display text-center py-2 px-4 rounded-lg font-mono text-lg font-bold
        transition-colors duration-300
        ${isLowTime ? 'bg-red-800 animate-pulse' : 
          isWarning ? 'bg-yellow-800' : 'bg-gray-700'}
      `}>
        <div className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 mr-2 ${isLowTime ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-blue-400'}`} 
            viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className={isLowTime ? 'text-red-300' : isWarning ? 'text-yellow-300' : 'text-white'}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-700 mt-1 rounded-full overflow-hidden">
        <div 
          className={`h-full ${
            isLowTime ? 'bg-red-600' : 
            isWarning ? 'bg-yellow-600' : 'bg-blue-600'
          } transition-all duration-300 ease-linear`}
          style={{ width: `${timePercentage}%` }}
        ></div>
      </div>
      
      {/* Time indicators */}
      {(isWarning || isLowTime) && (
        <div className={`text-center text-xs mt-1 ${
          isLowTime ? 'text-red-400' : 'text-yellow-400'
        }`}>
          {isLowTime ? 'Time almost up!' : 'Time running low'}
        </div>
      )}
    </div>
  );
}