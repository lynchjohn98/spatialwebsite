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
          Module 10: Inclined and Curved Surfaces
          </h1>
          <LearningIntentions
            dailyIntention="Today, we are learning how to create a set of orthographic drawings from an object that includes inclined or curved surfaces."
            bulletPoints={[
                "Record, define and explain the keywords for this module.",
                "Identify the top, front, and side views of an object with inclined or curved surfaces.",
                "Match an isometric view of an object that contains either inclined or curved surfaces with its corresponding top, front, and side views.",
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
              "Explain the words: orthographic; inclined surfaces; curved surfaces.",
              "Identify orthographic views that correspond to an isometric view of an object that contains inclined or curved surfaces.",
              "Identify isometric views from the top, front, and side views of a given object that contains inclined or curved surfaces.",
              "Sketch the top, front, and side views of an object with inclined or curved surfaces given its isometric view and the three views are properly aligned.",
              "Sketch an isometric view of an object with inclined surfaces, given its three orthographic views."
            ]}
          />
          <GetStarted
            steps={[
              "Watch the Mini-Lecture Video:",
              "Access the Software here:",
              "Watch the Getting Started Videos:",
              "Complete the workbook pages as assigned by your teacher.",
              "Complete the Module 10 Quiz.",
            ]}
            videoLinks={[
              {
                stepIndex: 1,
                label: "Mini-Lecture: Inclined and Curved Surfaces",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174513397",
              },
              {
                stepIndex: 2,
                label: "Access the software here: Orthographic Projection of Inclined and Curved Surfaces",
                url: "https://www.higheredservices.org/HES01/Module_5/module_5_theme_1.html",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 1",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/178667573",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 2",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030416",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 3",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172113629",
              }
            ]}
          />
        </div>
      </main>
    </div>
  );
}
