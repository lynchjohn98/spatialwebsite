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
          Module 2: Surfaces and Solids of Revolution
          </h1>
          <LearningIntentions
            dailyIntention="Today, we are learning about how 2D shapes can be revolved around an axis to form a 3D Solid."
            bulletPoints={[
                "Record, define and explain the keywords of the module.",
    "Choose the appropriate 3D shape from the revolution of a given 2D shape.",
    "Choose the appropriate 2D shape from a given 3D diagram.",
    "Identify the axis of revolution.",
            ]}
          />

          <SuccessCriteria
            iHavePoints={[
              "Completed all the activities in my workbook.",
              "Used the software to investigate the combined solids.",
              "Verified the solutions for all the workbook activities by checking my answers with a partner and teacher.",
            ]}
            iCanPoints={[
              "Explain the words: Revolve, About an axis, Axis of revolution.",
              "Take a 2D shape and reolve it about any axis.",
              "Identify the axis of revolution given a 2D shape and a 3D object.",
              "Write down the number of degrees that a shape was revolved.",
              "Select a 2D shape from a given 3D object."
            ]}
          />

          <GetStarted
            steps={[
              "Watch the Mini-Lecture Video:",
              "Access the Software here:",
              "Watch the Getting Started Videos:",
              "Complete the workbook pages as assigned by your teacher.",
              "Complete the Module 2 Quiz.",
            ]}
            videoLinks={[
              {
                stepIndex: 1,
                label: "Mini-Lecture: Surfaces and Solids of Revolution",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174459909",
              },

              {
                stepIndex: 2,
                label: "Module 2: Surfaces and Solids of Revolution",
                url: "https://www.higheredservices.org/HES01/Module_1/module_1_theme_1.html",
              },

              {
                stepIndex: 3,
                label: "Getting Started Video 1",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/177263869",
              }
            ]}
            
          />
        </div>
      </main>
    </div>
  );
}
