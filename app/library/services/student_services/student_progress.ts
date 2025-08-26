"use server";
import { createClient } from "../../../utils/supabase/server";
import { v4 as uuidv4, v4 } from "uuid";


export async function fetchStudentProgress(id, course_id) {
    console.log("payload here:", id, course_id);
    const supabase = await createClient();
    try {
        // Execute all queries in parallel for better performance
        const [studentDemographics, studentProgress, studentGrades, moduleVisibility] = await Promise.all([
            supabase
                .from("students")
                .select("*")
                .eq("id", id),

            supabase
                .from("students_progress")
                .select("*")
                .eq("student_id", id),

            supabase
                .from("students_grades")
                .select("*")
                .eq("student_id", id),

            supabase
                .from("courses_settings")
                .select("module_settings")
                .eq("course_id", course_id)
        ]);

        // Check for errors
        const errors = [];
        if (studentDemographics.error) errors.push(`Students: ${studentDemographics.error.message}`);
        if (studentProgress.error) errors.push(`Progress: ${studentProgress.error.message}`);
        if (studentGrades.error) errors.push(`Grades: ${studentGrades.error.message}`);
        if (moduleVisibility.error) errors.push(`Module Settings: ${moduleVisibility.error.message}`);
        // Build return payload
        const returnPayload = {
            students_demographic_data: studentDemographics.data || [],
            students_progress_data: studentProgress.data || [],
            students_grade_data: studentGrades.data || [],
            courses_settings: moduleVisibility.data || [],
            // Optional: Add some useful computed properties
            total_students: studentDemographics.data?.length || 0,
            total_progress_records: studentProgress.data?.length || 0,
            total_grade_records: studentGrades.data?.length || 0,
            total_module_settings: moduleVisibility.data?.length || 0
        };

        if (errors.length > 0) {
            console.error("❌ Errors occurred:", errors);
            return {
                success: false,
                error: errors.join("; "),
                data: returnPayload
            };
        }

        console.log("✅ Successfully fetched all student data");
        return {
            success: true,
            data: returnPayload
        };

    } catch (error) {
        console.error("❌ Unexpected error:", error);
        return {
            success: false,
            error: error.message,
            data: {
                students_demographic_data: null,
                students_progress_data: null,
                students_grade_data: null
            }
        };
    }
}


