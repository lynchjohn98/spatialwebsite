"use server";
import { createClient } from "../../utils/supabase/server";
import { v4 as uuidv4, v4 } from "uuid";

export async function fetchStudentProgressPage(payload : any) {

    const supabase = await createClient();
    try {
        const { data, error } = await supabase
            .from("students_progress")
            .select(`
                module_progress
            `)
            .eq("student_id", payload.student_id)
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

export async function updateStudentModuleProgress(student_id: any, module_title: any, progress_section: any){
    const supabase = await createClient();
    console.log("Inside here", student_id, module_title, progress_section);
    
    try {
        // First, get the current progress
        const { data, error } = await supabase
            .from("students_progress")
            .select("module_progress")
            .eq("student_id", student_id)
            .single();
  
        if (error) {
            console.error("❌ Supabase Select Error:", error.message);
            return { error: error.message };
        }

        // Toggle the boolean value for the specific field
        const currentValue = data.module_progress[module_title][progress_section];
        const newValue = !currentValue; // Toggle from false to true or true to false

        // Create the updated progress object
        const updatedProgress = {
            ...data.module_progress,
            [module_title]: {
                ...data.module_progress[module_title],
                [progress_section]: newValue
            }
        };

        // Update the database with the new progress
        const { data: updateData, error: updateError } = await supabase
            .from("students_progress")
            .update({ 
                module_progress: updatedProgress,
                updated_at: new Date().toISOString()
            })
            .eq("student_id", student_id);

        if (updateError) {
            console.error("❌ Supabase Update Error:", updateError.message);
            return { error: updateError.message };
        }

        console.log("✅ Successfully updated:", module_title, progress_section, "to", newValue);
        return { success: true, data: updateData, newValue };
        
    } catch (err) {
        console.error("❌ Unexpected error:", err);
        return { error: "An unexpected error occurred. Please try again." };
    }
}

// Student Quiz Submission Handling
export async function submitStudentQuiz(student_id: any, module_id: any, answers: any, score: any) {

}