"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { quizData } from "../../../../library/quiz_data/flat_patterns_quiz";
import TeacherTrainingPageResponsiveQuiz from "../../../../../components/teacher_components/TeacherTrainingPageResponsiveQuiz";
import { submitTeacherQuiz } from "../../../../library/services/teacher_actions";

export default function TeacherModulePage() {
  const router = useRouter();
  const [quizStarted, setQuizStarted] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

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
      if (sessionStorage.getItem("teacherData") !== null) {
        setTeacherData(JSON.parse(sessionStorage.getItem("teacherData")));
      }
    } catch (error) {
      console.error("Error parsing teacher data from sessionStorage:", error);
    }
  }, []);

  const handleQuizComplete = async (results) => {
    try {
      const payload = {
        teacherData: teacherData,
        quizData: results,
      };
     
      await submitTeacherQuiz(payload);
    } catch (error) {
      console.error("Error saving pretest results:", error);
    }
    setTimeout(() => {
      router.push("/teacher/training");
    }, 7000);
  };

  if (!quizStarted) {
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
                  Time Limit:
                </span>
                <span className="text-white font-medium">
                  {Math.floor((quizData.timeLimit || 600) / 60)} minutes
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
                  {quizData.questions.length > 1 ? " points" : " point"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Question Types:
                </span>
                <span className="text-white font-medium">Multiple Choice, Multiple Select</span>
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
                    Please read the following instructions before taking the quiz. This quiz consists of <span className="font-semibold text-white">15 questions</span> that are multiple choice and multiple select.
                  </p>
                </div>

                {/* Example 1 */}
                <div className="space-y-3">
                  <div 
                    className="relative group cursor-pointer"
                    onClick={() => handleImageClick("/quiz_images/surfaces_solids/surfacesSolids_question1.png", "Surfaces and Solids Example 1")}
                  >
                    <img
                      src="/quiz_images/surfaces_solids/surfacesSolids_question1.png"
                      alt="Combining Solids Example 1"
                      className="w-full h-auto rounded-lg border border-gray-700 transition-transform group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center">
                      <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-gray-200 font-medium">
                  Select the letter corresponding to the object or objects that were formed by revolving the wire-frame shape shown on the left about an axis. There may be more than one answer per problem.  </p>
                  </div>

                  <button
                    onClick={showAnswer1 ? null : openAnswer1}
                    disabled={showAnswer1}
                    className={`w-full bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-4 transition-all duration-200 ${
                      !showAnswer1 ? "cursor-pointer hover:bg-yellow-600/30" : "cursor-default"
                    }`}
                  >
                    {!showAnswer1 ? (
                      <p className="text-yellow-300 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Answer
                      </p>
                    ) : (
                      <div className="bg-green-600/20 border border-green-600/50 p-3 rounded-lg">
                        <p className="text-green-300 text-left">
                      
                          The answers are A and C. 
                        </p>
                      </div>
                    )}
                  </button>
                </div>

                {/* Example 2 */}
                <div className="space-y-3">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-gray-200 font-medium">
                  Indicate the axis about which the 2-D shape was revolved around to obtain the given solid.   </p>
                  </div>

                  <div 
                    className="relative group cursor-pointer"
                    onClick={() => handleImageClick("/quiz_images/surfaces_solids/surfacesSolids_question7_a.png", "Surfaces and Solids Example 2")}
                  >
                    <img
                      src="/quiz_images/surfaces_solids/surfacesSolids_question7_a.png"
                      alt="Surfaces and Solids Example 2"
                      className="w-full h-auto rounded-lg border border-gray-700 transition-transform group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center">
                      <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>

                  <button
                    onClick={showAnswer2 ? null : openAnswer2}
                    disabled={showAnswer2}
                    className={`w-full bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-4 transition-all duration-200 ${
                      !showAnswer2 ? "cursor-pointer hover:bg-yellow-600/30" : "cursor-default"
                    }`}
                  >
                    {!showAnswer2 ? (
                      <p className="text-yellow-300 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Answer
                      </p>
                    ) : (
                      <div className="bg-green-600/20 border border-green-600/50 p-3 rounded-lg">
                        <p className="text-green-300 text-left">
                       The object was revolved about the X axis.   </p>
                       These types of questions may also involve the degrees of rotation (90, 180, 270, 360), and the axis of rotation.
                      </div>
                    )}
                  </button>
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
                  Got it, Close
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

  return (
    <TeacherTrainingPageResponsiveQuiz
      teacherData={teacherData}
      quizData={quizData}
      onQuizComplete={handleQuizComplete}
    />
  );
}