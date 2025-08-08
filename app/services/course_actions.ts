"use server";
import { createClient } from "../../utils/supabase/server";
import { v4 as uuidv4, v4 } from "uuid";
import { generateStudentCode } from "../../utils/serverhelpers";

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
                student_username: generateStudentCode(),
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
