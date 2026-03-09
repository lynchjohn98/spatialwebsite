"use server";
import { createClient } from "../../../utils/supabase/server";
import { v4 as uuidv4, v4 } from "uuid";

export async function submitTeacherQuiz(payload) {
try {
        console.log("FULL PAYLOAD", payload);
        const quizResults = payload.quizData;
        const teacherData = payload.teacherData;
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("teachers_grades")
            .insert([
                {
                    created_at: new Date().toISOString(),
                    quiz_id: quizResults.quizId,
                    score: quizResults.results.totalScore,
                    submitted_answers: quizResults.answers,
                    time_submitted: new Date().toISOString(),
                    time_taken: quizResults.timeSpent,
                    teacher_id: teacherData.id
                }
            ]);
        if (error) {
            console.error("Error submitting pre/post quiz:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Error in submitTeacherPrePostQuiz:", error);
        return { success: false, error };
    }

}

/*
export async function submitTeacherSurvey(payload) {
    const surveyResults = payload.survey_results;
    const teacherData = payload.teacher_data;
    const supabase = await createClient();
    const { data, error } = await supabase
    .from("teachers_grades")
    .insert([
        {
            created_at: new Date().toISOString(),
            quiz_id: surveyResults.surveyId,
            score: 0,
            submitted_answers: surveyResults.answers,
            time_submitted: new Date().toISOString(),
            time_taken: surveyResults.timeSpent,
            student_id: studentData.id,
            course_id: studentData.courses.id
        }
    ]);
    if (error) {
        console.error("Error submitting survey:", error);
        return { success: false, error };
    }

    return { success: true, data };
}
    */


export async function submitTeacherPrePostQuiz(payload) {
    try {
        console.log("FULL PAYLOAD", payload);
        const quizResults = payload.quizData;
        const teacherData = payload.teacherData;
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("teachers_grades")
            .insert([
                {
                    created_at: new Date().toISOString(),
                    quiz_id: quizResults.quizId,
                    score: quizResults.results.totalScore,
                    submitted_answers: quizResults.answers,
                    time_submitted: new Date().toISOString(),
                    time_taken: quizResults.timeSpent,
                    teacher_id: teacherData.id
                }
            ]);
        if (error) {
            console.error("Error submitting pre/post quiz:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Error in submitTeacherPrePostQuiz:", error);
        return { success: false, error };
    }
}


