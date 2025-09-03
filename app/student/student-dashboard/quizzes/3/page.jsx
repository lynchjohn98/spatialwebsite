"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import StudentResponsiveQuiz from "../../../../../components/student_components/StudentResponsiveQuiz";
import { quizData } from "../../../../library/quiz_data/math_instrument_pre";
import { submitStudentPrePostQuiz } from "../../../../library/services/student_services/student_quiz";


export default function MathematicsPreTest() {

  const router = useRouter();
  const [quizStarted, setQuizStarted] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [quizVisible, setQuizVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessMessage, setAccessMessage] = useState("");

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const openInstructionsModal = () => {
    setShowInstructionsModal(true);
  };

  const openAnswer1 = () => {
    setShowAnswer1(true);
  };

  const openAnswer2 = () => {
    setShowAnswer2(true);
  };

  const closeInstructionsModal = () => {
    setShowInstructionsModal(false);
    setShowAnswer1(false);
    setShowAnswer2(false);
  };

  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      closeInstructionsModal();
    }
  };

  const handleImageClick = (imageSrc, imageAlt) => {
    setZoomedImage({ src: imageSrc, alt: imageAlt });
  };

  const closeZoomedImage = () => {
    setZoomedImage(null);
  };

  const handleZoomBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeZoomedImage();
    }
  };

  useEffect(() => {
    try {
      // Load student data
      if (sessionStorage.getItem("studentData") !== null) {
        setStudentData(JSON.parse(sessionStorage.getItem("studentData")));
      }
      
      // Load course data and check quiz visibility
      if (sessionStorage.getItem("courseData") !== null) {
        const courseData = JSON.parse(sessionStorage.getItem("courseData"));
        console.log(courseData);
        
        // Check if quiz settings exist and find the "Math Instrument Pre-Test" quiz
        if (courseData?.settings?.quiz_settings) {
          const mathInstrumentPreTestQuiz = courseData.settings.quiz_settings.find(
            quiz => quiz.name === "Math Instrument Pre-Test"
          );

          if (mathInstrumentPreTestQuiz) {
            // Check visibility
            if (mathInstrumentPreTestQuiz.visibility === "Yes") {
              setQuizVisible(true);
              setIsLoading(false);
            } else {
              // Quiz is not visible, set message and redirect
              setQuizVisible(false);
              setAccessMessage("This quiz is not currently available. Please check back later or contact your instructor.");
              setIsLoading(false);
              
              // Redirect after showing message for 3 seconds
              setTimeout(() => {
                router.push("/student/student-dashboard/");
              }, 3000);
            }
          } else {
            // Quiz not found in settings
            setAccessMessage("Quiz configuration not found. Please contact your instructor.");
            setIsLoading(false);
            setTimeout(() => {
              router.push("/student/student-dashboard/");
            }, 3000);
          }
        } else {
          // No quiz settings found
          setAccessMessage("Unable to load quiz settings. Please try again later.");
          setIsLoading(false);
          setTimeout(() => {
            router.push("/student/student-dashboard/");
          }, 3000);
        }
      } else {
        // No course data found
        setAccessMessage("Course data not found. Please log in again.");
        setIsLoading(false);
        setTimeout(() => {
          router.push("/student/student-dashboard/");
        }, 3000);
      }
    } catch (error) {
      console.error("Error parsing data from sessionStorage:", error);
      setAccessMessage("An error occurred while loading the quiz. Please try again.");
      setIsLoading(false);
      setTimeout(() => {
        router.push("/student/student-dashboard/");
      }, 3000);
    }
  }, [router]);

  const handleQuizComplete = async (results) => {
    try {
      const payload = {
        studentData: studentData,
        quizData: results,
      };
     
      await submitStudentPrePostQuiz(payload);
    } catch (error) {
      console.error("Error saving pretest results:", error);
    }
    setTimeout(() => {
      router.push("/student/student-dashboard/");
    }, 7000);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl shadow-xl p-8 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-300">Checking quiz availability...</p>
        </div>
      </div>
    );
  }

  // Show access denied message
  if (!quizVisible && accessMessage) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl shadow-xl p-8 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Quiz Not Available</h2>
          <p className="text-gray-300 mb-4">{accessMessage}</p>
          <p className="text-gray-400 text-sm">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Only show quiz content if visibility check passed and not yet started
  if (!quizStarted && quizVisible) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl shadow-xl p-8 max-w-lg w-full">
          {/* Quiz Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">{quizData.title}</h1>
            <p className="text-gray-300 leading-relaxed">{quizData.description}</p>
          </div>

          {/* Quiz Stats */}
          <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100 4h2a1 1 0 100 2 2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z" clipRule="evenodd" />
                  </svg>
                  Questions:
                </span>
                <span className="text-white font-medium">{quizData.questions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                 No Time Limit
                </span>
                
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Total Points:
                </span>
                <span className="text-white font-medium">
                  {quizData.questions.reduce((sum, q) => sum + q.points, 0)}
                </span>
              </div>
              
            </div>
          </div>

          {/* Instructions Button */}
          <button
            onClick={openInstructionsModal}
            className="w-full bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-4 mb-6 hover:bg-yellow-600/30 transition-all duration-200 group"
          >
            <p className="text-yellow-300 group-hover:text-yellow-200 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Instructions
            </p>
          </button>

          {/* Start Button */}
          <button
            onClick={startQuiz}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Quiz
          </button>
        </div>

        {/* Instructions Modal */}
        {showInstructionsModal && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={handleBackdropClick}
          >
            <div className="bg-gray-800/95 border border-gray-700 rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-slideUp">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quiz Instructions
                </h2>
                <button
                  onClick={closeInstructionsModal}
                  className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg p-1 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-6">
                <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                  <p className="text-gray-200 leading-relaxed">
                  The following test will contain 8 mathematical questions. Please click the button below when you are ready to begin. Leaving the page or closing the browser will automatically submit the quiz  </p>
                </div>

              
                {/* Ready Message */}
                <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 mt-6">
                  <p className="text-gray-200 text-center leading-relaxed">
                    When you are ready, please close this window and click "Start Quiz" to begin. </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeInstructionsModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                 Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Zoomed Image Modal */}
        {zoomedImage && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fadeIn"
            onClick={handleZoomBackdropClick}
          >
            <div className="relative max-w-[90vw] max-h-[90vh] animate-zoomIn">
              <button
                onClick={closeZoomedImage}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={zoomedImage.src}
                alt={zoomedImage.alt}
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
              />
              <p className="text-center text-gray-300 mt-2 text-sm">{zoomedImage.alt}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show quiz component if started and visible
  if (quizStarted && quizVisible) {
    return (
      <StudentResponsiveQuiz
        studentData={studentData}
        quizData={quizData}
        onQuizComplete={handleQuizComplete}
      />
    );
  }

  // Fallback (should not reach here)
  return null;
}