"use server";
import { createClient } from "../../utils/supabase/server";
import { v4 as uuidv4, v4 } from "uuid";

export async function createTeacherAccount(payload) {
  const supabase = await createClient();
  console.log("Creating teacher account with payload:", payload);
  try {
    const { data, error } = await supabase
      .from("teachers")
      .insert([
        {
          id: uuidv4(), // Generate a unique ID for the teacher
          name: payload.name,
          username: payload.username,
          password: payload.password,
          training_complete: payload.training_complete,
          pretest_complete: payload.pretest_complete,
          posttest_complete: payload.posttest_complete,
          premodule_training: payload.premodule_training,
          module1_training: payload.module1_training,
          module2_training: payload.module2_training,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select("*")
      .single();

    if (error) {
      console.error("❌ Supabase Insert Error:", error.message);
      return { error: "An error occurred while creating the teacher account. The username " + payload.username + " is already taken. Please choose a different username." };
    }

    return { success: true, data };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

/*
Function logins an existing account and access all elements that are associated with the accounts
- teachers information
-
*/
export async function loginTeacherAccount(payload) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("teachers")
      .select(`
        *,
        courses (*)
      `)
      .eq("username", payload.username)
      .eq("password", payload.password)
      .single(); 
    if (error) {
      console.error("❌ Supabase Select Error:", error.message);
      return { error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function logoutTeacherAccount() {
  sessionStorage.clear();

}


export async function getTeacherData(payload) {
  console.log("Inside getTeacherData with ID:", payload);
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("teachers")
      .select(`
    *,
    teachers_grades(*)
  `)
      .eq("id", payload.id)
      .single();

    if (error) {
      console.error("❌ Supabase Select Error in getTeacherData:", error.message);
      return { error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function updateTeacherAccount(payload) {
  const supabase = await createClient();
  try {
    const teacherData = payload.teacher || payload;
    const { id, created_at, ...updatedFields } = teacherData;

    const finalUpdates = {
      ...updatedFields,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("teachers")
      .update(finalUpdates)
      .eq("id", id)
      .select();

    if (error) {
      console.error("❌ Supabase Update Error:", error.message);
      return { error: error.message };
    }
    return { success: true, data: data[0] };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function submitTeacherQuiz(payload) {
  const supabase = await createClient();
  try {
    const { teacherData, quizData } = payload;
    const { data, error } = await supabase
      .from("teachers")
      .update(
        {
          pretest_complete: teacherData.pretest_complete,
          updated_at: new Date().toISOString()
        }
      )
      .eq("id", teacherData.id);
    if (error) {
      console.error("❌ Supabase Update Error in submitTeacherQuiz:", error.message);
      return { error: error.message };
    }
    const { data: quizDataResponse, error: quizError } = await supabase
      .from("teachers_grades")
      .insert([
        {
          created_at: new Date().toISOString(),
          teacher_id: teacherData.id,
          quiz_id: quizData.quizId,
          score: quizData.results.totalScore,
          submitted_answers: quizData.answers,
          time_submitted: new Date().toISOString(),
          time_taken: quizData.timeSpent,
        }
      ]);

    if (quizError) {
      console.error("❌ Supabase Insert Error in teacher_grades:", quizError.message);
      return { error: quizError.message };
    }
    return { success: true, data, quizData: quizDataResponse };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}


export async function getAllTeacherCourses(payload) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("course_teacher_id", payload.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("❌ Supabase Select Error:", error.message);
      return { error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function retrieveTeacherCourse(payload) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("course_join_code", payload.joinCode)
    if (error) {
      console.error("❌ Supabase Query Error:", error.message);
      return { error: error.message };
    }
    if (!data || data.length === 0) {
      return { error: "No course found with these credentials. Please check your join code and password." };
    }
    if (data.length > 1) {
      console.warn("Multiple courses found with the same credentials. Using the first one.");
    }
    return { success: true, data: data[0] };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}