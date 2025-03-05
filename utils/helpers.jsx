"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function validateTeacherCode(inputtedCode) {
  if (inputtedCode === "1234") {
    console.log("Teeacher code is correct");
    return true;
  } else {
    return false;
  }
}

export const schools = [
  //Can you add these as strings and put a comma after each one
  "Ard Scoil Mhuire",
  "Ardscoil Phadraig",
  "Athlone Community College",
  "Belmayne ETSS",
  "Bremore ETSS",
  "Carndonagh Community School",
  "Colaiste Bride Enniscorthy",
  "Colaiste ghlor na Mara",
  "Colaiste Mhuire Askeaton",
  "Colaiste Na Trocaire",
  "Drogheda Grammar School",
  "Gallen Community School",
  "Lusk Community College",
  "Malahide Community School",
  "Old Bawn Community School",
  "Patrician High School",
  "Portumna Community School",
  "Royal and Prior Comprehensive",
  "Sancta Maria College",
  "Santa Sabina Dominican College",
  "St Columbas Comprehensive",
  "St Josephs Castlebar",
  "St Josephs Secondary School Rush",
  "St Kevins Community College",
  "St Mogues",
];

export function generateJoinCode() {
  return (
    Math.random().toString(36).substring(2, 6).toUpperCase() +
    "-" +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
}

export function generateStudentCode(){
    return Math.random().toString(36).substr(2, 6).toUpperCase(); // Example: "XK5D9A"
  };




  //Teacher module page generator:
  export function useModulePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [courseData, setCourseData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
  
    useEffect(() => {
      const checkWindowSize = () => {
        if (window.innerWidth >= 1024) {
          setIsSidebarOpen(true);
        } else {
          setIsSidebarOpen(false);
        }
      };
      
      window.addEventListener("resize", checkWindowSize);
      checkWindowSize();
      
      const loadData = () => {
        const storedData = sessionStorage.getItem("courseData");
        if (storedData) {
          try {
            setCourseData(JSON.parse(storedData));
          } catch (error) {
            console.error("Error parsing course data:", error);
            router.push("/teacher-join");
          }
        } else {
          router.push("/teacher-join");
        }
        setIsLoading(false);
      };
      
      loadData();
      
      return () => window.removeEventListener("resize", checkWindowSize);
    }, [router]);
  
    const returnToModules = () => {
      router.push("/teacher-dashboard/modules");
    };
  
    // Loading component to be rendered when loading or no course data
    const LoadingComponent = () => (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white text-xl font-bold">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  
    return {
      isSidebarOpen,
      setIsSidebarOpen,
      courseData,
      isLoading,
      returnToModules,
      LoadingComponent
    };
  }