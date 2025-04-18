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
          Module 9: Orthographic Drawings Learning Intentions
          </h1>
          <LearningIntentions
            dailyIntention="Today, we are learning how to create a set of orthographic drawings from a single object."
            bulletPoints={[
                "Record, define and explain the keywords for this module.",
                "Identify the top, front, and side views of a given object.",
                "Match an isometric view of any object with its corresponding top, front, and side views.",
                "Determine when orthographic views are properly aligned.",
                "Sketch the top, front, and side views (properly aligned) from a given isometric view of an object, including hidden lines when necessary.",
                "Sketch an isometric view of an object, given its top, front, and side views."
            ]}
          />
          <SuccessCriteria
            iHavePoints={[
              "Completed all the activities in my workbook.",
              "Used the software to investigate orthographic projections.",
              "Verified the solutions for all the workbook activities by checking my answers with a partner and teacher."
            ]}
            iCanPoints={[
              "Explain the words: orthographic; hidden lines; view alignment; box method.",
              "Identify orthographic views that correspond to an isometric view of an object.",
              "Identify isometric views from the top, front, and side views of a given object.",
              "Sketch the top, front, and side views of an object given its isometric view and the three views are properly aligned.",
              "Sketch an isometric view of an object, given its three orthographic views."
            ]}
          />
          <GetStarted
            steps={[
              "Watch the Mini-Lecture Video:",
              "Access the Software here:",
              "Watch the Getting Started Videos:",
              "Complete the workbook pages as assigned by your teacher.",
              "Complete the Module 9 Quiz.",
            ]}
            videoLinks={[
              {
                stepIndex: 1,
                label: "Mini-Lecture: Orthographic Drawings",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/175886752",
              },
              {
                stepIndex: 2,
                label: "Access the software here: Orthographic Views",
                url: "https://www.higheredservices.org/HES01/Module_4/module_4_theme_1.html",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 1",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/170976907",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 2",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/177460037",
              },
            ]}
          />
        </div>
      </main>
    </div>
  );
}
