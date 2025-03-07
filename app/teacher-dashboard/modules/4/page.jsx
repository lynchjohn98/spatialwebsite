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
    returnToModules,
    LoadingComponent,
  } = useModulePage();

  // Check loading state first
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
          Module 3: Isometric Sketching and Coded Plans
          </h1>
          <LearningIntentions
            dailyIntention="Today, we are learning about isometric sketching."
            bulletPoints={[
                "Record, define and explain the keywords for this module.",
                "Recognise isometric drawings.",
                "Visualize the isometric drawings of an object.",
                "Understand that objects can look different from different perspectives.",
                "Create an isometric sketch."
            ]}
          />

          <SuccessCriteria
            iHavePoints={[
              "Completed all the activities in my workbook.",
              "Used the software to identify isometric sketches and coded plans.",
              "Used the snap cubes to identify isometric sketches.",
              "Verified the solutions for all the workbook activities by checking my answers with a partner and teacher.",
            ]}
            iCanPoints={[
              "Explain the words: Isometric, Coded plan, Flat surface, Viewpoint.",
              "Identify examples of isometric drawings and coded plans.",
              "Count the number of blocks in an isometric drawing.",
              "Visualise an isometric sketch from a drawing.",
              "Draw an isometric sketch."
            ]}
          />
          <GetStarted
            steps={[
              "Watch the Mini-Lecture Video:",
              "Access the Software here:",
              "Watch the Getting Started Videos:",
              "Complete the workbook pages as assigned by your teacher.",
              "Complete the Module 3 Quiz.",
            ]}
            videoLinks={[
              {
                stepIndex: 1,
                label: "Mini-Lecture: Isometric Sketching and Coded Plans",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174461467",
              },

              {
                stepIndex: 2,
                label: "Access the software here:",
                url: "https://www.higheredservices.org/HES01/Module_3/module_3_theme_1.html",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 1",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030421",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 2",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/177254480"
              }
            ]}
          />
        </div>
      </main>
    </div>
  );
}
