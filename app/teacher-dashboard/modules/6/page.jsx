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
          Module 5: Rotation of Objects About a Single Axis
          </h1>
          <LearningIntentions
            dailyIntention="Today, we are learning about flat patterns."
            bulletPoints={[
                "Record, define and explain the keywords for this module.",
                "Recognise positive and negative rotations.",
                "Identify rotated objects given their image.",
                "Rotate an object about a given axis.",
                "Sketch an object after it has been rotated by a given amount."
            ]}
          />
          <SuccessCriteria
            iHavePoints={[
              "Completed all the activities in my workbook.",
              "Used the software to investigate rotations about one axis.",
              "Used the stack cubes and model axis to investigate rotations about one axis.",
              "Demonstrate and describe positive and negative rotations.",
              "Verified the solutions for all the workbook activities by checking my answers with a partner and teacher."
            ]}
            iCanPoints={[
              "Explain the keywords: Positive rotation, Negative rotation, Magnitude, Right-hand rule, Clockwise, Counterclockwise, Anticlockwise, Equivalent Rotation code.",
              "Identify correctly a rotated object.",
              "Write down the degrees of rotation and arrow sequence for a given rotation.",
              "Identify the planes of symmetry of a given object.",
              "Sketch a rotated object, following a given rotation."
            ]}
          />
          <GetStarted
            steps={[
              "Watch the Mini-Lecture Video:",
              "Access the Software here:",
              "Watch the Getting Started Videos:",
              "Complete the workbook pages as assigned by your teacher.",
              "Complete the Module 5 Quiz.",
            ]}
            videoLinks={[
              {
                stepIndex: 1,
                label: "Mini-Lecture: Rotation of Objects about One Axis",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174521439",
              },

              {
                stepIndex: 2,
                label: "Access the software here: Rotation of Objects about One Axis",
                url: "https://www.higheredservices.org/HES01/Module_7/module_7_theme_1.html",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 1",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171026502",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 2",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171026504",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 3",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/177261289",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 4",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/171030423",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 5",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172111782",
              },
              {
                stepIndex: 3,
                label: "Getting Started Video 6",
                url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/172113637",
              },


            ]}
          />
        </div>
      </main>
    </div>
  );
}
