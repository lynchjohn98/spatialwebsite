// app/teacher-dashboard/modules/somemodule/page.jsx
"use client";
import { Sidebar } from '../../../../components';

export default function ModulePage() {
  const { 
    isSidebarOpen, 
    setIsSidebarOpen, 
    courseData, 
    isLoading, 
    returnToModules, 
    LoadingComponent 
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
            Module Title Goes Here
          </h1>

          <LearningIntentions
            dailyIntention="Your daily intention here"
            bulletPoints={["Point 1", "Point 2", "Point 3"]}
          />

          <SuccessCriteria
            iHavePoints={["Point 1", "Point 2"]}
            iCanPoints={["Point 1", "Point 2", "Point 3", "Point 4"]}
          />

          <GetStarted
            steps={["Step 1", "Step 2", "Step 3", "Step 4"]}
            testButtons={[
              { label: "Button 1", onClick: () => console.log("Button 1 clicked") },
              { label: "Button 2", onClick: () => console.log("Button 2 clicked") }
            ]}
          />
        </div>
      </main>
    </div>
  );
}