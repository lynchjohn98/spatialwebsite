"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/Sidebar";

export default function ModulePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkWindowSize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", checkWindowSize);
    checkWindowSize();

    const loadData = () => {
      const storedData = sessionStorage.getItem("courseData");
      if (storedData) {
        try {
          setCourseData(JSON.parse(storedData));
        } catch (error) {
          console.error("Error parsing course data:", error);
          router.push("/teacher-join");
        }
      } else {
        router.push("/teacher-join");
      }

      setIsLoading(false);
    };

    loadData();

    return () => window.removeEventListener("resize", checkWindowSize);
  }, [router]);

  const returnToModules = () => {
    router.push("/teacher-dashboard/modules");
  };

  if (isLoading || !courseData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white text-xl font-bold">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        courseData={courseData}
      />

      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-1/4" : ""
        }`}
      >
        <div className="lg:hidden mb-6 pt-8">
          {/* Space for hamburger button on mobile */}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Back button above the title */}
          <button
            onClick={returnToModules}
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

          <h1 className="text-2xl md:text-3xl font-bold mb-8">
            Pre-Module: The Importance of Spatial Skills
          </h1>

          {/* Learning Intentions section */}
          <section className="mb-8 bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4 text-blue-300 border-b border-gray-700 pb-2">
              Learning Intentions
            </h2>
            <p className="italic mb-4 text-gray-300">
              Today, we are learning about the importance of spatial thinking
              skills for success in many careers
            </p>
            <p className="mb-4">
              By the end of this module, I will be able to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Describe what is meant by spatial skills</li>
              <li>
                Describe the various intelligences and how spatial thinking
                fits within this structure
              </li>
              <li>
                List various careers for which spatial skills are important
              </li>
              <li>
                List various careers for which spatial skills are not so
                important
              </li>
            </ul>
          </section>

          {/* Success Criteria section */}
          <section className="mb-8 bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4 text-blue-300 border-b border-gray-700 pb-2">
              Success Criteria
            </h2>
            <p className="font-medium mb-2 text-blue-200">I have:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Completed all activities in my workbook.</li>
              <li>
                Listed careers I am interested in and whether or not they
                require spatial thinking skills
              </li>
            </ul>
            <p className="font-medium mb-2 text-blue-200">I can:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Explain the words: spatial skills; spatial intelligence.
              </li>
              <li>
                Describe the types of spatial thinking required for various
                occupations.
              </li>
              <li>
                Determine if spatial skills are required for various
                professions.
              </li>
              <li>
                Describe how spatial thinking skills are used in my everyday
                life.
              </li>
            </ul>
          </section>

          {/* Let's Get Started section */}
          <section className="mb-8 bg-gray-800 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4 text-blue-300 border-b border-gray-700 pb-2">
              Let's Get Started
            </h2>
            <ol className="list-decimal pl-6 space-y-4 mb-4">
              <li className="pl-2">
                <span className="font-medium">Take the PSVT:R Pre-Test</span>
              </li>
              <li className="pl-2">
                <span className="font-medium">Take the DAT:SR Pre-Test</span>
              </li>
              <li className="pl-2">
                <span className="font-medium">Take the Math Instrument Pre-Test</span>
              </li>
              <li className="pl-2">
                <span className="font-medium">
                  Do the reading for the module and complete the workbook pages
                  as assigned by your teacher.
                </span>
              </li>
            </ol>
          </section>
        </div>
      </main>
    </div>
  );
}