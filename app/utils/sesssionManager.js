// Create a new utility file: app/utils/sessionManager.js

export const SessionManager = {
  // Keys for session storage
  KEYS: {
    STUDENT_DATA: 'studentData',
    COURSE_DATA: 'courseData',
    STUDENT_PROGRESS: 'studentProgressData',
    CURRENT_QUIZ: 'currentQuiz',
    SESSION_TIMESTAMP: 'sessionTimestamp'
  },

  // Set session with timestamp
  setSession(key, data) {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
      sessionStorage.setItem(this.KEYS.SESSION_TIMESTAMP, Date.now().toString());
      return true;
    } catch (error) {
      console.error(`Error setting session for ${key}:`, error);
      return false;
    }
  },

  // Get session with validation
  getSession(key) {
    try {
      const data = sessionStorage.getItem(key);
      if (!data) return null;
      
      // Check if session is still valid (24 hours)
      const timestamp = sessionStorage.getItem(this.KEYS.SESSION_TIMESTAMP);
      if (timestamp) {
        const age = Date.now() - parseInt(timestamp);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (age > maxAge) {
          this.clearSession();
          return null;
        }
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error getting session for ${key}:`, error);
      return null;
    }
  },

  // Validate student session
  validateStudentSession() {
    const studentData = this.getSession(this.KEYS.STUDENT_DATA);
    const courseData = this.getSession(this.KEYS.COURSE_DATA);
    
    if (!studentData || !courseData) {
      return { valid: false, reason: 'Missing session data' };
    }
    
    // Check required fields
    if (!studentData.id || !studentData.student_username) {
      return { valid: false, reason: 'Invalid student data' };
    }
    
    if (!courseData.id && !courseData.course_id) {
      return { valid: false, reason: 'Invalid course data' };
    }
    
    return { valid: true, studentData, courseData };
  },

  // Clear session
  clearSession() {
    Object.values(this.KEYS).forEach(key => {
      sessionStorage.removeItem(key);
    });
  },

  // Refresh session timestamp
  refreshTimestamp() {
    sessionStorage.setItem(this.KEYS.SESSION_TIMESTAMP, Date.now().toString());
  }
};

// Create a hook for student session: app/utils/hooks/useStudentSession.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionManager } from '../sessionManager';

export function useStudentSession() {
  const [studentData, setStudentData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = () => {
      const validation = SessionManager.validateStudentSession();
      
      if (validation.valid) {
        setStudentData(validation.studentData);
        setCourseData(validation.courseData);
        setIsValid(true);
        
        // Refresh timestamp on valid session
        SessionManager.refreshTimestamp();
      } else {
        console.error('Invalid session:', validation.reason);
        setIsValid(false);
        
        // Only redirect if we're sure the session is invalid
        // Don't redirect during initial load
        if (!isLoading && window.location.pathname !== '/student/student-join') {
          router.push('/student/student-join');
        }
      }
      
      setIsLoading(false);
    };

    // Initial check
    checkSession();

    // Set up interval to check session periodically
    const interval = setInterval(checkSession, 60000); // Check every minute

    // Listen for storage events (session changes in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === SessionManager.KEYS.STUDENT_DATA || 
          e.key === SessionManager.KEYS.COURSE_DATA) {
        checkSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router, isLoading]);

  const updateStudentData = (data) => {
    if (SessionManager.setSession(SessionManager.KEYS.STUDENT_DATA, data)) {
      setStudentData(data);
    }
  };

  const updateCourseData = (data) => {
    if (SessionManager.setSession(SessionManager.KEYS.COURSE_DATA, data)) {
      setCourseData(data);
    }
  };

  return {
    studentData,
    courseData,
    isLoading,
    isValid,
    updateStudentData,
    updateCourseData,
    clearSession: () => SessionManager.clearSession()
  };
}