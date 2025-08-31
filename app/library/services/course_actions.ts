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
