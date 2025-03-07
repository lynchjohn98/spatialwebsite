"use client";
import { useModulePage } from "../../../../utils/helpers";
import Sidebar from "../../../../components/Sidebar";
import ReturnButton from "../../../../components/ReturnButton";
import LearningIntentions from "../../../../components/LearningIntentions";
import SuccessCriteria from "../../../../components/SuccessCriteria";
import GetStarted from "../../../../components/GetStarted";

export default function Page() {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    courseData,
    isLoading,
    LoadingComponent,
  } = useModulePage();

  if (isLoading || !courseData) {
    return <LoadingComponent />;
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
        <div className="lg:hidden mb-6 pt-8"></div>
        <div className="max-w-4xl mx-auto">
          <ReturnButton />
          <h1 className="text-2xl md:text-3xl font-bold mb-8">
          Module 7: Cutting Planes and Cross-Sections
          </h1>
          <LearningIntentions
            dailyIntention="Today, we are learning how 3D shapes can be sliced by an imaginary cutting plane to determine the shape of the cross-section at that location."
            bulletPoints={[
                "Record, define and explain the keywords for this module.",
                "Match the cross-section with an object and an imaginary cutting plane.",
                "Match various cross-sections that all can be obtained from a single object, based on the orientation of the cutting plane.",
                "Identify multiple cross-sections that could be obtained from a single object.",
            ]}
          />
          <SuccessCriteria
            iHavePoints={[
              "Completed all the activities in my workbook.",
              "Used the software to investigate cutting planes and cross-sections.",
              "Verified the solutions for all the workbook activities by checking my answers with a partner and teacher."
            ]}
            iCanPoints={[
              "Explain the words: cutting plane; cross-section.",
              "Identify cross-sections that correspond to a given object and cutting plane.",
              "Identify several possible cross-sections that could be obtained from a given object.",
            ]}
          />
          <GetStarted
            steps={[
              "Watch the Mini-Lecture Video:",
              "Access the Software here:",
              "Watch the Getting Started Videos:",
              "Complete the workbook pages as assigned by your teacher.",
              "Complete the Module 7 Quiz.",
            ]}
            videoLinks={[
              {
                stepIndex: 1,
                label: "Mini-Lecture: Cutting Planes and Cross-Sections",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174536365",
              },

              {
                stepIndex: 2,
                label: "Access the software here: Cutting Planes and Cross-Sections",
                url: "https://www.higheredservices.org/HES01/Module_10/module_10_theme_1.html",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 1",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030414",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 2",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030422",
              },
            ]}
          />
        </div>
      </main>
    </div>
  );
}
