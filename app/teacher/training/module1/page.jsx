"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import ExpandableVideo from "../../../../components/module_blocks/ExpandableVideo";
import {
  updateTeacherAccount,
  getTeacherData,
} from "../../../services/teacher_actions";

export default function TeacherTraining() {
  const router = useRouter();
  const [isModule1Completed, setIsModule1Completed] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const storedData = JSON.parse(sessionStorage.getItem("teacherData"));
        if (!storedData?.id) {
          console.error("No teacher ID found in sessionStorage");
          setIsLoading(false);
          return;
        }
        const result = await getTeacherData(storedData);
        if (result.success && result.data) {
          const freshData = result.data;
          setTeacherData(freshData);
          setIsModule1Completed(freshData.module1_training || false);
          sessionStorage.setItem("teacherData", JSON.stringify(freshData));
        } else {
          setTeacherData(storedData);
          setIsModule1Completed(storedData.module1_training || false);
        }
      } catch (error) {
        console.error("Error loading teacher data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeacherData();
  }, []);

  const handleModule1Completion = async () => {
    try {
      setIsModule1Completed(true);
      const result = await updateTeacherAccount({
        id: teacherData.id,
        module1_training: true
      });

      if (result.success) {
        const updatedData = { ...teacherData, premodule_training: true };
        setTeacherData(updatedData);
        sessionStorage.setItem("teacherData", JSON.stringify(updatedData));
        console.log("Pre-module training marked as complete!");
      } else {
        setIsModule1Completed(false);
      }
    } catch (error) {
      console.error("Error completing pre-module:", error);
      setIsModule1Completed(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading training data...</p>
        </div>
      </div>
    );
  }

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

            {/* Optional: Progress indicator or module info */}
            <div className="hidden sm:block text-sm text-gray-400">
            Module 1: Combining Solid Objects
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Module 1: The Importance of Spatial Skills
            </h1>
          </div>

          {/* Content Grid - Two Column on Large Screens */}
          <div className="space-y-6 lg:space-y-8">
            {/* Learning Intentions Section */}
            <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                Learning Intentions
              </h2>

     

              <div className="space-y-6">
                <p className="italic text-lg text-gray-300 bg-gray-700/30 p-4 rounded-lg border-l-4 border-blue-400">
                  Today, we are learning how 3D shapes can be combined to form a single object.
                </p>

                <div>
                  <p className="mb-4 text-lg font-medium text-gray-200">
                    By the end of this module, I will be able to:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-gray-300 leading-relaxed">
                    <li>Record, define and explain the keywords of the module.</li>
                    <li>Match two objects with the appropriate combined solid.</li>
                    <li>Identify the volume of interference from a combined solid.</li>
                    <li>Make a sketch of a composite solid.</li>
                  </ul>
                </div>
                <div className="bg-gray-700/30 p-6 rounded-lg">
                  <p className="mb-4 text-gray-200 font-medium">
                    Review the video below for an introduction to spatial skills
                    and their importance in various careers.
                  </p>
                  <ExpandableVideo
                    videoId="https://www.youtube.com/watch?v=Js_UC4fAZns"
                    title="Module 1 Introduction to Spatial Skills"
                    description="Learn how 3D shapes can be combined."
                  />
                </div>
              </div>
            </section>

            <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                Mini-Lecture

                </h2>
              </section>

            {/* Success Criteria Section */}
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
                  <ul className="list-disc pl-6 space-y-3 text-gray-300 leading-relaxed">
                    <li>Completed all the activities in my workbook.</li>
                    <li>Used the software to investigate the combined solids.</li>
                    <li>Verified the solutions for all the workbook activities by</li>
                    <li>Checking my answers with my partner.</li>
                    <li>Checking my answers with my teacher.</li>
                  </ul>
                </div>

                {/* I Can Section */}
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
                    <li>Explain the words: volume of interference; join; cut; intersect; combined.</li>
                    <li>Classify a combining operation.</li>
                    <li>Identify the correct volume of interference of two overlapping solids.</li>
                    <li>Sketch the edges of a composite solid obtained from a combining operation.</li>
                  </ul>
                  <div className="mt-6 pt-4 border-t border-gray-600">
                    <button
                      onClick={handleModule1Completion}
                      disabled={isModule1Completed}
                      className={`
        w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 
        ${
          isModule1Completed
            ? "bg-green-600 text-white cursor-default"
            : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] active:scale-[0.98]"
        }
      `}
                    >
                      {isModule1Completed ? (
                        <>
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
                          Module 1 Training Complete!
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Complete Module 1 Training
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Optional: Next Steps or Additional Resources */}
            <div className="flex justify-end pt-6">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center group"
                onClick={() => {
                  // Navigate to next module or complete action
                  console.log("Continue to next section");
                }}
              >
                Continue to Module 2
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
