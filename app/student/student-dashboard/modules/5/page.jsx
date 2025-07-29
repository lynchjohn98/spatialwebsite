"use client";
import { useModulePage } from "../../../../utils/helpers";
import Sidebar from "../../../../components/teacher_components/TeacherSidebar";
import ReturnButton from "../../../../components/page_blocks/ReturnButton";
import LearningIntentions from "../../../../components/module_blocks/LearningIntentions";
import SuccessCriteria from "../../../../components/module_blocks/SuccessCriteria";
import GetStarted from "../../../../components/module_blocks/GetStarted";

export default function Page() {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    courseData,
    isLoading,
    returnToModules,
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
          Module 4: Flat Patterns
          </h1>
          <LearningIntentions
            dailyIntention="Today, we are learning about flat patterns."
            bulletPoints={[
                "Record, define and explain the keywords for this module.",
                "Identify a 3D object, given a flat pattern.",
                "Identify a flat pattern from a given orthographic projection.",
                "Identify a flat pattern from an isometric sketch.",
                "Visualise related 2D and 3D images and objects."
            ]}
          />
          <SuccessCriteria
            iHavePoints={[
              "Completed all the activities in my workbook.",
              "Used the software to investigate flat patterns.",
              "Created a 3D object using a flat pattern.",
              "Verified the solutions for all the workbook activities by checking my answers with a partner and teacher.",
            ]}
            iCanPoints={[
              "Explain the words: Flat pattern, Orthographic, Fold lines, Adjacent surfaces, Orientation, Net, Development.",
              "Identify the correct orientation of a flat pattern.",
              "Identify a 3D object from a flat pattern.",
              "Identify a flat pattern from a 3D object."
            ]}
          />
          <GetStarted
            steps={[
              "Watch the Mini-Lecture Video:",
              "Access the Software here:",
              "Watch the Getting Started Videos:",
              "Complete the workbook pages as assigned by your teacher.",
              "Complete the Module 4 Quiz.",
            ]}
            videoLinks={[
              {
                stepIndex: 1,
                label: "Mini-Lecture: Isometric Sketching and Coded Plans",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172113636",
              },

              {
                stepIndex: 2,
                label: "Access the software here:",
                url: "https://www.higheredservices.org/HES01/Module_6/module_6_theme_1.html",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 1",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172113636",
              }
            ]}
          />
        </div>
      </main>
    </div>
  );
}
