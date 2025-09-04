"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TeacherConsentUploadSection from "../../../components/teacher_components/TeacherConsentUploadSection";
import { 
  fetchTeacherProgressPage,
  fetchTeacherQuizAttempts,
  updateTeacherResearchConsent,
  fetchTeacherData,
  fetchTeacherConsentFiles
} from "../../library/services/teacher_actions";

export default function ProgressPage() {
  const router = useRouter();
  const [teacherData, setTeacherData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [consentChecked, setConsentChecked] = useState(false);
  const [isUpdatingConsent, setIsUpdatingConsent] = useState(false);
  
  // File upload states
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadedConsentFile, setUploadedConsentFile] = useState(false);
  const [consentFiles, setConsentFiles] = useState([]);
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    loadTeacherProgress();
    
    // Set up an interval to check for updates every 5 seconds
    const intervalId = setInterval(() => {
      checkForUpdates();
    }, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const checkForUpdates = async () => {
    try {
      const storedData = JSON.parse(sessionStorage.getItem("teacherData"));
      if (!storedData?.id) return;
      
      // Fetch fresh teacher data
      const freshTeacherData = await fetchTeacherData(storedData.id);
      if (freshTeacherData) {
        // Check if pretest status has changed
        const currentPretestStatus = storedData.pretest_complete;
        const newPretestStatus = freshTeacherData.pretest_complete;
        
        // Update if there's a change
        if (currentPretestStatus !== newPretestStatus) {
          console.log("Pretest status changed:", currentPretestStatus, "->", newPretestStatus);
          sessionStorage.setItem("teacherData", JSON.stringify(freshTeacherData));
          setTeacherData(freshTeacherData);
          
          // Also refresh progress data
          const progress = await fetchTeacherProgressPage(freshTeacherData.id);
          setProgressData(progress);
        }
        
        // Check for other status changes too
        if (storedData.posttest_complete !== freshTeacherData.posttest_complete ||
            storedData.training_complete !== freshTeacherData.training_complete) {
          sessionStorage.setItem("teacherData", JSON.stringify(freshTeacherData));
          setTeacherData(freshTeacherData);
        }
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
    }
  };

  const loadTeacherProgress = async () => {
    try {
      // Get teacher data from session
      const storedData = JSON.parse(sessionStorage.getItem("teacherData"));
      if (!storedData) {
        router.push("/teacher/login");
        return;
      }
      
      // Always fetch fresh data on initial load
      try {
        const freshTeacherData = await fetchTeacherData(storedData.id);
        if (freshTeacherData) {
          // Update sessionStorage with fresh data
          sessionStorage.setItem("teacherData", JSON.stringify(freshTeacherData));
          setTeacherData(freshTeacherData);
          setConsentChecked(freshTeacherData.research_consent || false);
          
          // Fetch progress data with fresh teacher data
          const progress = await fetchTeacherProgressPage(freshTeacherData.id);
          setProgressData(progress);
        } else {
          // Fallback to stored data if fetch fails
          setTeacherData(storedData);
          setConsentChecked(storedData.research_consent || false);
          
          const progress = await fetchTeacherProgressPage(storedData.id);
          setProgressData(progress);
        }
      } catch (fetchError) {
        console.error("Error fetching fresh teacher data:", fetchError);
        // Use stored data as fallback
        setTeacherData(storedData);
        setConsentChecked(storedData.research_consent || false);
        
        const progress = await fetchTeacherProgressPage(storedData.id);
        setProgressData(progress);
      }

      // Fetch quiz attempts
      const attempts = await fetchTeacherQuizAttempts(storedData.id);
      setQuizAttempts(attempts || []);
      
      // Fetch uploaded consent files
      const files = await fetchTeacherConsentFiles(storedData.id);
      setConsentFiles(files || []);

    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add manual refresh function
  const refreshProgress = async () => {
    setIsLoading(true);
    await loadTeacherProgress();
    setIsLoading(false);
  };

  const handleConsentChange = async (newValue) => {
    setIsUpdatingConsent(true);
    try {
      const result = await updateTeacherResearchConsent(teacherData.id, newValue);
      if (result.success) {
        setConsentChecked(newValue);
        // Update session storage
        const updatedData = { ...teacherData, research_consent: newValue };
        sessionStorage.setItem("teacherData", JSON.stringify(updatedData));
        setTeacherData(updatedData);
      }
    } catch (error) {
      console.error("Error updating consent:", error);
      // Revert checkbox on error
      setConsentChecked(!newValue);
    } finally {
      setIsUpdatingConsent(false);
    }
  };

  const handleFilesUploaded = (newFiles) => {
    setConsentFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileDeleted = (fileId) => {
    setConsentFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleCopyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      setTimeout(() => {
        setEmailCopied(false);
      }, 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusBadge = (status, value) => {
    if (status === 'complete') {
      return value ? 
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-600 text-white">Complete</span> :
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-600 text-white">Incomplete</span>;
    }
    return value ? 
      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-600 text-white">Yes</span> :
      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-600 text-white">No</span>;
  };

  const calculateOverallProgress = () => {
    if (!teacherData) return 0;
    
    const items = [
      teacherData.pretest_complete,
      teacherData.training_complete,
      teacherData.posttest_complete,
      teacherData.research_consent
    ];
    
    const completed = items.filter(item => item === true).length;
    return Math.round((completed / items.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading progress data...</p>
        </div>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      {/* Sticky Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/teacher/homepage")}
              className="flex items-center text-gray-300 hover:text-white transition-colors group"
            >
              <svg
                className="h-5 w-5 mr-2 group-hover:translate-x-[-2px] transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Return to Teacher Homepage</span>
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={refreshProgress}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Refresh progress"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <div className="text-sm text-gray-400">Training Progress</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Training Progress</h1>
          <p className="text-gray-400">Track your training completion and quiz performance</p>
          {/* Add a subtle indicator when data is fresh */}
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Overall Progress Card */}
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Overall Progress</h2>
            <span className="text-2xl font-bold text-blue-400">{overallProgress}%</span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-3 mb-6">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Pretest</span>
                {getStatusBadge('complete', teacherData?.pretest_complete)}
              </div>
              <div className="text-lg font-medium">
                {teacherData?.pretest_complete ? '✓ Completed' : 'Not Started'}
              </div>
            </div>

            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Training</span>
                {getStatusBadge('complete', teacherData?.training_complete)}
              </div>
              <div className="text-lg font-medium">
                {teacherData?.training_complete ? '✓ Completed' : 'In Progress'}
              </div>
            </div>

            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Posttest</span>
                {getStatusBadge('complete', teacherData?.posttest_complete)}
              </div>
              <div className="text-lg font-medium">
                {teacherData?.posttest_complete ? '✓ Completed' : 'Not Started'}
              </div>
            </div>

            <div className="bg-gray-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Research Consent</span>
                {getStatusBadge('consent', teacherData?.research_consent)}
              </div>
              <div className="text-lg font-medium">
                {teacherData?.research_consent ? '✓ Provided' : 'Not Provided'}
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same... */}
        {/* Research Consent Section */}
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Research Participation</h2>
              <p className="text-gray-400 text-sm">
                Help us improve our training program by participating in our research study
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href="https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial/consent_forms_teacher.docx"
                download="teacher_consent_form.docx"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Consent Form
              </a>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-700/30 rounded-lg mb-4">
            <input
              type="checkbox"
              id="research-consent"
              checked={consentChecked}
              onChange={(e) => {
                if (!e.target.checked) {
                  // If unchecking, show confirmation
                  if (confirm("Are you sure you want to withdraw your research consent?")) {
                    handleConsentChange(false);
                  }
                } else {
                  // If checking, directly update consent
                  handleConsentChange(true);
                }
              }}
              disabled={isUpdatingConsent}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-600 rounded mr-3"
            />
            <label htmlFor="research-consent" className="flex-1">
              <span className="font-medium">I consent to participate in research</span>
              <p className="text-sm text-gray-400 mt-1">
                Your data will be used anonymously to improve educational outcomes
              </p>
            </label>
            {teacherData?.research_consent && (
              <div className="ml-4">
                <span className="text-green-400 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Consent Provided
                </span>
              </div>
            )}
          </div>

          <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-300 font-semibold mb-1">Instructions</p>
                <p className="text-blue-200/90 text-sm">
                  1. Download and review the consent form using the button above<br/>
                  2. Check the box to confirm your consent electronically<br/>
                  3. Upload a signed copy below for our records (optional)
                </p>
              </div>
            </div>
          </div>

          {/* Consent Form Submission Options */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-medium mb-3">Submit Your Signed Consent Form</h3>
            <p className="text-gray-400 text-sm mb-4">
              Please submit your signed consent form using one of the methods below:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {/* File Upload Option */}
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <h4 className="font-medium">Upload Signed Form</h4>
                </div>
                
                <TeacherConsentUploadSection
                  teacherId={teacherData?.id}
                  uploadedFiles={consentFiles}
                  onFilesUploaded={handleFilesUploaded}
                  onFileDeleted={handleFileDeleted}
                />
              </div>

              {/* Email Option */}
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h4 className="font-medium">Email Signed Form</h4>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-300">
                    Send your signed consent form to:
                  </p>
                  <div className="bg-gray-800 p-3 rounded flex items-center justify-between">
                    <code className="text-blue-300 text-sm">lynchjohhn98@gmail.com</code>
                    <button
                      onClick={() => handleCopyEmail('lynchjohhn98@gmail.com')}
                      className="ml-2 p-1 hover:bg-gray-700 rounded transition-colors"
                      title="Copy email address"
                    >
                      {emailCopied ? (
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Include your name and Spatial LMS in the email subject
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Module Progress Details */}
        {progressData && progressData.module_progress && (
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Module Progress Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(progressData.module_progress)
                .sort((a, b) => (a[1].order || 999) - (b[1].order || 999))
                .map(([module, data]) => {
                  const components = ['quiz', 'software', 'workbook', 'mini_lecture', 'getting_started', 'introduction_video'];
                  const completedComponents = components.filter(comp => data[comp] === true).length;
                  const totalComponents = components.length;
                  const progressValue = Math.round((completedComponents / totalComponents) * 100);
                  
                  const moduleName = module;
                  const isComplete = data.completed_at !== null || progressValue === 100;
                  
                  return (
                    <div key={module} className="bg-gray-700/30 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{moduleName}</span>
                        <span className={`text-sm ${progressValue === 100 ? 'text-green-400' : 'text-gray-400'}`}>
                          {progressValue}% complete
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            progressValue === 100 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progressValue}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-1 mt-2">
                        {components.map(comp => {
                          const isCompleted = data[comp] === true;
                          const compName = comp.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                          return (
                            <div 
                              key={comp} 
                              className="text-xs flex items-center gap-1"
                              title={compName}
                            >
                              <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-400' : 'bg-gray-500'}`} />
                              <span className="text-gray-400 truncate">{compName.substring(0, 8)}</span>
                            </div>
                          );
                        })}
                      </div>
                      {data.completed_at && (
                        <p className="text-xs text-gray-500 mt-2">
                          Completed: {formatDate(data.completed_at)}
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Quiz Attempts Section */}
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Quiz Attempts</h2>
          
          {quizAttempts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-400">No quiz attempts yet</p>
              <p className="text-sm text-gray-500 mt-2">Complete modules to unlock quizzes</p>
            </div>
          ) : (
            <QuizAttemptsTable quizAttempts={quizAttempts} />
          )}
        </div>
      </div>
    </div>
  );
}

// QuizAttemptsTable component remains the same as in your original code
function QuizAttemptsTable({ quizAttempts }) {
  // ... rest of the QuizAttemptsTable component code remains unchanged
  const [expandedQuizzes, setExpandedQuizzes] = useState({});
  
  // Group attempts by quiz_id
  const groupedAttempts = quizAttempts.reduce((acc, attempt) => {
    const quizId = attempt.quiz_id;
    if (!acc[quizId]) {
      acc[quizId] = [];
    }
    acc[quizId].push(attempt);
    return acc;
  }, {});
  
  const toggleQuizExpansion = (quizId) => {
    setExpandedQuizzes(prev => ({
      ...prev,
      [quizId]: !prev[quizId]
    }));
  };
  
  const getQuizName = (quizId) => {
    const quizNames = {
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
    return quizNames[quizId] || `Quiz ${quizId}`;
  };
  
  const getQuizMaxScore = (quizId) => {
    const maxScores = {
      1: 30,
      2: 10,
      3: 13,
      4: 15,
      5: 16,
      6: 10,
      7: 9,
      8: 14,
      9: 8,
      10: 30,
      11: 28,
      12: 20,
      13: 12,
      14: 30,
      15: 10,
      16: 13,
      17: 5,
      18: 0,
      19: 0,
      20: 0
    };
    return maxScores[quizId] || 10;
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatTime = (seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  const getBestScore = (attempts) => {
    return Math.max(...attempts.map(a => a.score || 0));
  };
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const calculateActualScore = (percentage, maxScore) => {
    return Math.round((percentage / 100) * maxScore);
  };
  
  return (
    <div className="space-y-3">
      {Object.entries(groupedAttempts).map(([quizId, attempts]) => {
        const isExpanded = expandedQuizzes[quizId];
        const bestScore = getBestScore(attempts);
        const maxScore = getQuizMaxScore(parseInt(quizId));
        const bestActualScore = calculateActualScore(bestScore, maxScore);
        const attemptCount = attempts.length;
        
        return (
          <div key={quizId} className="border border-gray-700 rounded-lg overflow-hidden">
            <div 
              className="bg-gray-700/50 px-4 py-3 cursor-pointer hover:bg-gray-700/70 transition-colors"
              onClick={() => toggleQuizExpansion(quizId)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="p-1 hover:bg-gray-600 rounded transition-colors">
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div>
                    <h3 className="font-medium text-white">{getQuizName(quizId)}</h3>
                    <p className="text-sm text-gray-400">
                      {attemptCount} attempt{attemptCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-1">Best Score</p>
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-bold ${getScoreColor(bestScore)}`}>
                        {bestActualScore}/{maxScore}
                      </span>
                      <span className={`text-sm ${getScoreColor(bestScore)}`}>
                        ({bestScore}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {isExpanded && (
              <div className="bg-gray-800/30 px-4 py-3">
                <table className="w-full">
                  <thead className="border-b border-gray-700">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Attempt #</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Score</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Percentage</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Time Taken</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Date Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {attempts
                      .sort((a, b) => new Date(b.time_submitted || b.created_at) - new Date(a.time_submitted || a.created_at))
                      .map((attempt, index) => {
                        const actualScore = calculateActualScore(attempt.score, maxScore);
                        return (
                          <tr key={attempt.id || index} className="hover:bg-gray-700/20 transition-colors">
                            <td className="px-3 py-3 text-sm text-gray-300">
                              Attempt {attempts.length - index}
                            </td>
                            <td className="px-3 py-3">
                              <span className={`font-semibold text-lg ${getScoreColor(attempt.score)}`}>
                                {actualScore}/{maxScore}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <span className={`text-sm ${getScoreColor(attempt.score)}`}>
                                {attempt.score}%
                              </span>
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-300">
                              {formatTime(attempt.time_taken)}
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-300">
                              {formatDate(attempt.time_submitted || attempt.created_at)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}