"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ExpandableVideo from "../../../../components/module_blocks/ExpandableVideo";
import ExpandableWebpage from "../../../../components/module_blocks/ExpandableWebpage"
import { updateTeacherModuleProgress } from "../../../library/services/teacher_actions";

export default function TeacherModulePage() {
  // ============ MODULE CONFIGURATION - CHANGE THESE VALUES ============
  const MODULE_CONFIG = {
    number: 5,
    title:  "Rotation of Objects About a Single Axis",
    shortTitle: "Rotation of Objects About a Single Axis", // For the navbar
    
    // Learning content
    learningIntention: "Today, we are learning to rotate objects about one axis.",
    learningOutcomes: [
      "Record, define and explain the keywords for this module.",
      "Recognise positive and negative rotations.",
      "Identify rotated objects given their image.",
      "Rotate an object about a given axis.",
      "Sketch an object after it has been rotated by a given amount."
    ],
    
    // Success criteria "I can" statements
    successCriteria: [
      "Explain the keywords: Positive rotation, Negative rotation, Magnitude, Right-hand rule, Clockwise, Counterclockwise, Anticlockwise, Equivalent Rotation code.",
      "Identify correctly a rotated object.",
      "Write down the degrees of rotation and arrow sequence for a given rotation.",
      "Identify the planes of symmetry of a given object.",
      "Sketch a rotated object, following a given rotation."
    ],
    
    // Video and resource URLs
    introVideoUrl: "https://www.youtube.com/watch?v=1jP0TxSbEmQ",
    miniLectureUrl: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174521439",
    gettingStartedVideos: [
      { url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171026502", title: "Video 1" },
      { url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171026504", title: "Video 2" },
      { url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/177261289", title: "Video 3" },
      { url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030423", title: "Video 4" },
      { url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172111782", title: "Video 5" },
      { url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172113637", title: "Video 6" }
    ],
    interactiveSoftwareUrl: "https://www.higheredservices.org/HES01/Module_7/module_7_theme_1.html"
  };
  // ====================================================================

  const router = useRouter();
  const [teacherData, setTeacherData] = useState(null);
  const [moduleProgressData, setModuleProgressData] = useState(null);

  // Individual checkbox states
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [softwareCompleted, setSoftwareCompleted] = useState(false);
  const [workbookCompleted, setWorkbookCompleted] = useState(false);
  const [miniLectureCompleted, setMiniLectureCompleted] = useState(false);
  const [gettingStartedCompleted, setGettingStartedCompleted] = useState(false);
  const [introductionVideoCompleted, setIntroductionVideoCompleted] = useState(false);

 useEffect(() => {
    const storedTeacherData = sessionStorage.getItem("teacherData");
    const storedModuleData = sessionStorage.getItem("moduleProgress");
    if (storedTeacherData && storedModuleData) {
      try {
        const parsedTeacherData = JSON.parse(storedTeacherData);
        const parsedModuleData = JSON.parse(storedModuleData);
        const allModules = sessionStorage.getItem("moduleProgress");
        setTeacherData(parsedTeacherData);
        setModuleProgressData(allModules[MODULE_CONFIG.title]);
        const moduleProgress = parsedModuleData;
        if (moduleProgress) {
          const moduleData = moduleProgress[MODULE_CONFIG.title];
          setQuizCompleted(moduleData.quiz || false);
          setSoftwareCompleted(moduleData.software || false);
          setWorkbookCompleted(moduleData.workbook || false);
          setMiniLectureCompleted(moduleData.mini_lecture || false);
          setGettingStartedCompleted(moduleData.getting_started || false);
          setIntroductionVideoCompleted(moduleData.introduction_video || false);
        }
        console.log("Video boolean:", introductionVideoCompleted);
      } catch (error) {
        console.error("Error parsing session storage data:", error);
        router.push("/teacher/training");
      }
    } else {
      router.push("/teacher/training");
    }
  }, [router]);

  // Each item below is a specific section update for the backend
  const handleQuizToggle = async (checked) => {
    setQuizCompleted(checked);
    const result = await updateTeacherModuleProgress(
      teacherData.id,
      MODULE_CONFIG.title,
      "quiz",
      checked
    );
  };

  const handleSoftwareToggle = async (checked) => {
    setSoftwareCompleted(checked);
    const result = await updateTeacherModuleProgress(
      teacherData.id,
      MODULE_CONFIG.title,
      "software",
      checked
    );
  };

  const handleMiniLectureToggle = async (checked) => {
    setMiniLectureCompleted(checked);
    const result = await updateTeacherModuleProgress(
      teacherData.id,
      MODULE_CONFIG.title,
      "mini_lecture",
      checked
    );
  };

  const handleGettingStartedToggle = async (checked) => {
    setGettingStartedCompleted(checked);
    const result = await updateTeacherModuleProgress(
      teacherData.id,
      MODULE_CONFIG.title,
      "getting_started",
      checked
    );
  };

  const handleIntroductionVideoToggle = async (checked) => {
    setIntroductionVideoCompleted(checked);
    const result = await updateTeacherModuleProgress(
      teacherData.id,
      MODULE_CONFIG.title,
      "introduction_video",
      checked
    );
  };

  const handleWorkbookToggle = async (checked) => {
    setWorkbookCompleted(checked);
    const result = await updateTeacherModuleProgress(
      teacherData.id,
      MODULE_CONFIG.title,
      "workbook",
      checked
    );
  };

  return (
  <div className="min-h-screen w-full bg-gray-900 text-white">
    {/* Top Navigation Bar */}
    <div className="w-full bg-gray-800/50 border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => router.push("/teacher/training")}
            className="flex items-center text-gray-300 hover:text-white transition-colors group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
            <span className="font-medium">Return to Training List</span>
          </button>

          {/* Module info */}
          <div className="hidden sm:block text-sm text-gray-400">
            Module {MODULE_CONFIG.number}: {MODULE_CONFIG.shortTitle}
          </div>
        </div>
      </div>
    </div>

    {/* Main Content Container */}
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Module {MODULE_CONFIG.number}: {MODULE_CONFIG.title}
            </h1>
          </div>
          <div className="space-y-6 lg:space-y-8">
            <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                Learning Intentions
              </h2>

              <div className="space-y-6">
                <p className="italic text-lg text-gray-300 bg-gray-700/30 p-4 rounded-lg border-l-4 border-blue-400">
                  {MODULE_CONFIG.learningIntention}
                </p>

                <div>
                  <p className="mb-4 text-lg font-medium text-gray-200">
                    By the end of this module, I will be able to:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-gray-300 leading-relaxed">
                    {MODULE_CONFIG.learningOutcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-700/30 p-6 rounded-lg">
                  <p className="mb-4 text-gray-200 font-medium">
                    Review the video below for an introduction to Module {MODULE_CONFIG.number}.
                  </p>
                  <ExpandableVideo
                    videoId={MODULE_CONFIG.introVideoUrl}
                    title={`Module ${MODULE_CONFIG.number} ${MODULE_CONFIG.shortTitle}`}
                    description="Learn how 3D shapes can be combined."
                  />
                </div>

                {/* Checkbox for introduction video completion */}
                <label
                  htmlFor="introduction_video"
                  className="flex items-start gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer hover:bg-gray-700/40 transition-colors"
                >
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      id="introduction_video"
                      type="checkbox"
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                      checked={introductionVideoCompleted}
                      onChange={(e) =>
                        handleIntroductionVideoToggle(e.target.checked)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-200">
                      I have reviewed the introduction video.
                    </div>
                  </div>
                </label>
              </div>

              {introductionVideoCompleted && (
                <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Introduction video completed</span>
                </div>
              )}
            </section>

            <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                Mini-Lectures
              </h2>

              <div className="space-y-4">
                <ExpandableWebpage
                  url={MODULE_CONFIG.miniLectureUrl}
                  title={`Module ${MODULE_CONFIG.number}: ${MODULE_CONFIG.shortTitle}`}
                />
                
                {/* Checkbox for mini-lecture completion */}
                <label 
                  htmlFor="mini-lecture" 
                  className="flex items-start gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer hover:bg-gray-700/40 transition-colors"
                >
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      id="mini-lecture"
                      type="checkbox"
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                      checked={miniLectureCompleted}
                      onChange={(e) => handleMiniLectureToggle(e.target.checked)}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-200">
                      I have completed the mini-lecture
                    </div>
                  </div>
                </label>

                {miniLectureCompleted && (
                  <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Mini Lectures completed.</span>
                  </div>
                )}
              </div>
            </section>

            {/* Getting Started Videos Section with Checkbox */}
            <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                Review the Getting Started Videos:
              </h2>

              <div className="space-y-4">
                <ul className="mb-6 space-y-4">
                  {MODULE_CONFIG.gettingStartedVideos.map((video, index) => (
                    <ExpandableWebpage
                      key={index}
                      url={video.url}
                      title={`Module ${MODULE_CONFIG.number}: ${video.title}`}
                    />
                  ))}
                </ul>

                {/* Checkbox for videos completion */}
                <label 
                  htmlFor="getting-started-completed" 
                  className="flex items-start gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer hover:bg-gray-700/40 transition-colors"
                >
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      id="getting-started-completed"
                      type="checkbox"
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                      checked={gettingStartedCompleted}
                      onChange={(e) => handleGettingStartedToggle(e.target.checked)}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-200">
                      I have watched the getting started videos.
                    </div>
                  </div>
                </label>

                {gettingStartedCompleted && (
                  <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Getting Started completed.</span>
                  </div>
                )}
              </div>
            </section>

            {/* Interactive Software Section with Checkbox */}
            <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                Review the Interactive Software
              </h2>
              
              <div className="space-y-4">
                <ExpandableWebpage
                  url={MODULE_CONFIG.interactiveSoftwareUrl}
                  title={`Module ${MODULE_CONFIG.number}: Interactive Software`}
                />

                {/* Checkbox for software completion */}
                <label 
                  htmlFor="software-completed" 
                  className="flex items-start gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer hover:bg-gray-700/40 transition-colors"
                >
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      id="software-completed"
                      type="checkbox"
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                      checked={softwareCompleted}
                      onChange={(e) => handleSoftwareToggle(e.target.checked)}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-200">
                      I have completed the interactive software review
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Check this box after exploring the interactive software
                    </p>
                  </div>
                </label>

                {softwareCompleted && (
                  <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Interactive software marked as complete!</span>
                  </div>
                )}
              </div>
            </section>

            {/* Workbook Activities Section with Checkbox */}
            <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                Complete the Workbook Activities
              </h2>

              {/* Checkbox for workbook completion */}
              <div className="space-y-4">
                <label
                  htmlFor="workbook"
                  className="flex items-start gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer hover:bg-gray-700/40 transition-colors"
                >
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      id="workbook"
                      type="checkbox"
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                      checked={workbookCompleted}
                      onChange={(e) =>
                        handleWorkbookToggle(e.target.checked)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-200">
                      I have completed all workbook activities
                    </div>
                  </div>
                </label>

                {workbookCompleted && (
                  <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Workbook activities completed</span>
                  </div>
                )}
              </div>
            </section>

            {/* Module Quiz Section with Link */}
            <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                Attempt the Module {MODULE_CONFIG.number} Quiz
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-700/30 p-6 rounded-lg">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center group hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    {quizCompleted ? 'Retake Quiz' : 'Start Quiz'}
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Checkbox for quiz completion */}
                <div className="space-y-4">
                  <label
                    htmlFor="quiz"
                    className="flex items-start gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer hover:bg-gray-700/40 transition-colors"
                  >
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        id="quiz"
                        type="checkbox"
                        className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                        checked={quizCompleted}
                        onChange={(e) =>
                          handleQuizToggle(e.target.checked)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-200">
                        I have attempted the quiz at least once
                      </div>
                    </div>
                  </label>

                  {quizCompleted && (
                    <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Quiz attempted at least once</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                Success Criteria
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-700/30 p-6 rounded-lg">
                  <p className="font-semibold mb-4 text-lg text-blue-200 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    I have:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 leading-relaxed">
                    <li
                      className={`flex items-start ${
                        workbookCompleted
                          ? "text-green-400"
                          : "text-gray-300"
                      }`}
                    >
                      <span className="flex-1">
                        Completed all activities in my workbook.
                      </span>
                      {workbookCompleted && (
                        <svg
                          className="w-5 h-5 ml-2 flex-shrink-0 text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </li>
                    <li
                      className={`flex items-start ${
                        introductionVideoCompleted
                          ? "text-green-400"
                          : "text-gray-300"
                      }`}
                    >
                      <span className="flex-1">
                        Reviewed the introduction video.
                      </span>
                      {introductionVideoCompleted && (
                        <svg
                          className="w-5 h-5 ml-2 flex-shrink-0 text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </li>

                    <li
                      className={`flex items-start ${
                        miniLectureCompleted
                          ? "text-green-400"
                          : "text-gray-300"
                      }`}
                    >
                      <span className="flex-1">
                        Reviewed the Mini-Lectures.
                      </span>
                      {miniLectureCompleted && (
                        <svg
                          className="w-5 h-5 ml-2 flex-shrink-0 text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </li>

                    <li
                      className={`flex items-start ${
                        gettingStartedCompleted
                          ? "text-green-400"
                          : "text-gray-300"
                      }`}
                    >
                      <span className="flex-1">
                        Reviewed the Getting Started videos.
                      </span>
                      {gettingStartedCompleted && (
                        <svg
                          className="w-5 h-5 ml-2 flex-shrink-0 text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </li>

                    <li
                      className={`flex items-start ${
                        softwareCompleted
                          ? "text-green-400"
                          : "text-gray-300"
                      }`}
                    >
                      <span className="flex-1">
                        Reviewed the interactive software.
                      </span>
                      {softwareCompleted && (
                        <svg
                          className="w-5 h-5 ml-2 flex-shrink-0 text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </li>

                    <li
                      className={`flex items-start ${
                        quizCompleted
                          ? "text-green-400"
                          : "text-gray-300"
                      }`}
                    >
                      <span className="flex-1">
                       Attempted the Module Quiz.
                      </span>
                      {quizCompleted && (
                        <svg
                          className="w-5 h-5 ml-2 flex-shrink-0 text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-700/30 p-6 rounded-lg">
                  <p className="font-semibold mb-4 text-lg text-blue-200 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        clipRule="evenodd"
                      />
                    </svg>
                    I can:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-gray-300 leading-relaxed">
                    {MODULE_CONFIG.successCriteria.map((criteria, index) => (
                      <li key={index}>{criteria}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}