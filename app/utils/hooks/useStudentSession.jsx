// app/utils/hooks/useStudentSession.jsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Session Manager object embedded in the hook file
const SessionManager = {
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
      if (typeof window === 'undefined') return false;
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
      if (typeof window === 'undefined') return null;
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
    
    // Check required fields for student
    if (!studentData.id && !studentData.student_id) {
      return { valid: false, reason: 'Invalid student data - missing ID' };
    }
    
    if (!studentData.student_username && !studentData.username) {
      return { valid: false, reason: 'Invalid student data - missing username' };
    }
    
    // Check required fields for course
    if (!courseData.id && !courseData.course_id && !courseData.courses?.id) {
      return { valid: false, reason: 'Invalid course data - missing ID' };
    }
    
    return { valid: true, studentData, courseData };
  },

  // Clear session
  clearSession() {
    if (typeof window === 'undefined') return;
    Object.values(this.KEYS).forEach(key => {
      sessionStorage.removeItem(key);
    });
  },

  // Refresh session timestamp
  refreshTimestamp() {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(this.KEYS.SESSION_TIMESTAMP, Date.now().toString());
  }
};

export function useStudentSession() {
  const [studentData, setStudentData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check and validate session
  const checkSession = useCallback(() => {
    try {
      const validation = SessionManager.validateStudentSession();
      
      if (validation.valid) {
        setStudentData(validation.studentData);
        setCourseData(validation.courseData);
        setIsValid(true);
        setError(null);
        
        // Also check for progress data
        const progress = SessionManager.getSession(SessionManager.KEYS.STUDENT_PROGRESS);
        if (progress) {
          setProgressData(progress);
        }
        
        // Refresh timestamp on valid session
        SessionManager.refreshTimestamp();
        
        return true;
      } else {
        console.warn('Invalid session:', validation.reason);
        setIsValid(false);
        setError(validation.reason);
        return false;
      }
    } catch (err) {
      console.error('Error checking session:', err);
      setError('Failed to validate session');
      setIsValid(false);
      return false;
    }
  }, []);

  // Initial session check
  useEffect(() => {
    const initializeSession = async () => {
      setIsLoading(true);
      
      // Small delay to ensure sessionStorage is available
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const isSessionValid = checkSession();
      
      // Only redirect if we're on a protected route and session is invalid
      const currentPath = window.location.pathname;
      const isProtectedRoute = currentPath.startsWith('/student/student-dashboard');
      const isLoginRoute = currentPath === '/student/student-join' || currentPath === '/student-join';
      
      if (!isSessionValid && isProtectedRoute && !isLoginRoute) {
        console.log('Invalid session on protected route, redirecting to login');
        router.push('/student/student-join');
      }
      
      setIsLoading(false);
    };

    initializeSession();
  }, [checkSession, router]);

  // Set up periodic session checks
  useEffect(() => {
    if (!isValid) return;

    // Check session every 30 seconds
    const interval = setInterval(() => {
      const stillValid = checkSession();
      if (!stillValid) {
        const currentPath = window.location.pathname;
        const isProtectedRoute = currentPath.startsWith('/student/student-dashboard');
        
        if (isProtectedRoute) {
          router.push('/student/student-join');
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isValid, checkSession, router]);

  // Listen for storage events (changes in other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === SessionManager.KEYS.STUDENT_DATA || 
          e.key === SessionManager.KEYS.COURSE_DATA ||
          e.key === SessionManager.KEYS.STUDENT_PROGRESS) {
        checkSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events within the same tab
    const handleSessionUpdate = () => {
      checkSession();
    };
    
    window.addEventListener('sessionUpdate', handleSessionUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sessionUpdate', handleSessionUpdate);
    };
  }, [checkSession]);

  // Update student data
  const updateStudentData = useCallback((data) => {
    if (SessionManager.setSession(SessionManager.KEYS.STUDENT_DATA, data)) {
      setStudentData(data);
      // Trigger custom event for same-tab updates
      window.dispatchEvent(new Event('sessionUpdate'));
      return true;
    }
    return false;
  }, []);

  // Update course data
  const updateCourseData = useCallback((data) => {
    if (SessionManager.setSession(SessionManager.KEYS.COURSE_DATA, data)) {
      setCourseData(data);
      // Trigger custom event for same-tab updates
      window.dispatchEvent(new Event('sessionUpdate'));
      return true;
    }
    return false;
  }, []);

  // Update progress data
  const updateProgressData = useCallback((data) => {
    if (SessionManager.setSession(SessionManager.KEYS.STUDENT_PROGRESS, data)) {
      setProgressData(data);
      // Trigger custom event for same-tab updates
      window.dispatchEvent(new Event('sessionUpdate'));
      return true;
    }
    return false;
  }, []);

  // Set current quiz
  const setCurrentQuiz = useCallback((quizData) => {
    if (SessionManager.setSession(SessionManager.KEYS.CURRENT_QUIZ, quizData)) {
      return true;
    }
    return false;
  }, []);

  // Get current quiz
  const getCurrentQuiz = useCallback(() => {
    return SessionManager.getSession(SessionManager.KEYS.CURRENT_QUIZ);
  }, []);

  // Clear session
  const clearSession = useCallback(() => {
    SessionManager.clearSession();
    setStudentData(null);
    setCourseData(null);
    setProgressData(null);
    setIsValid(false);
    router.push('/student/student-join');
  }, [router]);

  // Refresh session (extends timestamp)
  const refreshSession = useCallback(() => {
    SessionManager.refreshTimestamp();
  }, []);

  return {
    // Data
    studentData,
    courseData,
    progressData,
    
    // Status
    isLoading,
    isValid,
    error,
    
    // Actions
    updateStudentData,
    updateCourseData,
    updateProgressData,
    setCurrentQuiz,
    getCurrentQuiz,
    clearSession,
    refreshSession,
    checkSession
  };
}