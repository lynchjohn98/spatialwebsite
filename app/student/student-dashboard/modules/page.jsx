"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { retrieveModules } from "../../../services/actions.ts"
import StudentSidebar from "../../../../components/student_components/StudentSidebar.jsx"

export default function Modules() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [moduleData, setModuleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkWindowSize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', checkWindowSize);
    checkWindowSize();
    return () => window.removeEventListener('resize', checkWindowSize);
  }, []);

  const getModuleData = useCallback(async (courseId) => {
    try {
      const response = await retrieveModules({ id: courseId });
      if (response.success) {
        const parsedModuleSettings = JSON.parse(response.data.module_settings || "[]");
        setModuleData(parsedModuleSettings);
        const currentTime = new Date().toISOString();
        setLastUpdated(currentTime);
        sessionStorage.setItem("moduleData", JSON.stringify(parsedModuleSettings));
        sessionStorage.setItem("moduleDataTimestamp", currentTime);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error fetching modules:", error);
      return false;
    }
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const storedData = sessionStorage.getItem("courseData");
    if (!storedData) {
      setIsLoading(false);
      router.push("/teacher-join");
      return;
    }
    try {
      const parsedCourseData = JSON.parse(storedData);
      setCourseData(parsedCourseData);
      const storedModuleData = sessionStorage.getItem("moduleData");
      const storedTimestamp = sessionStorage.getItem("moduleDataTimestamp");
      const now = new Date();
      const timestampDate = storedTimestamp ? new Date(storedTimestamp) : null;
      const isDataFresh = timestampDate && 
                          (now.getTime() - timestampDate.getTime() < 5 * 60 * 1000); // 5 minutes      
      if (storedModuleData && isDataFresh) {
        setModuleData(JSON.parse(storedModuleData));
        setLastUpdated(storedTimestamp);
      } else {
        await getModuleData(parsedCourseData.id);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getModuleData, router]);

  useEffect(() => {
    loadData();
    const handleStorageChange = (e) => {
      if (e.key === "moduleData") {
        try {
          setModuleData(JSON.parse(e.newValue));
        } catch (error) {
          console.error("Error parsing updated module data:", error);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadData]);

  const refreshData = async () => {
    if (courseData) {
      setIsLoading(true);
      await getModuleData(courseData.id);
      setIsLoading(false);
    }
  };
  
  const navigateToModule = (moduleId) => {
    router.push(`/teacher-dashboard/modules/${moduleId}`);
  };

  if (isLoading || !courseData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white text-4xl font-bold">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
        <StudentSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        courseData={courseData}
      />
      <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-1/4' : ''}`}>
        <div className="lg:hidden mb-6 pt-8">
          </div> 
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">All Modules</h1>
          
          <div className="flex justify-between items-center mb-6">
            <p>Click on a module to access its content and activities.</p>
            <button 
              onClick={refreshData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>
          {lastUpdated && (
            <p className="text-sm text-gray-400 mb-4">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
          <div className="space-y-4">
            {moduleData && moduleData.length > 0 ? (
              (() => {
                const visibleModules = moduleData.filter(module => module.visibility === "Yes");
                if (visibleModules.length === 0) {
                  return (
                    <div className="p-4 bg-gray-800 rounded-lg text-center">
                      <p>No visible modules available at this time.</p>
                    </div>
                  );
                }   
                return visibleModules.map((module) => (
                  <div 
                    key={module.id} 
                    className="p-5 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                    onClick={() => navigateToModule(module.id)}
                  >
                    <h3 className="text-xl font-bold mb-2">{module.name}</h3>
                    <p className="text-gray-300">{module.description}</p>
                  </div>
                ));
              })()
            ) : (
              <div className="p-4 bg-gray-800 rounded-lg text-center">
                <p>No modules available. Please check your course settings.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}