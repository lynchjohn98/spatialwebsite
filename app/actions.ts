"use server";
import { createClient } from "../utils/supabase/server";
// generate a uuid for a new student for default course
import { v4 as uuidv4, v4 } from "uuid";
import { generateStudentCode } from "../utils/helpers";

// Example SSR function used for server side, use this with the test, page.jsx for inserting
//a message for similar work
export async function insertMessage(payload) {
  console.log("Inserting message", payload);
  const supabase = await createClient();
    // ✅ Ensure the correct structure is used
    const { data, error } = await supabase.from("test").insert([{ message: payload.message }]);

    if (error) {
      console.error("❌ Supabase Insert Error:", error.message);
      return { error: error.message };
    } 
    return { success: true, data };
}

export async function insertNewCourse(payload) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .insert(
      [{
        course_join_code: payload.joinCode,
        teacher_name: payload.name,
        school_name: payload.school,
        teacher_course_password: payload.password,
        course_type: payload.classType,
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


export async function retrieveTeacherCourse(payload) {
  const supabase = await createClient();
  //Retrieve course with join code and teacher password
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("course_join_code", payload.joinCode)
    .eq("teacher_course_password", payload.password)
    .single();
  if (error) {
    console.error("❌ Supabase Insert Error:", error.message);
    return { error: error.message };
  } 
  return { success: true, data };
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
      student_join_code: generateStudentCode(),
      first_name: "Example",
      last_name: "Student",
      gender: "Male",
      grade: "12",
      join_date: new Date().toISOString(),
      remove_date: null,
      other: "This is an example student for the course.",
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

export async function insertCourseSettings(allPayload) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("course_settings")
    .insert(
      [{
        course_id: allPayload.courseId,
        student_settings: allPayload.studentSettings,
        module_settings: allPayload.moduleSettings,
        quiz_settings: allPayload.quizSettings,
        created_at : new Date().toISOString(),
        updated_at : new Date().toISOString()
      }]
    )
  if (error) {
    console.error("❌ Supabase Insert Error:", error.message);
    return { error: error.message };
  }
  else {
    return { success: true, data };
  }
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


//Grab all course settings to setup visibility items
export async function retrieveCourseSettings(payload: { id: any; }) {
  console.log("Retrieving course settings", payload);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("course_settings")
    .select("*")
    .eq("course_id", payload.id)
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


//Dedicated to modules page, this will retrieve only the modules settings for a course if a refresh is clicked
//and if the user did not reset any information in the page
export async function retrieveModules(payload: { id: any; }) {
  console.log("Fetching modules", payload);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("course_settings")
    .select("module_settings")
    .eq("course_id", payload.id)
    .single();
  if (error) {
    console.error("❌ Supabase Insert Error:", error.message);
    return { error: error.message };
  }
  return { success: true, data };
}

//Dedicated to quizzes page, this will retrieve only the quizzes settings for a course if a refresh is clicked
//and if the user did not reset any information in the page
export async function retrieveQuizzes(payload: { id: any; }) {
  console.log("Fetching quizzes", payload);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("course_settings")
    .select("quiz_settings")
    .eq("course_id", payload.id)
    .single();
  if (error) {
    console.error("❌ Supabase Insert Error:", error.message);
    return { error: error.message };
  }
  return { success: true, data };
}

//For student who is joining a course, needs to use course join code
//and provided student code
export async function studentCourseJoin(payload: { studentJoinCode: string }) {
  const supabase = await createClient();
  
  try {
    // Step 1: Get the student data and course_id in one query
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("*, course_id")
      .eq("student_join_code", payload.studentJoinCode)
      .single();
      
    if (studentError) {
      console.error("❌ Student lookup error:", studentError.message);
      return { error: studentError.message };
    }
    
    if (!student) {
      return { error: "No student found with that join code." };
    }
    
    // Step 2: Get course and settings data in a single query using the course_id
    const { data, error } = await supabase
      .rpc('get_student_course_data', { 
        p_course_id: student.course_id 
      });
    
    if (error) {
      console.error("❌ Data retrieval error:", error.message);
      return { error: error.message };
    }
    
    return { 
      success: true, 
      data: {
        student,
        courseData: data
      }
    };
    
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return { error: "An unexpected error occurred." };
  }
}