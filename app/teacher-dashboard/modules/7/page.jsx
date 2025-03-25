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
          Module 6: Object Reflection and Symmetry
          </h1>
          <LearningIntentions
            dailyIntention="Today, we are learning about object reflection and symmetry."
            bulletPoints={[
                "Record, define and explain the keywords for this module.",
                "Recognize the symmetry of 3D objects.",
                "Sketch the reflection of an isometric object.",
                "Identify the reflection of an isometric object.",
            ]}
          />
          <SuccessCriteria
            iHavePoints={[
              "Completed all the activities in my workbook.",
              "Used the software to investigate objects reflections and symmetry.",
              "Verified the solutions for all the workbook activities by checking my answers with a partner and teacher."
            ]}
            iCanPoints={[
              "Explain the words: Symmetry, Reflection, Plane of reflection, Plane of symmetry, Symmetric, Corresponding points.",
              "Sketch the image of an isometric object in the plane of reflection.",
              "Identify the planes of symmetry of an isometric object.",
              "Identify the reflection of an object.",
            ]}
          />
          <GetStarted
            steps={[
              "Watch the Mini-Lecture Video:",
              "Access the Software here:",
              "Watch the Getting Started Videos:",
              "Complete the workbook pages as assigned by your teacher.",
              "Complete the Module 6 Quiz.",
            ]}
            videoLinks={[
              {
                stepIndex: 1,
                label: "Mini-Lecture: Rotation of Objects about One Axis",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174457917",
              },

              {
                stepIndex: 2,
                label: "Access the software here: Reflection and Symmetry",
                url: "https://www.higheredservices.org/HES01/Module_9/module_9_theme_1.html",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 1",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030428",
              },
            ]}
          />
        </div>
      </main>
    </div>
  );
}
