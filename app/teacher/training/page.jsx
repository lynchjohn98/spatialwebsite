"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TrainingCard from "../../../components/teacher_components/TrainingCard";
import ResponsiveButton from "../../../components/page_blocks/ResponsiveButton";
import { getTeacherData } from "../../services/teacher_actions";

export default function TeacherTraining() {
  const router = useRouter();
  const [teacherData, setTeacherData] = useState(null);
  const [trainingCompleted, setTrainingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const storedData = JSON.parse(sessionStorage.getItem("teacherData"));
        if (!storedData?.id) {
          console.error("No teacher ID found in sessionStorage");
          setIsLoading(false);
          return;
        }
        const result = await getTeacherData(storedData);
        if (result.success && result.data) {
          const freshData = result.data;
          setTeacherData(freshData);
          sessionStorage.setItem("teacherData", JSON.stringify(freshData));
          console.log("Teacher data loaded successfully:", freshData);
        } else {
          setTeacherData(storedData);
        }
      } catch (error) {
        console.error("Error loading teacher data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTeacherData();
  }, []);

  const handleRestrictedAccess = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const isPretestComplete = teacherData?.pretest_complete || false;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      {/* Alert Banner */}
      {showAlert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg border border-red-500 animate-bounce">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Complete the PSVTR Pre-Test first!</span>
          </div>
        </div>
      )}

      {/* Sticky Header with Back Button */}
      <div className="bg-gray-800/50 border-b border-gray-700 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/teacher/homepage")}
              className="flex items-center text-gray-300 hover:text-white transition-colors group"
            >
              <svg
                className="h-5 w-5 mr-2 group-hover:translate-x-[-2px] transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Return to Teacher Homepage</span>
            </button>
            
            <div className="text-sm text-gray-400">
              Training Progress
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] w-full px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">
          Spatial Thinking Teacher Training
        </h1>
        
        <div className="text-center mb-6">
          <p className="text-lg mb-2">
            Welcome, {teacherData?.username || "Guest"}!
          </p>
        </div>

        {/* Access Control Notice */}
        {!isPretestComplete && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-red-300 font-semibold">Required: Complete Pre-Test First</span>
            </div>
            <p className="text-red-200 text-sm">
              You must complete the PSVTR Pre-Test before accessing other training modules. This helps us assess your current spatial skills level.
            </p>
          </div>
        )}

        <div className="w-full flex flex-col sm:flex-row sm:justify-center gap-4 mb-4">
          <ul className="space-y-2 mb-4 max-w-4xl w-full">
            {/* PSVTR Pre-Test - Always Accessible */}
            <TrainingCard
              moduleId="pretest"
              title="PSVTR Pre-Test: Assessing Your Spatial Skills"
              description="Purdue Spatial Visualization Pre-Test. Must complete before accessing other course content."
              isCompleted={teacherData?.pretest_complete || false}
              estimatedTime="20 minutes"
              href="/teacher/training/quizzes/psvtr_pretest"
            />
            
            {/* Restricted Training Cards */}
            <div className={`space-y-2 ${!isPretestComplete ? 'opacity-50 pointer-events-none' : ''}`}>
              <TrainingCard
                moduleId="premodule"
                title="Pre-Module: The Importance of Spatial Skills"
                description="An introduction to the significance of spatial skills."
                isCompleted={teacherData?.premodule_training || false}
                href="/teacher/training/premodule"
                disabled={!isPretestComplete}
                onRestrictedClick={handleRestrictedAccess}
              />
              <TrainingCard
                moduleId="module1"
                title="Module 1 - Combining solids"
                description="Learn how 3D shapes can be combined to form a single object."
                isCompleted={teacherData?.module1_training || false}
                href="/teacher/training/module1"
                disabled={!isPretestComplete}
                onRestrictedClick={handleRestrictedAccess}
              />
              <TrainingCard
                moduleId="module2"
                title="Module 2 - Surfaces and solids of Revolution"
                description="Learn how 2D shapes can be revolved around an axis to form a 3D solid."
                isCompleted={teacherData?.module2_training || false}
                href="/teacher/training/module2"
                disabled={!isPretestComplete}
                onRestrictedClick={handleRestrictedAccess}
              />
              <TrainingCard
                moduleId="posttest"
                title="Post-Test: Assessing Your Spatial Skills"
                description="A quick assessment to gauge your current spatial skills."
                isCompleted={teacherData?.posttest || false}
                estimatedTime="20 minutes"
                href="/teacher/training/quizzes/pretest"
                disabled={!isPretestComplete}
                onRestrictedClick={handleRestrictedAccess}
              />
            </div>

            {/* Locked Notice for Restricted Cards */}
            {!isPretestComplete && (
              <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4 text-center mt-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-400 font-medium">Training Modules Locked</span>
                </div>
                <p className="text-gray-500 text-sm">
                  Complete the PSVTR Pre-Test above to unlock all training modules.
                </p>
              </div>
            )}
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
            transform: translate3d(-50%, 0, 0);
          }
          40%, 43% {
            animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
            transform: translate3d(-50%, -10px, 0);
          }
          70% {
            animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
            transform: translate3d(-50%, -5px, 0);
          }
          90% {
            transform: translate3d(-50%, -2px, 0);
          }
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out;
        }
      `}</style>
    </div>
  );
}