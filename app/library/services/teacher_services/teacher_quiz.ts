"use server";
import { createClient } from "../../../utils/supabase/server";

const getCourseId = (t) => t?.courses?.id ?? t?.course_id ?? null;

async function insertTeacherGrade(teacherData, row) {
  if (!teacherData?.id) {
    return { success: false, error: { message: "Missing teacher data. Please sign in again." } };
  }

  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const courseId = getCourseId(teacherData);

    const { data, error } = await supabase.from("teachers_grades").insert([
      {
        created_at: now,
        time_submitted: now,
        teacher_id: teacherData.id,
        ...(courseId ? { course_id: courseId } : {}),
        ...row,
      },
    ]);

    if (error) {
      console.error("Error inserting teacher grade:", error);
      return { success: false, error: { message: error.message, code: error.code } };
    }
    return { success: true, data };
  } catch (err) {
    console.error("Error in insertTeacherGrade:", err);
    return { success: false, error: { message: err?.message || "Unknown error" } };
  }
}

export async function submitTeacherPrePostQuiz(payload) {
  const { quizData: results, teacherData } = payload || {};
  return insertTeacherGrade(teacherData, {
    quiz_id: results?.quizId,
    score: results?.results?.totalScore ?? 0,
    submitted_answers: results?.answers,
    time_taken: results?.timeSpent,
  });
}

// Kept so existing imports keep working; identical to the pre/post version
export async function submitTeacherQuiz(payload) {
  return submitTeacherPrePostQuiz(payload);
}

export async function submitTeacherSurvey(payload) {
  const { survey_results: survey, teacher_data: teacherData } = payload || {};
  return insertTeacherGrade(teacherData, {
    quiz_id: survey?.surveyId,
    score: 0,
    submitted_answers: survey?.answers,
    time_taken: survey?.timeSpent,
  });
}