"use client";
import GetStarted from "../../../../../components/module_blocks/GetStarted";
import LearningIntentions from "../../../../../components/module_blocks/LearningIntentions";
import SuccessCriteria from "../../../../../components/module_blocks/SuccessCriteria";
import ReturnButton from "../../../../../components/page_blocks/ReturnButton";
import Sidebar from "../../../../../components/teacher_components/TeacherSidebar";
import { useModulePage } from "../../../../../utils/helpers";

export default function Page() {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    courseData,
    isLoading,
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
            Module 1: Combining Solid Objects
          </h1>
          <LearningIntentions
            dailyIntention="Today, we are learning how 3D shapes can be combined to form a single object."
            bulletPoints={[
              "Record, define and explain the keywords of the module.",
              "Match two objects with the appropriate combined solid.",
              "Identify the volume of a combined solid.",
              "Match two objects with the appropriate combined solid.",
            ]}
          />

          <SuccessCriteria
            iHavePoints={[
              "Completed all the activities in my workbook",
              "Used the software to investigate the combined solids",
              "Verified the solutions for all the workbook activities by",
            ]}
            iCanPoints={[
              "Explain the words: volume of interference; join; cut; intersect; combined.",
              "Classify a combining operation.",
              "Identify the correct volume of interference of two overlapping solids.",
              "Sketch the edges of a composite solid obtained from a combining operation.",
            ]}
          />

          <GetStarted
            steps={[
              "Watch the Mini-Lecture Video:",
              "Access the Software here:",
              "Watch the Getting Started Videos:",
              "Complete the workbook pages as assigned by your teacher.",
              "Complete the Module 1 Quiz.",
            ]}
            videoLinks={[
              {
                stepIndex: 1,
                label: "Mini-Lecture: Combining Solids",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174463571",
              },

              {
                stepIndex: 2,
                label: "Module 1: Combining Solids",
                url: "https://www.higheredservices.org/HES01/Module_2/module_2_theme_1.html",
              },

              {
                stepIndex: 3,
                label: "Getting Started Video 1",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172113618",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 2",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172113638",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 3",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030415",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 4",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030413",
              },
            ]}
            
          />
        </div>
      </main>
    </div>
  );
}
