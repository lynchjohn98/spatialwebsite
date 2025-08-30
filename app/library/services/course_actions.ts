"use server";
import { createClient } from "../../utils/supabase/server";

//Fresh course inserted into backend
export async function insertNewCourse(payload) {
    const supabase = await createClient();
    console.log("Inserting new course with payload:", payload);
    const { data, error } = await supabase
        .from("courses")
        .insert(
            [{
                course_join_code: payload.joinCode,
                course_teacher_name: payload.name,
                course_teacher_id: payload.teacher_id,
                course_county: payload.county,
                course_urbanicity: payload.urbanicity,
                course_gender: payload.schoolGender,
                course_deis: payload.deis,
                course_language: payload.schoolLanguage,
                course_research: payload.courseResearch,
                course_research_type: payload.courseResearchType,
                course_name: payload.courseName,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }]
        )
        .select("id")
        .single();
    if (error) {
        console.error("❌ Supabase Insert Error:", error.message);
        return { error: error.message };
    }

    return { success: true, courseId: data.id };
}

//This runs to auto generate course settings part of the boilerplate of every course
export async function insertCourseSettings(allPayload) {
    const supabase = await createClient();
    const studentSettings = allPayload.studentSettings || '{}';
    const moduleSettings = allPayload.moduleSettings || '{}';
    const quizSettings = allPayload.quizSettings || '{}';
    try {
        const { data, error } = await supabase
            .from("courses_settings")
            .insert(
                [{
                    course_id: allPayload.courseId,

                    student_settings: studentSettings,
                    module_settings: moduleSettings,
                    quiz_settings: quizSettings,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }]
            );
        if (error) {
            console.error("❌ Supabase Insert Error:", error.message);
            return { error: error.message };
        }

        return { success: true, data };
    } catch (err) {
        console.error("❌ Unexpected error inserting course settings:", err);
        return { error: "An unexpected error occurred" };
    }
}
export async function generateDefaultModuleQuizInformation() {
    const supabase = await createClient();
    const { data: modules, error: moduleError } = await supabase
        .from("modules")
        .select("*");
    const { data: quizzes, error: quizError } = await supabase
        .from("quizzes")
        .select("*");
    const jsonData = {
        modules,
        quizzes
    }
    return jsonData;
}

// Course settings that are extra modules for the teacher to access
export async function retrieveSupplementalCourseInformation(payload: { id: any; }) {
  console.log("Retrieving course settings", payload);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", payload.id)
    .single();
  if (error) {
    console.error("❌ Supabase Insert Error:", error.message);
    return { error: error.message };
  }
  return { success: true, data };
}


// Course Settings Updated inside the Course Settings dashboard nav bar (only module / quiz settings)
export async function updateCourseSettings(payload: { courseId: any; moduleSettings: any; quizSettings: any; }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses_settings")
    .update({
      module_settings: payload.moduleSettings,
      quiz_settings: payload.quizSettings,
      updated_at : new Date().toISOString()
    })
    .eq("course_id", payload.courseId)
    .single();
  if (error) {
    console.error("❌ Supabase Insert Error:", error.message);
    return { error: error.message };
  }
  else {
    console.log ("Updated course settings", data);
    return { success: true, data };
  }
}

// Fix for retrieving modules
export async function retrieveModules(payload: { id: any; }) {
  console.log("Fetching modules", payload);
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("courses_settings")
      .select("module_settings")
      .eq("course_id", payload.id)
      .maybeSingle(); // Use maybeSingle instead of single
      
    if (error) {
      console.error("❌ Supabase Query Error:", error.message);
      return { error: error.message };
    }
    
    if (!data) {
      console.log("No module settings found for course ID:", payload.id);
      return { success: true, data: { module_settings: [] } }; // Return empty default
    }
    
    return { success: true, data };
  } catch (err) {
    console.error("❌ Error retrieving modules:", err);
    return { error: "Failed to retrieve modules" };
  }
}

// Fix for retrieving quizzes
export async function retrieveQuizzes(payload: { id: any; }) {
  console.log("Fetching quizzes", payload);
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("courses_settings")
      .select("quiz_settings")
      .eq("course_id", payload.id)
      .maybeSingle(); // Use maybeSingle instead of single
      
    if (error) {
      console.error("❌ Supabase Query Error:", error.message);
      return { error: error.message };
    }
    
    if (!data) {
      console.log("No quiz settings found for course ID:", payload.id);
      return { success: true, data: { quiz_settings: [] } }; // Return empty default
    }
    
    return { success: true, data };
  } catch (err) {
    console.error("❌ Error retrieving quizzes:", err);
    return { error: "Failed to retrieve quizzes" };
  }
}

// Fix for retrieving course settings
export async function retrieveCourseSettings(payload: { id: any; }) {
  console.log("Retrieving course settings", payload);
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("courses_settings")
      .select("*")
      .eq("course_id", payload.id)
      .maybeSingle(); // Use maybeSingle instead of single
    if (error) {
      console.error("❌ Supabase Query Error:", error.message);
      return { error: error.message };
    }
    if (!data) {
      console.log("No settings found for course ID:", payload.id);
      return { success: true, data: null };
    }
    return { success: true, data };
  } catch (err) {
    console.error("❌ Error retrieving course settings:", err);
    return { error: "Failed to retrieve course settings" };
  }
}


export async function deleteCourse(payload) {
  const supabase = await createClient();
  const { data, error } = await supabase
      .from("courses")
      .delete()
        .eq("id", payload);
    if (error) {
        console.error("❌ Supabase Delete Error:", error.message);
        return { error: error.message };
    }
    return { success: true, data };
}



//Student Table functions to help with username generation



// Course consent settings, specifically to update the student settings of consent in the students page and also the courses_settings student_settings page
export async function updateStudentConsentSettings(updatePayload, courseId) {
  try {
    const supabase = await createClient();
    
    // Update each student's consent status individually in students table
    const results = [];
    console.log("Update Payload:", updatePayload);

    for (const student of updatePayload) {
      console.log(student.student_consent);
      const { data, error } = await supabase
        .from('students')
        .update({ 
          student_consent: student.student_consent,
          student_notes: student.student_notes,
          consent_date: student.consent_date
        })
        .eq('student_username', student.student_username)
        .select();
      
      if (error) {
        console.error(`Error updating student ${student.student_username}:`, error);
        results.push({ username: student.student_username, success: false, error: error.message });
      } else {
        results.push({ username: student.student_username, success: true });
        console.log(`Successfully updated student ${student.student_username}`);
      }
    }
    
    // Check if all updates succeeded
    const failedUpdates = results.filter(r => !r.success);
    if (failedUpdates.length > 0) {
      return {
        success: false,
        error: `Failed to update ${failedUpdates.length} students`,
        details: failedUpdates
      };
    }

    // Now update the student_settings JSONB in courses_settings table
    try {
      // First, fetch the current student_settings
      const { data: currentSettings, error: fetchError } = await supabase
        .from('courses_settings')
        .select('student_settings')
        .eq('course_id', courseId)
        .single();

      if (fetchError) {
        console.error('Error fetching current settings:', fetchError);
        return {
          success: false,
          error: `Failed to fetch current settings: ${fetchError.message}`
        };
      }

      // Parse the current settings
      let studentSettings = [];
      if (currentSettings && currentSettings.student_settings) {
        studentSettings = typeof currentSettings.student_settings === 'string' 
          ? JSON.parse(currentSettings.student_settings)
          : currentSettings.student_settings;
      }

      // Create a map for quick lookup of updates
      const updateMap = new Map();
      updatePayload.forEach(update => {
        updateMap.set(update.student_username, {
          student_consent: update.student_consent,
          student_notes: update.student_notes,
          consent_date: update.consent_date
        });
      });

      // Update the student_settings array with new consent data
      const updatedStudentSettings = studentSettings.map(student => {
        if (updateMap.has(student.student_username)) {
          const updates = updateMap.get(student.student_username);
          return {
            ...student,
            student_consent: updates.student_consent,
            student_notes: updates.student_notes || student.student_notes,
            consent_date: updates.consent_date || student.consent_date
          };
        }
        return student;
      });

      // Update the courses_settings table with the modified student_settings
      const { data: updateData, error: updateError } = await supabase
        .from('courses_settings')
        .update({ 
          student_settings: JSON.stringify(updatedStudentSettings)
        })
        .eq('course_id', courseId)
        .select();

      if (updateError) {
        console.error('Error updating course settings:', updateError);
        return {
          success: false,
          error: `Students updated but failed to update course settings: ${updateError.message}`
        };
      }

      console.log('Successfully updated course settings with new consent data');

    } catch (jsonError) {
      console.error('Error updating student_settings JSONB:', jsonError);
      return {
        success: false,
        error: `Students updated but failed to update course settings: ${jsonError.message}`
      };
    }

    return {
      success: true,
      message: `Successfully updated consent for ${updatePayload.length} students in both tables`,
      results: results
    };
    
  } catch (error) {
    console.error('Error updating student consent:', error);
    return {
      success: false,
      error: error.message
    };
  }
}


// Script to update quiz pages 2-20 to match the teacher functionality from quiz 1
// This script shows the key changes needed for each file

// Common changes for all quiz files (2-20):
export const updateQuizFile = (quizNumber, quizName, importPath, submitFunction) => {
  return `"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TeacherResponsiveQuiz from "../../../../../components/teacher_components/TeacherResponsiveQuiz";
import { quizData } from "${importPath}";
import { ${submitFunction} } from "../../../../library/services/teacher_services/teacher_quiz";

export default function ${quizName}() {

  const router = useRouter();
  const [quizStarted, setQuizStarted] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [quizVisible, setQuizVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessMessage, setAccessMessage] = useState("");

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const openInstructionsModal = () => {
    setShowInstructionsModal(true);
  };

  const openAnswer1 = () => {
    setShowAnswer1(true);
  };

  const openAnswer2 = () => {
    setShowAnswer2(true);
  };

  const closeInstructionsModal = () => {
    setShowInstructionsModal(false);
    setShowAnswer1(false);
    setShowAnswer2(false);
  };

  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      closeInstructionsModal();
    }
  };

  const handleImageClick = (imageSrc, imageAlt) => {
    setZoomedImage({ src: imageSrc, alt: imageAlt });
  };

  const closeZoomedImage = () => {
    setZoomedImage(null);
  };

  const handleZoomBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeZoomedImage();
    }
  };

  useEffect(() => {
    try {
      // Load teacher data
      if (sessionStorage.getItem("teacherData") !== null) {
        setTeacherData(JSON.parse(sessionStorage.getItem("teacherData")));
      }
      
      // Load quiz settings from sessionStorage
      let quizSettings = null;
      
      // Check if stored directly as quizSettings
      if (sessionStorage.getItem("quizSettings") !== null) {
        quizSettings = JSON.parse(sessionStorage.getItem("quizSettings"));
      }
      // Or check if it's part of courseData
      else if (sessionStorage.getItem("courseData") !== null) {
        const courseData = JSON.parse(sessionStorage.getItem("courseData"));
        console.log("Course data:", courseData);
        
        // Check different possible locations for quiz_settings
        if (courseData?.quiz_settings) {
          quizSettings = courseData.quiz_settings;
        } else if (courseData?.settings?.quiz_settings) {
          quizSettings = courseData.settings.quiz_settings;
        }
      }

      // If we found quiz settings, check for the specific quiz
      if (quizSettings) {
        console.log("Quiz settings found:", quizSettings);
        
        const currentQuiz = quizSettings.find(
          quiz => quiz.name === "${getQuizNameByNumber(quizNumber)}"
        );

        console.log("Current quiz found:", currentQuiz);

        if (currentQuiz) {
          // Check visibility
          if (currentQuiz.visibility === "Yes") {
            setQuizVisible(true);
            setIsLoading(false);
          } else {
            // Quiz is not visible, but teachers can preview
            console.log("Quiz not visible to students, but allowing teacher preview");
            setQuizVisible(true);
            setIsLoading(false);
          }
        } else {
          // Quiz not found - allow teacher access anyway
          console.log("Quiz not found in settings, allowing teacher access");
          setQuizVisible(true);
          setIsLoading(false);
        }
      } else {
        // No quiz settings found - for teacher, allow access anyway
        console.log("No quiz settings found, allowing teacher access");
        setQuizVisible(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error parsing data from sessionStorage:", error);
      setAccessMessage("An error occurred while loading the quiz. Please try again.");
      setIsLoading(false);
      setTimeout(() => {
        router.push("/teacher/dashboard/");
      }, 3000);
    }
  }, [router]);

  const handleQuizComplete = async (results) => {
    try {
      const payload = {
        teacherData: teacherData,
        quizData: results,
      };
     
      await ${submitFunction}(payload);
    } catch (error) {
      console.error("Error saving quiz results:", error);
    }
    setTimeout(() => {
      router.push("/teacher/dashboard/");
    }, 7000);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl shadow-xl p-8 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-300">Checking quiz availability...</p>
        </div>
      </div>
    );
  }

  // Show access denied message (rarely used for teachers)
  if (!quizVisible && accessMessage) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl shadow-xl p-8 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Quiz Not Available</h2>
          <p className="text-gray-300 mb-4">{accessMessage}</p>
          <p className="text-gray-400 text-sm">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Only show quiz content if visibility check passed and not yet started
  if (!quizStarted && quizVisible) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl shadow-xl p-8 max-w-lg w-full">
          {/* Quiz Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">{quizData.title}</h1>
            <p className="text-gray-300 leading-relaxed">{quizData.description}</p>
          </div>

          {/* Quiz Stats */}
          <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100 4h2a1 1 0 100 2 2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z" clipRule="evenodd" />
                  </svg>
                  Questions:
                </span>
                <span className="text-white font-medium">{quizData.questions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                 No Time Limit
                </span>
                
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Total Points:
                </span>
                <span className="text-white font-medium">
                  {quizData.questions.reduce((sum, q) => sum + q.points, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Question Types:
                </span>
                <span className="text-white font-medium">Multiple Choice, Multiple Select</span>
              </div>
            </div>
          </div>

          {/* Teacher Notice */}
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Teacher Preview Mode - Take this quiz to familiarize yourself with the content
            </p>
          </div>

          {/* Instructions Button - Keep the same */}
          {/* Start Button - Keep the same */}
          {/* Instructions Modal - Keep the same */}
          {/* Zoomed Image Modal - Keep the same */}
          
          {/* REST OF THE COMPONENT REMAINS THE SAME */}
        </div>
      </div>
    );
  }

  // Show quiz component if started and visible
  if (quizStarted && quizVisible) {
    return (
      <TeacherResponsiveQuiz
        teacherData={teacherData}
        quizData={quizData}
        onQuizComplete={handleQuizComplete}
      />
    );
  }

  // Fallback (should not reach here)
  return null;
}`;
};

// Helper function to get quiz name by number
function getQuizNameByNumber(quizNumber) {
  const quizNames = {
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
    16: "Math Instrument Post-Test",
    17: "Practice Quiz",
    18: "Mathematics Motivation Survey",
    19: "STEM Attitudes Survey",
    20: "STEM Career Survey"
  };
  return quizNames[quizNumber] || "";
}

// Configuration for each quiz file
const quizConfigs = [
  {
    number: 2,
    componentName: "DATSRPreTest",
    importPath: "../../../../library/quiz_data/datsr_pre_quiz",
    submitFunction: "submitTeacherPrePostQuiz"
  },
  {
    number: 3,
    componentName: "MathematicsPreTest",
    importPath: "../../../../library/quiz_data/math_instrument_pre",
    submitFunction: "submitTeacherPrePostQuiz"
  },
  {
    number: 4,
    componentName: "CombiningSolidsQuiz",
    importPath: "../../../../library/quiz_data/combining_solids_quiz.js",
    submitFunction: "submitTeacherQuiz"
  },
  {
    number: 5,
    componentName: "SurfacesSolidsQuiz",
    importPath: "../../../../library/quiz_data/surfaces_solids_quiz",
    submitFunction: "submitTeacherQuiz"
  },
  {
    number: 6,
    componentName: "IsometricDrawingsQuiz",
    importPath: "../../../../library/quiz_data/isometric_plans_quiz",
    submitFunction: "submitTeacherQuiz"
  },
  {
    number: 7,
    componentName: "FlatPatternsQuiz",
    importPath: "../../../../library/quiz_data/flat_patterns_quiz",
    submitFunction: "submitTeacherQuiz"
  },
  {
    number: 8,
    componentName: "RotationSingleAxisQuiz",
    importPath: "../../../../library/quiz_data/rotation_single_axis_quiz",
    submitFunction: "submitTeacherQuiz"
  },
  {
    number: 9,
    componentName: "ReflectionsSymmetryQuiz",
    importPath: "../../../../library/quiz_data/object_reflections_symmetry_quiz",
    submitFunction: "submitTeacherQuiz"
  },
  {
    number: 10,
    componentName: "CuttingPlanesCrossQuiz",
    importPath: "../../../../library/quiz_data/cutting_planes_cross_quiz",
    submitFunction: "submitTeacherQuiz"
  },
  {
    number: 11,
    componentName: "RotationMultipleAxisQuiz",
    importPath: "../../../../library/quiz_data/rotation_two_axis_quiz",
    submitFunction: "submitTeacherQuiz"
  },
  {
    number: 12,
    componentName: "OrthographicDrawingsQuiz",
    importPath: "../../../../library/quiz_data/orthographic_drawings_quiz",
    submitFunction: "submitTeacherQuiz"
  },
  {
    number: 13,
    componentName: "OrthographicInclinedCurvedQuiz",
    importPath: "../../../../library/quiz_data/orthographic_projection_surfaces.js",
    submitFunction: "submitTeacherQuiz"
  },
  {
    number: 14,
    componentName: "PSVTRPostTest",
    importPath: "../../../../library/quiz_data/psvtr_post_quiz",
    submitFunction: "submitTeacherPrePostQuiz"
  },
  {
    number: 15,
    componentName: "DATSRPostTest",
    importPath: "../../../../library/quiz_data/datsr_post_quiz",
    submitFunction: "submitTeacherPrePostQuiz"
  },
  {
    number: 16,
    componentName: "MathematicsPostTest",
    importPath: "../../../../library/quiz_data/math_instrument_post",
    submitFunction: "submitTeacherPrePostQuiz"
  },
  {
    number: 17,
    componentName: "PracticeQuiz",
    importPath: "../../../../library/quiz_data/practice_quiz",
    submitFunction: "submitTeacherQuiz"
  }
];

// Surveys need different handling (18-20)
const surveyConfigs = [
  {
    number: 18,
    componentName: "MMQSurvey",
    importPath: "../../../../../app/library/quiz_data/mmq_survey",
    title: "Mathematics Motivation Questionnaire"
  },
  {
    number: 19,
    componentName: "STEMAttitudesSurvey",
    importPath: "../../../../../app/library/quiz_data/student_confidence_survey",
    title: "STEM Attitudes Survey"
  },
  {
    number: 20,
    componentName: "STEMCareerSurvey",
    importPath: "../../../../../app/library/quiz_data/stem_career_survey",
    title: "STEM Career Survey"
  }
];

// Generate survey file content
const updateSurveyFile = (config) => {
  return `"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TeacherSidebar from "../../../../../components/teacher_components/TeacherSidebar";
import ResponsiveSurvey from "../../../../../components/quiz_questions/ResponsiveSurvey";
import { quizData } from "${config.importPath}";
import { submitTeacherSurvey } from "../../../../library/services/teacher_services/teacher_quiz";

export default function ${config.componentName}() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    return () => window.removeEventListener("resize", checkWindowSize);
  }, []);

  useEffect(() => {
    const storedCourseData = sessionStorage.getItem("courseData");
    const storedTeacherData = sessionStorage.getItem("teacherData");

    if (storedCourseData && storedTeacherData) {
      try {
        const parsedCourseData = JSON.parse(storedCourseData);
        const parsedTeacherData = JSON.parse(storedTeacherData);

        setCourseData(parsedCourseData);
        setTeacherData(parsedTeacherData);
      } catch (error) {
        console.error("Error parsing session storage data:", error);
        sessionStorage.removeItem("courseData");
        sessionStorage.removeItem("teacherData");
        router.push("/teacher-join");
      }
    } else {
      router.push("/teacher-join");
    }
    
    setIsLoading(false);
  }, [router]);

  const handleSurveyComplete = async (surveyResults) => {
    try {
      console.log("Survey completed:", surveyResults);
      const payload = {
        survey_results: surveyResults,
        teacher_data: teacherData
      }
      const results = await submitTeacherSurvey(payload);
      
      // Optional: redirect after completion
      // router.push('/teacher/dashboard/quizzes');
      
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("There was an error submitting your survey. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading survey...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <TeacherSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        courseData={courseData}
      />
      <main
        className={\`flex-1 transition-all duration-300 \${
          isSidebarOpen ? "lg:ml-1/4" : ""
        }\`}
      >
        <div className="lg:hidden mb-6 pt-8"></div>
        
        {/* Survey Container with Module Page Styling */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-5xl mx-auto">
            {/* Return Button */}
            <button
              onClick={() => router.push("/teacher/dashboard/quizzes")}
              className="flex items-center text-white hover:text-blue-300 transition-colors mb-6"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Return to Quizzes
            </button>

            {/* Survey Header */}
            <div className="mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
                ${config.title}
              </h1>
              <div className="bg-gray-800/70 rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700/50">
                <p className="text-lg text-gray-300 leading-relaxed">
                  {quizData.description || "Please complete this survey to help us improve the course experience."}
                </p>
                <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-blue-300">
                    Teacher Preview Mode - Complete this survey to familiarize yourself with the content
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded ResponsiveSurvey with custom container styling */}
            <div className="bg-gray-800/70 rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">
              <ResponsiveSurvey
                data={quizData}
                onSurveyComplete={handleSurveyComplete}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}`;
};

// Example usage instructions
console.log("To update all quiz files, use the following configurations:");
console.log("\n// Regular quizzes (2-17):");
quizConfigs.forEach(config => {
  console.log(`\n// Quiz ${config.number}:`);
  console.log(`// File: app/teacher/dashboard/quizzes/${config.number}/page.jsx`);
  console.log(`// Component: ${config.componentName}`);
  console.log(`// Replace entire file content with updateQuizFile() output`);
});

console.log("\n// Survey files (18-20):");
surveyConfigs.forEach(config => {
  console.log(`\n// Survey ${config.number}:`);
  console.log(`// File: app/teacher/dashboard/quizzes/${config.number}/page.jsx`);
  console.log(`// Component: ${config.componentName}`);
  console.log(`// Replace entire file content with updateSurveyFile() output`);
});

