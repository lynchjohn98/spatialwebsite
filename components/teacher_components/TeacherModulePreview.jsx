// app/teacher/dashboard/modules/preview/[id]/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ExpandableVideo from "../../../../../../components/module_blocks/ExpandableVideo";
import ExpandableWebpage from "../../../../../../components/module_blocks/ExpandableWebpage";

export default function TeacherModulePreview() {
  const router = useRouter();
  const params = useParams();
  const moduleId = params.id;
  
  const [courseData, setCourseData] = useState(null);
  const [teacherProgress, setTeacherProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Module configurations - same as student view
  const moduleConfigs = {
    1: {
      number: 1,
      title: "The Importance of Spatial Skills",
      learningIntention: "Today, we are learning about the importance of spatial thinking skills for success in many careers",
      learningOutcomes: [
        "Describe what is meant by spatial skills",
        "Describe the various intelligences and how spatial thinking fits within this structure",
        "List various careers for which spatial skills are important",
        "List various careers for which spatial skills are not so important"
      ],
      introVideoUrl: "https://www.youtube.com/watch?v=hlOxMQLrqOw",
      successCriteria: {
        iHave: [
          "Completed all activities in my workbook",
          "Listed careers I am interested in and whether or not they require spatial thinking skills"
        ],
        iCan: [
          "Explain the words: spatial skills; spatial intelligence",
          "Describe the types of spatial thinking required for various occupations",
          "Determine if spatial skills are required for various professions",
          "Describe how spatial thinking skills are used in my everyday life"
        ]
      }
    },
    2: {
      number: 2,
      title: "Surfaces and Solids of Revolution",
      learningIntention: "Today, we are learning about how 2D shapes can be revolved around an axis to form a 3D Solid",
      learningOutcomes: [
        "Record, define and explain the keywords of the module",
        "Choose the appropriate 3D shape from the revolution of a given 2D shape",
        "Choose the appropriate 2D shape from a given 3D diagram",
        "Identify the axis of revolution"
      ],
      introVideoUrl: "https://www.youtube.com/watch?v=1jP0TxSbEmQ",
      miniLectureUrl: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174459909",
      gettingStartedVideos: [
        { url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/177263869", title: "Video 1" }
      ],
      interactiveSoftwareUrl: "https://www.higheredservices.org/HES01/Module_1/module_1_theme_1.html",
      successCriteria: {
        iHave: [
          "Completed all activities in my workbook",
          "Reviewed the introduction video",
          "Reviewed the Mini-Lectures",
          "Reviewed the Getting Started videos",
          "Reviewed the interactive software",
          "Attempted the Module Quiz"
        ],
        iCan: [
          "Explain the words: Revolve, About an axis, Axis of revolution",
          "Take a 2D shape and revolve it about any axis",
          "Identify the axis of revolution given a 2D shape and a 3D object",
          "Write down the number of degrees that a shape was revolved",
          "Select a 2D shape from a given 3D object"
        ]
      }
    }
    // Add more module configurations as needed
  };

  useEffect(() => {
    const loadData = async () => {
      const storedCourseData = sessionStorage.getItem("courseData");
      const storedTeacherData = sessionStorage.getItem("teacherData");
      
      if (storedCourseData) {
        setCourseData(JSON.parse(storedCourseData));
      }
      
      if (storedTeacherData) {
        const teacherData = JSON.parse(storedTeacherData);
        // Load teacher progress if needed
        const progressData = sessionStorage.getItem("moduleProgress");
        if (progressData) {
          setTeacherProgress(JSON.parse(progressData));
        }
      }
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  const moduleConfig = moduleConfigs[moduleId] || moduleConfigs[1];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading preview...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      {/* Preview Header */}
      <div className="w-full bg-yellow-600 text-black">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              📚 Teacher Preview Mode - This is how students will see Module {moduleConfig.number}
            </p>
            <button
              onClick={() => router.push("/teacher/dashboard/modules")}
              className="text-sm underline hover:no-underline"
            >
              Exit Preview
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="w-full bg-gray-800/50 border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/teacher/dashboard/modules")}
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
              <span className="font-medium">Back to Modules</span>
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/teacher/training/module${moduleId}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Go to Training
              </button>
              <button
                onClick={() => router.push(`/teacher/training/module${moduleId}/quiz`)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Take Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Student View */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                Module {moduleConfig.number}: {moduleConfig.title}
              </h1>
            </div>

            <div className="space-y-6 lg:space-y-8">
              {/* Learning Intentions Section */}
              <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                  Learning Intentions
                </h2>

                <div className="space-y-6">
                  <p className="italic text-lg text-gray-300 bg-gray-700/30 p-4 rounded-lg border-l-4 border-blue-400">
                    {moduleConfig.learningIntention}
                  </p>

                  <div>
                    <p className="mb-4 text-lg font-medium text-gray-200">
                      By the end of this module, I will be able to:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-gray-300 leading-relaxed">
                      {moduleConfig.learningOutcomes.map((outcome, index) => (
                        <li key={index}>{outcome}</li>
                      ))}
                    </ul>
                  </div>

                  {moduleConfig.introVideoUrl && (
                    <div className="bg-gray-700/30 p-6 rounded-lg">
                      <p className="mb-4 text-gray-200 font-medium">
                        Review the video below for an introduction to Module {moduleConfig.number}.
                      </p>
                      <ExpandableVideo
                        videoId={moduleConfig.introVideoUrl}
                        title={`Module ${moduleConfig.number}: ${moduleConfig.title}`}
                        description="Introduction video for this module"
                      />
                    </div>
                  )}
                </div>
              </section>

              {/* Mini-Lectures Section (if available) */}
              {moduleConfig.miniLectureUrl && (
                <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                    Mini-Lectures
                  </h2>
                  <ExpandableWebpage
                    url={moduleConfig.miniLectureUrl}
                    title={`Module ${moduleConfig.number}: Mini-Lecture`}
                  />
                </section>
              )}

              {/* Getting Started Videos (if available) */}
              {moduleConfig.gettingStartedVideos && (
                <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                    Getting Started Videos
                  </h2>
                  <ul className="space-y-4">
                    {moduleConfig.gettingStartedVideos.map((video, index) => (
                      <ExpandableWebpage
                        key={index}
                        url={video.url}
                        title={video.title}
                      />
                    ))}
                  </ul>
                </section>
              )}

              {/* Interactive Software (if available) */}
              {moduleConfig.interactiveSoftwareUrl && (
                <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                    Interactive Software
                  </h2>
                  <ExpandableWebpage
                    url={moduleConfig.interactiveSoftwareUrl}
                    title={`Module ${moduleConfig.number}: Interactive Software`}
                  />
                </section>
              )}

              {/* Workbook Activities Section */}
              <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                  Workbook Activities
                </h2>
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <p className="text-gray-300">
                    Students will complete workbook activities for this module.
                  </p>
                </div>
              </section>

              {/* Module Quiz Section */}
              <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                  Module Quiz
                </h2>
                <div className="bg-gray-700/30 p-6 rounded-lg">
                  <button
                    onClick={() => router.push(`/teacher/training/module${moduleId}/quiz`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
                  >
                    Preview Quiz as Teacher
                  </button>
                </div>
              </section>

              {/* Success Criteria Section */}
              <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                  Success Criteria
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gray-700/30 p-6 rounded-lg">
                    <p className="font-semibold mb-4 text-lg text-blue-200">
                      I have:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-gray-300">
                      {moduleConfig.successCriteria.iHave.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-700/30 p-6 rounded-lg">
                    <p className="font-semibold mb-4 text-lg text-blue-200">
                      I can:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-gray-300">
                      {moduleConfig.successCriteria.iCan.map((item, index) => (
                        <li key={index}>{item}</li>
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