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
          Module 8: Rotation of Objects about Two or More Axes
          </h1>
          <LearningIntentions
            dailyIntention="Today, we are learning to rotate objects about two or more axes."
            bulletPoints={[
                "Record, define and explain the keywords for this module.",
                "Identify rotated bojects given their image.",
                "Rotate an object about given axes."
            ]}
          />
          <SuccessCriteria
            iHavePoints={[
              "Completed all the activities in my workbook.",
              "Used the software to investigate rotations about two or more axes.",
              "Used the stack cubes and model axis to investigate rotations about two or more axes.",
              "Verified the solutions for all the workbook activities by checking my answers with a partner and teacher."
            ]}
            iCanPoints={[
              "Explain the keywords: Positive rotation, Negative rotation, Right-hand rule, Clockwise, Counterclockwise.",
              "Identify correctly an object that has been rotated about two or more axes.",
              "Write down the degrees of rotation and arrow sequence for a given rotation.",
              "Sketch a rotated object, following a given rotation code.",
            ]}
          />
          <GetStarted
            steps={[
              "Watch the Mini-Lecture Video:",
              "Access the Software here:",
              "Watch the Getting Started Videos:",
              "Complete the workbook pages as assigned by your teacher.",
              "Complete the Module 8 Quiz.",
            ]}
            videoLinks={[
              {
                stepIndex: 1,
                label: "Mini-Lecture: Rotation of Objects about Two or More Axes",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/175886751",
              },

              {
                stepIndex: 2,
                label: "Access the software here: Rotation of Objects about Two or More Axes",
                url: "https://www.higheredservices.org/HES01/Module_10/module_10_theme_1.html",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 1",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171026505",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 2",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172113640",
              },
            ]}
          />
        </div>
      </main>
    </div>
  );
}
