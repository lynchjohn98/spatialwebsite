"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ResponsiveButton from "../../../components/page_blocks/ResponsiveButton";
import { getTeacherData } from "../../library/services/teacher_actions";

export default function TeacherHomePage() {
  const router = useRouter();
  const [teacherData, setTeacherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pretestComplete, setPretestComplete] = useState(false);
  const [trainingComplete, setTrainingComplete] = useState(false);
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
          setPretestComplete(freshData.pretest_complete);
          console.log("training", freshData);
          setTrainingComplete(freshData.training_complete);
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

  const handleRestrictedAccess = (targetPage) => {
    if (!pretestComplete) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    router.push(targetPage);
  };

  const getCompletionStatus = () => {
    if (!pretestComplete) return 'pretest-required';
    if (!trainingComplete) return 'training-pending';
    return 'all-complete';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const status = getCompletionStatus();

  return (

    


    <div className="min-h-screen w-full bg-gray-900 text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push("/")}
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
              <span className="font-medium">Sign Out and Return to Main Menu</span>
            </button>

          </div>
        </div>
      {/* Alert Banner */}
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg border border-red-500 animate-bounce">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Please complete the pretest first!</span>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* Header Section */}
        <div className="text-center  max-w-3xl">
          <h1 className="text-3xl sm:text-5xl mb-8 font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome, {teacherData?.name || teacherData?.username}
          </h1>
          
          {/* Status Card */}
          <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Teacher Progress</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Pretest Status */}
              <div className={`p-4 rounded-lg border ${
                pretestComplete 
                  ? 'bg-green-900/30 border-green-500' 
                  : 'bg-yellow-900/30 border-yellow-500'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">PSVT:R Pretest</span>
                  {pretestComplete ? (
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className={`text-sm ${pretestComplete ? 'text-green-200' : 'text-yellow-200'}`}>
                  {pretestComplete ? 'Completed ✓' : 'Required to access features'}
                </p>
              </div>

              {/* Training Status */}
              <div className={`p-4 rounded-lg border ${
                trainingComplete 
                  ? 'bg-green-900/30 border-green-500' 
                  : pretestComplete 
                    ? 'bg-blue-900/30 border-blue-500'
                    : 'bg-gray-700/30 border-gray-600'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Teacher Training</span>
                  {trainingComplete ? (
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : pretestComplete ? (
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className={`text-sm ${
                  trainingComplete 
                    ? 'text-green-200' 
                    : pretestComplete 
                      ? 'text-blue-200'
                      : 'text-gray-400'
                }`}>
                  {trainingComplete 
                    ? 'Completed' 
                    : pretestComplete 
                      ? 'Available - Complete when ready'
                      : 'Complete pretest first'
                  }
                </p>
              </div>
            </div>

            {/* Status Message */}
            {status === 'pretest-required' && (
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 text-center">
                <h3 className="text-red-300 font-semibold mb-2">⚠ Action Required</h3>
                <p className="text-red-200 text-sm leading-relaxed">
                  You must complete the PSVT:R Pre-Test before accessing other teacher features. 
                  The pretest helps us understand your current spatial skills level.
                </p>
              </div>
            )}

           

            {status === 'all-complete' && (
              <div className="bg-green-900/30 border border-green-500 rounded-lg p-4 text-center">
                
                <p className="text-green-200 text-sm leading-relaxed">
                  Training completed. 
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="w-full max-w-2xl space-y-4 mt-8">
          {/* Always Available - Training */}
          <div className="w-full">
            <ResponsiveButton
              onClick={() => router.push("/teacher/training")}
              label={pretestComplete ? "Continue Teacher Training" : "Start PSVT:R Pre-Test"}
              className={`w-full ${
                !pretestComplete 
                  ? 'bg-red-600 hover:bg-red-700 ring-2 ring-red-400 ring-opacity-50' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            />
          </div>

          {/* Restricted Access Buttons */}
          <div className={`space-y-4 ${!pretestComplete ? 'opacity-50' : ''}`}>
            <div className="relative">
              <ResponsiveButton
                onClick={() => handleRestrictedAccess("/teacher/join")}
                label="Join Course as Teacher"
                className={`w-full ${!pretestComplete ? 'cursor-not-allowed' : ''}`}
              />
              {!pretestComplete && (
                <div className="absolute inset-0 bg-transparent cursor-not-allowed" title="Complete pretest first" />
              )}
            </div>

            <div className="relative">
              <ResponsiveButton
                onClick={() => handleRestrictedAccess("/teacher/create-course")}
                label="Create Course"
                className={`w-full ${!pretestComplete ? 'cursor-not-allowed' : ''}`}
              />
              {!pretestComplete && (
                <div className="absolute inset-0 bg-transparent cursor-not-allowed" title="Complete pretest first" />
              )}
            </div>

            <div className="relative">
              <ResponsiveButton
                onClick={() => handleRestrictedAccess("/teacher/courses")}
                label="View Your Courses"
                className={`w-full ${!pretestComplete ? 'cursor-not-allowed' : ''}`}
              />
              {!pretestComplete && (
                <div className="absolute inset-0 bg-transparent cursor-not-allowed" title="Complete pretest first" />
              )}
            </div>

            <div className="relative">
              <ResponsiveButton
                onClick={() => handleRestrictedAccess("/teacher/help")}
                label="Need help? Click here"
                className={`w-full ${!pretestComplete ? 'cursor-not-allowed' : ''}`}
              />
              {!pretestComplete && (
                <div className="absolute inset-0 bg-transparent cursor-not-allowed" title="Complete pretest first" />
              )}
            </div>

               <div className="relative">
              <ResponsiveButton
                onClick={() => handleRestrictedAccess("/teacher/account")}
                label="My Account"
                className={`w-full ${!pretestComplete ? 'cursor-not-allowed' : ''}`}
              />
            </div>
          </div>

          {/* Locked Features Notice */}
          {!pretestComplete && (
            <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4 text-center mt-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-400 font-medium">Features Locked</span>
              </div>
              <p className="text-gray-500 text-sm">
                Complete the PSVT:R Pre-Test above to unlock course management and other features.
              </p>
            </div>
          )}
   
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