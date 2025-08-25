"use server";
import { createClient } from "../../utils/supabase/server";
// generate a uuid for a new student for default course
import { v4 as uuidv4, v4 } from "uuid";
import { generateStudentCode } from "../helpers/serverhelpers";

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


//For student who is joining a course, needs to use course join code
//and provided student username
export async function studentJoinCourse(payload: { student_username: string }) {
  const username = payload.student_username
    ? payload.student_username.toString().toLowerCase().trim()
    : '';
  if (!username) {
    return { error: "Valid username is required" };
  }
  const supabase = await createClient();
  try {
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select(`
        *,
        courses!course_id (
          *,
          courses_settings (*)
        ),
        students_grades (*),
        students_progress (*)
      `)
      .eq("student_username", username)
      .single();
    if (studentError) {
      console.error("❌ Student lookup error:", studentError.message);
      return { error: studentError.message };
    }
    if (!student) {
      return { error: "No student found with that username." };
    }
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


export async function retrieveStudentData(payload: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses_settings")
    .select("student_settings")
    .eq("course_id", payload)
    .single();
  if (error) {
    console.error("❌ Supabase Insert Error:", error.message);
    return { error: error.message };
  }
  return { success: true, data };
}

//Function to submit quiz data into the backend
export async function submitQuizData(payload: any) {
  const supabase = await createClient();
  console.log("Inside submitQuizData function", payload);

  const { data, error } = await supabase
    .from("grades")
    .insert(
      {
        quiz_id: payload.quiz_id,
        student_id: payload.student_id,
        score: payload.score,
        answers: payload.answers,
        attempt_number: 1,
        time_start: payload.time_start,
        time_end: payload.time_end,
        course_id: payload.course_id
      }
    )
  if (error) {
    console.error("❌ Supabase Insert Error:", error.message);
    return { error: error.message };
  }
  else {
    console.log("Inserted quiz data", data);
    return { success: true, data };
  }
}

export async function fetchGradesStudent(payload: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("grades")
    .select(`
      *,
      quizzes:quiz_id(id, name, description)
    `)
    .eq("student_id", payload.student_id);

  if (error) {
    console.error("❌ Supabase Query Error:", error.message);
    return { error: error.message };
  }
  return { success: true, data };
}



export async function fetchGradesTeacher(payload: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("grades")
    .select(`
      *,
      quizzes:quiz_id(id, name, description, total_score),
      student:student_id(id, first_name, last_name)
    `)
    .eq("course_id", payload);
  if (error) {
    console.error("❌ Supabase Query Error:", error.message);
    return { error: error.message };
  }
  return { success: true, data };
}


export async function loadAllAdminData() {
  const supabase = await createClient();

  try {
    const { data: coursesData, error: coursesError } = await supabase
      .from("courses")
      .select("*");

    if (coursesError) {
      console.error("❌ Supabase Courses Query Error:", coursesError.message);
      return { error: coursesError.message };
    }

    const { data: studentsData, error: studentsError } = await supabase
      .from("students")
      .select("*");

    if (studentsError) {
      console.error("❌ Supabase Students Query Error:", studentsError.message);
      return { error: studentsError.message };
    }

    const { data: settingsData, error: settingsError } = await supabase
      .from("courses_settings")
      .select("*");

    if (settingsError) {
      console.error("❌ Supabase Settings Query Error:", settingsError.message);
      return { error: settingsError.message };
    }

    const { count: courseCount, error: courseCountError } = await supabase
      .from("courses")
      .select("*", { count: "exact", head: true });

    if (courseCountError) {
      console.error("❌ Course Count Error:", courseCountError.message);
      return { error: courseCountError.message };
    }

    const { count: studentCount, error: studentCountError } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true });

    if (studentCountError) {
      console.error("❌ Student Count Error:", studentCountError.message);
      return { error: studentCountError.message };
    }

    const uniqueSchools = new Set(coursesData.map(course => course.school_name));

    return {
      success: true,
      data: {
        courses: coursesData,
        students: studentsData,
        settings: settingsData,
        stats: {
          courseCount,
          studentCount,
          schoolCount: uniqueSchools.size
        }
      }
    };
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    return { error: "An unexpected error occurred" };
  }
}



