"use server";
import { createClient } from "../utils/supabase/server";
// generate a uuid for a new student for default course
import { v4 as uuidv4, v4 } from "uuid";
import { generateStudentCode } from "../utils/serverhelpers";

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
      student_join_code: generateStudentCode(), // Call the function - don't just pass the reference
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
      return { success: true, data: null }; // Return null to indicate no settings found
    }
    
    return { success: true, data };
  } catch (err) {
    console.error("❌ Error retrieving course settings:", err);
    return { error: "Failed to retrieve course settings" };
  }
}
//For student who is joining a course, needs to use course join code
//and provided student code
export async function studentCourseJoin(payload: { studentJoinCode: string }) {
  const supabase = await createClient();
  console.log("Running in local host");
  try {
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
    console.log(student);
     
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


// In your actions.ts file
export async function addStudentToDatabase(payload) {
  const supabase = await createClient();
  
  // Insert the student into the students table
  const { data, error } = await supabase
    .from("students")
    .upsert([
      {
        id: payload.id || undefined, // If there's an ID, update; otherwise insert
        student_join_code: payload.student_join_code,
        first_name: payload.first_name,
        last_name: payload.last_name,
        gender: payload.gender,
        grade: payload.grade,
        other: payload.other,
        join_date: payload.join_date || new Date().toISOString(),
        remove_date: payload.remove_date,
        course_id: payload.course_id
      }
    ], 
    { 
      onConflict: 'student_join_code',  // Update if the join code already exists
      ignoreDuplicates: false
    });
  
  if (error) {
    console.error("❌ Student insert error:", error.message);
    return { error: error.message };
  }
  
  return { success: true, data };
}


export async function retrieveStudentData(payload : any) {
  const supabase = await createClient();
  const { data, error } = await supabase
  .from("course_settings")
  .select("student_settings")
  .eq("course_id", payload)
  .single();
  if (error) {
    console.error("❌ Supabase Insert Error:", error.message);
    return { error: error.message };
  }
  return { success: true, data };
}