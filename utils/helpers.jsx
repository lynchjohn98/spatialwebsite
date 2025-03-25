"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export function validateTeacherCode(inputtedCode) {
  //Use environment teacher code
  if (inputtedCode === "1234") {
    console.log("Teecher code is correct");
    return true;
  } else {
    console.log("Another ERROR");
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
    return Math.random().toString(36).substr(2, 8).toUpperCase(); // Example: "XK5D9A"
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


  export const supplementalMaterialInformation = [
    {
      title: "Informed Consent Form for Research Study",
      description: "Consent forms for student participants",
      downloadUrl: "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//consent_forms.pdf",
    },
    {
      title: "Extension Excercises",
      description: "Word document with extra material and information usable with each module",
      downloadUrl: "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//ExtensionExcercises.docx",
    },
    {
      title: "Information Sheet and Recruitment Letter",
      description: "PDF that includes information that the student / parent can review regarding the study",
      downloadUrl: "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//information_sheet_recruitment.pdf"
    },
    {
      title: "Teacher's Resource Guide to accompany Developing Spatial Thinking",
      description: "Large guide (~126 pg. pdf) that can be used to supplemental and provide walkthroughs of each module and questions associated with the modules",
      downloadUrl: "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//teacher_guide_ireland_final.pdf",
    },
    {
      title: "Pre-Module - The Importance of Spatial Skills",
      description: "Powerpoint presentation for the pre-module",
      downloadUrl: "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook_premodule.pptx",
    },
    {
      title: "Module 1 - Combining Solids Powerpoint",
      description: "Powerpoint presentation for Module 1",
      downloadUrl: "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook_combiningsolids.pptx",
    },
    {
      title: "Module 2 - Surfaces and Solids of Revolution",
      description: "Powerpoint presentation for Module 2",
      downloadUrl: "",
    },
    {
      title: "Module 3 - Isometric Sketching and Coded Plans",
      description: "Powerpoint presentation for Module 3",
      downloadUrl: "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook_isometric.pptx",
    },
    {
      title: "Module 4 - Flat Patterns",
      description: "Powerpoint presentation for Module 4",
      downloadUrl: "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook_flatpatterns.pptx",
    },
    {
      title: "Module 5 - Rotation of Objects About a Single Axis",
      description: "Powerpoint presentation for Module 5",
      downloadUrl: "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook__rotation1.pptx",
    },
    {
      title: "Module 6 - Reflections and Symmetry",
      description: "Powerpoint presentation for Module 6",
      downloadUrl: "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook_reflection.pptx",
    },
    {
      title: "Module 7 - Cutting Planes and Cross-Sections",
      description: "Powerpoint presentation for Module 7",
      downloadUrl: "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook_cuttingplanes.pptx",
    },
    {
      title: "Module 8 - Rotation of Objects About Two or More Axes",
      description: "Powerpoint presentation for Module 8",
      downloadUrl: "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook_rotation2.pptx",
    },
    {
      title: "Module 9 - Orthographic Projection",
      description: "Powerpoint presentation for Module 9",
      downloadUrl: "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook__orthographic.pptx",
    },
    {
      title: "Module 10 - Inclined and Curved Surfaces",
      description: "Powerpoint presentation for Module 10",
      downloadUrl: "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook_inclinedcurved.pptx",
    }

  ]