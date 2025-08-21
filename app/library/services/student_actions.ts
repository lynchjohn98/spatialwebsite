"use server";
import { createClient } from "../../utils/supabase/server";
import { v4 as uuidv4, v4 } from "uuid";

export async function fetchStudentProgressPage(student_id : any) {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase
            .from("students_progress")
            .select(`
                *
            `)
            .eq("student_id", student_id)
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


