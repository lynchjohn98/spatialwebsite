"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


// Function to modify the admin code for logging in
export function validateTeacherCode(inputtedCode) {
  //Use environment teacher code
  if (inputtedCode === "SPA2025") {
    console.log("Teacher code is correct");
    return true;
  } else {
    console.log("Another ERROR");
    return false;
  }
}

export function validatePasswordResetCode(inputtedCode) {
  if (inputtedCode === "SpatialReset2025") {
    console.log("Password reset code is correct");
    return true;
  } else {
    console.log("Another ERROR");
    return false;
  }
}

// export const schools = [
//   //Can you add these as strings and put a comma after each one
//   "Ard Scoil Mhuire",
//   "Ardscoil Phadraig",
//   "Athlone Community College",
//   "Belmayne ETSS",
//   "Bremore ETSS",
//   "Carndonagh Community School",
//   "Colaiste Bride Enniscorthy",
//   "Colaiste ghlor na Mara",
//   "Colaiste Mhuire Askeaton",
//   "Colaiste Na Trocaire",
//   "Drogheda Grammar School",
//   "Gallen Community School",
//   "Lusk Community College",
//   "Malahide Community School",
//   "Old Bawn Community School",
//   "Patrician High School",
//   "Portumna Community School",
//   "Royal and Prior Comprehensive",
//   "Sancta Maria College",
//   "Santa Sabina Dominican College",
//   "St Columbas Comprehensive",
//   "St Josephs Castlebar",
//   "St Josephs Secondary School Rush",
//   "St Kevins Community College",
//   "St Mogues",
// ];

// School to number mapping for username generation
export const schoolNumbers = {
  "Ard Scoil Mhuire": 11,
  "Ardscoil Phadraig": 12,
  "Athlone Community College": 13,
  "Belmayne ETSS": 14,
  "Bremore ETSS": 15,
  "Carndonagh Community School": 16,
  "Colaiste Bride Enniscorthy": 17,
  "Colaiste ghlor na Mara": 18,
  "Colaiste Mhuire Askeaton": 19,
  "Colaiste Na Trocaire": 20,
  "Drogheda Grammar School": 21,
  "Gallen Community School": 22,
  "Lusk Community College": 23,
  "Malahide Community School": 24,
  "Old Bawn Community School": 25,
  "Patrician High School": 26,
  "Portumna Community School": 27,
  "Royal and Prior Comprehensive": 28,
  "Sancta Maria College": 29,
  "Santa Sabina Dominican College": 30,
  "St Columbas Comprehensive": 31,
  "St Josephs Castlebar": 32,
  "St Josephs Secondary School Rush": 33,
  "St Kevins Community College": 34,
  "St Mogues": 35,
  "Test School:": 36, // Example for a test school
};

// Counties for teachers to pick from
export const counties = [
  "Antrim",
  "Armagh",
  "Carlow",
  "Cavan",
  "Clare",
  "Cork",
  "Derry",
  "Donegal",
  "Down",
  "Dublin",
  "Fermanagh",
  "Galway",
  "Kerry",
  "Kildare",
  "Kilkenny",
  "Laois",
  "Leitrim",
  "Limerick",
  "Longford",
  "Louth",
  "Mayo",
  "Meath",
  "Monaghan",
  "Offaly",
  "Roscommon",
  "Sligo",
  "Tipperary",
  "Tyrone",
  "Waterford",
  "Westmeath",
  "Wexford",
  "Wicklow",
];

export const countyNumbers = {
  Antrim: "01",
  Armagh: "02",
  Carlow: "03",
  Cavan: "04",
  Clare: "05",
  Cork: "06",
  Derry: "07",
  Donegal: "08",
  Down: "09",
  Dublin: "10",
  Fermanagh: "11",
  Galway: "12",
  Kerry: "13",
  Kildare: "14",
  Kilkenny: "15",
  Laois: "16",
  Leitrim: "17",
  Limerick: "18",
  Longford: "19",
  Louth: "20",
  Mayo: "21",
  Meath: "22",
  Monaghan: "23",
  Offaly: "24",
  Roscommon: "25",
  Sligo: "26",
  Tipperary: "27",
  Tyrone: "28",
  Waterford: "29",
  Westmeath: "30",
  Wexford: "31",
  Wicklow: "32",
};

export function generateJoinCode() {
  return (
    Math.random().toString(36).substring(2, 6).toUpperCase() +
    "-" +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
}

export function generateStudentCode() {
  return Math.random().toString(36).substr(2, 8).toUpperCase(); // Example: "XK5D9A"
}

export function generateStudentUsername(studentName, teacherName, schoolName) {
  const studentPart = studentName
    ? studentName
        .toLowerCase()
        .slice(-3)
        .replace(/[^a-z]/g, "")
    : "stu";
  const teacherLastName = teacherName
    ? teacherName.split(" ").pop()
    : "teacher";
  const teacherPart = teacherLastName
    ? teacherLastName
        .toLowerCase()
        .slice(-3)
        .replace(/[^a-z]/g, "")
    : "te";
  const schoolNumber =
    countyNumbers[counties] || Math.floor(Math.random() * 89) + 10; // 10-99 range
  return `${studentPart}${teacherPart}${schoolNumber}`.toUpperCase();
}

//if needed, a random suffix can be added to the username: const randomSuffix = Math.floor(Math.random() * 99);
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
    LoadingComponent,
  };
}

export const researchMaterial = [
  {
    title: "Informed Consent Form for Research Study",
    description: "Consent forms for student participants",
    downloadUrl:
      "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//consent_forms.pdf",
  },
  {
    title: "Information Sheet and Recruitment Letter",
    description:
      "PDF that includes information that the student / parent can review regarding the study",
    downloadUrl:
      "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//information_sheet_recruitment.pdf",
  }
];

export const supplementalMaterialInformation = [
  {
    title: "Teacher's Resource Guide to accompany Developing Spatial Thinking",
    description:
      "Large guide (~126 pg. pdf) that can be used to supplemental and provide walkthroughs of each module and questions associated with the modules",
    downloadUrl:
      "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//teacher_guide_ireland_final.pdf",
  },
  {
    title: "Pre-Module - The Importance of Spatial Skills",
    description: "Powerpoint presentation for the pre-module",
    downloadUrl:
      "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook_premodule.pptx",
  },
  {
    title: "Module 1 - Combining Solids Powerpoint",
    description: "Powerpoint presentation for Module 1",
    downloadUrl:
      "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook_combiningsolids.pptx",
  },
  {
    title: "Module 2 - Surfaces and Solids of Revolution",
    description: "Powerpoint presentation for Module 2",
    downloadUrl: "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial/workbook_surfaces_solids.pptx",
  },
  {
    title: "Module 3 - Isometric Sketching and Coded Plans",
    description: "Powerpoint presentation for Module 3",
    downloadUrl:
      "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook_isometric.pptx",
  },
  {
    title: "Module 4 - Flat Patterns",
    description: "Powerpoint presentation for Module 4",
    downloadUrl:
      "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook_flatpatterns.pptx",
  },
  {
    title: "Module 5 - Rotation of Objects About a Single Axis",
    description: "Powerpoint presentation for Module 5",
    downloadUrl:
      "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook__rotation1.pptx",
  },
  {
    title: "Module 6 - Reflections and Symmetry",
    description: "Powerpoint presentation for Module 6",
    downloadUrl:
      "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook_reflection.pptx",
  },
  {
    title: "Module 7 - Cutting Planes and Cross-Sections",
    description: "Powerpoint presentation for Module 7",
    downloadUrl:
      "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook_cuttingplanes.pptx",
  },
  {
    title: "Module 8 - Rotation of Objects About Two or More Axes",
    description: "Powerpoint presentation for Module 8",
    downloadUrl:
      "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook_rotation2.pptx",
  },
  {
    title: "Module 9 - Orthographic Projection",
    description: "Powerpoint presentation for Module 9",
    downloadUrl:
      "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook__orthographic.pptx",
  },
  {
    title: "Module 10 - Inclined and Curved Surfaces",
    description: "Powerpoint presentation for Module 10",
    downloadUrl:
      "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//workbook_inclinedcurved.pptx",
  },
    
  {
    title: "Extension Excercises",
    description:
      "Word document with extra material and information usable with each module",
    downloadUrl:
      "https://puoorlpussgrjrehisvk.supabase.co/storage/v1/object/public/SupplementalMaterial//ExtensionExcercises.docx",
  }
 
];

const defaultModuleProgress = 
{
  "Pre-Module: The Importance of Spatial Skills": {
    "introduction_video": false,
    "mini_lecture": true,
    "software": true,
    "getting_started": true,
    "workbook": false,
    "quiz": true,
    "completed_at": null
  },
  "Combining Solids": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Surfaces and Solids of Revolution": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Isometric Sketching and Coded Plans": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Flat Patterns": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Rotation of Objects About a Single Axis": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Reflections and Symmetry": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Cutting Planes and Cross-Sections": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Rotation of Objects About Two or More Axes": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Orthographic Projection": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Inclined and Curved Surfaces": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  }
};
export { defaultModuleProgress };




// Modules for mapping on the student progress page:
// Quiz ID to Module mapping - you should move this to a config file
export const QUIZ_MODULE_MAPPING = {
    1: "PSVT:R Pre-Test",
    2: "DAT:SR Pre-Test",
    3: "Math Instrument Pre-Test",
    4: "Combining Solids",
    5: "Surfaces and Solids of Revolution",
    6: "Isometric Drawings and Coded Plans",
    7: "Flat Patterns",
    8: "Rotation of Objects About a Single Axis",
    9: "Reflections and Symmetry",
    10: "Cutting Planes and Cross-Sections",
    11: "Rotation of Objects About Two or More Axes",
    12: "Orthographic Projection",
    13: "Inclined and Curved Surfaces",
    14: "PSVT:R Post-Test",
    15: "DAT:SR Post-Test",
    16: "Math Instrument Post-Test"
};

// Module display order - customize as needed
export const MODULE_ORDER = [
    "Pre-Module: The Importance of Spatial Skills",
    "Combining Solids",
    "Surfaces and Solids of Revolution",
    "Isometric Drawings and Coded Plans",
    "Flat Patterns",
    "Rotation of Objects About a Single Axis",
    "Reflections and Symmetry",
    "Cutting Planes and Cross-Sections",
    "Rotation of Objects About Two or More Axes",
    "Orthographic Projection",
    "Inclined and Curved Surfaces",
];



export const moduleConfigurationOptions = {

    1: {
      number: 1,
      title: "The Importance of Spatial Skills",
      learningIntention: "Today, we are learning about the importance of spatial thinking skills for success in many careers",
      learningOutcomes: [
        "Describe what is meant by spatial skills",
        "Describe the various intelligences and how spatial thinking fits within this structure",
        "List various careers for which spatial skills are important",
        "List various careers for which spatial skills are not so important"
      ],
      introVideoUrl: "https://www.youtube.com/watch?v=hlOxMQLrqOw",
      successCriteria: {
        iHave: [
          "Completed all activities in my workbook",
          "Listed careers I am interested in and whether or not they require spatial thinking skills"
        ],
        iCan: [
          "Explain the words: spatial skills; spatial intelligence",
          "Describe the types of spatial thinking required for various occupations",
          "Determine if spatial skills are required for various professions",
          "Describe how spatial thinking skills are used in my everyday life"
        ]
      }
    },
    2: {
      number: 2,
      title: "Surfaces and Solids of Revolution",
      learningIntention: "Today, we are learning about how 2D shapes can be revolved around an axis to form a 3D Solid",
      learningOutcomes: [
        "Record, define and explain the keywords of the module",
        "Choose the appropriate 3D shape from the revolution of a given 2D shape",
        "Choose the appropriate 2D shape from a given 3D diagram",
        "Identify the axis of revolution"
      ],
      introVideoUrl: "https://www.youtube.com/watch?v=1jP0TxSbEmQ",
      miniLectureUrl: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/174459909",
      gettingStartedVideos: [
        { url: "https://vimeopro.com/sorby/spatial3atyhzoh7ta/video/177263869", title: "Video 1" }
      ],
      interactiveSoftwareUrl: "https://www.higheredservices.org/HES01/Module_1/module_1_theme_1.html",
      successCriteria: {
        iHave: [
          "Completed all activities in my workbook",
          "Reviewed the introduction video",
          "Reviewed the Mini-Lectures",
          "Reviewed the Getting Started videos",
          "Reviewed the interactive software",
          "Attempted the Module Quiz"
        ],
        iCan: [
          "Explain the words: Revolve, About an axis, Axis of revolution",
          "Take a 2D shape and revolve it about any axis",
          "Identify the axis of revolution given a 2D shape and a 3D object",
          "Write down the number of degrees that a shape was revolved",
          "Select a 2D shape from a given 3D object"
        ]
      }
    }
    // Add more module configurations as needed
  };