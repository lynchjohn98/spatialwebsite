"use server";
import { createClient } from "../utils/supabase/server";



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

export async function insertCourse(payload) {
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
    );
  if (error) {
    console.error("❌ Supabase Insert Error:", error.message);
    return { error: error.message };
  } 
  return { success: true, data };
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