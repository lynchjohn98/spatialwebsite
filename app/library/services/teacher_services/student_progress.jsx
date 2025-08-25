"use server";
import { createClient } from "../../../utils/supabase/server";


export async function fetchAllStudentCourseProgress(payload) {
    console.log("payload here:", payload);
    
    const supabase = await createClient();
    
    try {
        // Execute all queries in parallel for better performance
        const [studentsResult, progressResult, gradesResult] = await Promise.all([
            supabase
                .from("students")
                .select("*")
                .eq("course_id", payload.courseId),
            
            supabase
                .from("students_progress")
                .select("*")
                .eq("course_id", payload.courseId),
            
            supabase
                .from("students_grades")
                .select("*")
                .eq("course_id", payload.courseId)
        ]);
        
        // Check for errors
        const errors = [];
        if (studentsResult.error) errors.push(`Students: ${studentsResult.error.message}`);
        if (progressResult.error) errors.push(`Progress: ${progressResult.error.message}`);
        if (gradesResult.error) errors.push(`Grades: ${gradesResult.error.message}`);
        
        // Build return payload
        const returnPayload = {
            students_demographic_data: studentsResult.data || [],
            students_progress_data: progressResult.data || [],
            students_grade_data: gradesResult.data || [],
            // Optional: Add some useful computed properties
            total_students: studentsResult.data?.length || 0,
            total_progress_records: progressResult.data?.length || 0,
            total_grade_records: gradesResult.data?.length || 0
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
