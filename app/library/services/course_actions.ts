"use server";
import { createClient } from "../../utils/supabase/server";
import { v4 as uuidv4, v4 } from "uuid";
import { generateStudentCode } from "../helpers/serverhelpers";

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
    console.log("Inserted new course", data);
    return { success: true, courseId: data.id };
}

export async function insertCourseSettings(allPayload) {
    const supabase = await createClient();

    // Ensure we have default values for required fields to prevent null constraint violations
    const studentSettings = allPayload.studentSettings || '{}';
    const moduleSettings = allPayload.moduleSettings || '{}';
    const quizSettings = allPayload.quizSettings || '{}';

    // Log the payload for debugging
    console.log("Inserting course settings with payload:", {
        courseId: allPayload.courseId,
        studentSettings: typeof studentSettings === 'string' ? 'String of length ' + studentSettings.length : 'Not a string',
        moduleSettings: typeof moduleSettings === 'string' ? 'String of length ' + moduleSettings.length : 'Not a string',
        quizSettings: typeof quizSettings === 'string' ? 'String of length ' + quizSettings.length : 'Not a string'
    });

    try {
        const { data, error } = await supabase
            .from("course_settings")
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

export async function generateDefaultStudent(courseId) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("students")
        .insert(
            [{
                id: v4(),
                student_username: "",
                student_first_name: "Example",
                student_last_name: "Student",
                student_gender: "Male",
                student_age: 14,
                student_esl: false,
                student_consent: false,
                join_date: new Date().toISOString(),
                remove_date: null,
                course_id: courseId
            }]
        )
        .select("*")
        .single();
    if (error) {
        console.error("❌ Supabase Insert Error:", error.message);
        return { error: error.message };
    }
    return { success: true, data: data };
}


//Teacher dashboard functions
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


// Update course information in backend
export async function updateCourseSettings(payload: { courseId: any; studentSettings: any; moduleSettings: any; quizSettings: any; }) {
  console.log("Updating course settings in backend", payload);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("course_settings")
    .update({
      student_settings: payload.studentSettings,
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
      .from("course_settings")
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
      .from("course_settings")
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
      .from("course_settings")
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


//Student Table functions to help with username generation


// Student Grade Data Table
export async function getStudentGradeData(payload) {
     const supabase = await createClient();
    const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("course_id", payload.courseId)
        .single();
    if (error) {
        console.error("❌ Supabase Insert Error:", error.message);
        return { error: error.message };
    }
    return { success: true, data: data };
}
