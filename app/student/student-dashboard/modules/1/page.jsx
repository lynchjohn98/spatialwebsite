"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStudentSidebar } from "../../../../utils/hooks/useStudentSidebar";
import StudentSidebar from "../../../../../components/student_components/StudentSidebar";
import ExpandableVideo from "../../../../../components/module_blocks/ExpandableVideo";
import ExpandableWebpage from "../../../../../components/module_blocks/ExpandableWebpage";

export default function StudentModulePage() {
  const router = useRouter();
  const params = useParams();
  const { isSidebarOpen, setIsSidebarOpen } = useStudentSidebar();
  const [courseData, setCourseData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [workbookCompleted, setWorkbookCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedCourseData = sessionStorage.getItem("courseData");
    const storedStudentData = sessionStorage.getItem("studentData");
    if (storedCourseData && storedStudentData) {
      try {
        const parsedCourseData = JSON.parse(storedCourseData);
        const parsedStudentData = JSON.parse(storedStudentData);
        setCourseData(parsedCourseData);
        setStudentData(parsedStudentData);
      } catch (error) {
        console.error("Error parsing session storage data:", error);
        sessionStorage.removeItem("courseData");
        sessionStorage.removeItem("studentData");
        router.push("/student/student-join");
      }
    } else {
      router.push("/student/student-join");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <StudentSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        courseData={courseData}
        studentData={studentData}
      />
      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-1/4" : ""
        }`}
      >
        <div className="lg:hidden mb-6 pt-8"></div>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/student/student-dashboard/modules")}
            className="flex items-center text-white hover:text-blue-300 transition-colors mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Return to Modules
          </button>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 sm:mb-12">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                  Pre-Module: The Importance of Spatial Skills
                </h1>
              </div>
              <div className="space-y-6 lg:space-y-8">
                <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                    Learning Intentions
                  </h2>

                  <div className="space-y-6">
                    <p className="italic text-lg text-gray-300 bg-gray-700/30 p-4 rounded-lg border-l-4 border-blue-400">
                      Today, we are learning about the importance of spatial
                      thinking skills for success in many careers
                    </p>

                    <div>
                      <p className="mb-4 text-lg font-medium text-gray-200">
                        By the end of this module, I will be able to:
                      </p>
                      <ul className="list-disc pl-6 space-y-3 text-gray-300 leading-relaxed">
                        <li>Describe what is meant by spatial skills</li>
                        <li>
                          Describe the various intelligences and how spatial
                          thinking fits within this structure
                        </li>
                        <li>
                          List various careers for which spatial skills are
                          important
                        </li>
                        <li>
                          List various careers for which spatial skills are not
                          so important
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-700/30 p-6 rounded-lg">
                      <p className="mb-4 text-gray-200 font-medium">
                        Review the video below for an introduction to spatial
                        skills and their importance in various careers.
                      </p>
                      <ExpandableVideo
                        videoId="https://www.youtube.com/watch?v=hlOxMQLrqOw"
                        title="Introduction to Spatial Skills"
                        description="Learn about the importance of spatial skills in various fields."
                      />
                    </div>
                  </div>
                </section>

                {/* Workbook Activities Section with Checkbox */}
             <section className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-300 border-b border-gray-600 pb-3">
                Complete the Workbook Activities
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-300 mb-4">
                  Download and complete the Module 1 workbook activities. These exercises will help reinforce 
                  your understanding of combining solid objects and spatial visualization.
                </p>
                
                {/* Checkbox for workbook completion */}
                <label 
                  htmlFor="workbook-completed" 
                  className="flex items-start gap-3 bg-gray-700/30 p-4 rounded-lg cursor-pointer hover:bg-gray-700/40 transition-colors"
                >
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      id="workbook-completed"
                      type="checkbox"
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                      checked={workbookCompleted}
                      onChange={(e) => handleWorkbookToggle(e.target.checked)}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-200">
                      I have completed all workbook activities
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Check this box once you've finished all exercises in the Module 1 workbook
                    </p>
                  </div>
                </label>

                {workbookCompleted && (
                  <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Workbook activities marked as complete!</span>
                  </div>
                )}
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
                      <ul className="list-disc pl-6 space-y-3 text-gray-300 leading-relaxed">
                        <li>Completed all activities in my workbook.</li>
                        <li>
                          Listed careers I am interested in and whether or not
                          they require spatial thinking skills
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
                        <li>
                          Explain the words: spatial skills; spatial
                          intelligence.
                        </li>
                        <li>
                          Describe the types of spatial thinking required for
                          various occupations.
                        </li>
                        <li>
                          Determine if spatial skills are required for various
                          professions.
                        </li>
                        <li>
                          Describe how spatial thinking skills are used in my
                          everyday life.
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                

           </div>
         </div>
          </div>
        </div>
      </main>
    </div>
  );
}


