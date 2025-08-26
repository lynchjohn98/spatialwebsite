"use server";
import { createClient } from "../../../utils/supabase/server";
import { v4 as uuidv4, v4 } from "uuid";


// Student Quiz Submission Handling
export async function submitStudentQuiz(payload) {
    console.log("INSIDE SUBMIT QUIZ FUNCTION FOR STUDENT", payload);
    const supabase = await createClient();
    
    try {
        // Extract data from the payload
        const { studentData, quizData } = payload;
        
        // 1. Insert the quiz grade into students_grades table
        const { data: gradeData, error: gradeError } = await supabase
            .from("students_grades")
            .insert([
                {
                    student_id: studentData.id,
                    quiz_id: quizData.quizId,
                    score: quizData.results.totalScore,
                    submitted_answers: {
                        answers: quizData.answers,
                        questionResults: quizData.results.questionResults,
                        maxScore: quizData.results.maxScore
                    },
                    time_submitted: quizData.completedAt,
                    time_taken: quizData.timeSpent,
                    course_id: studentData.course_id
                }
            ])
            .select()
            .single();
            
        if (gradeError) {
            console.error("Error inserting grade:", gradeError);
            throw gradeError;
        }
        
        // 2. Extract module name from quiz title using regex
        // Pattern matches "Module X Quiz: " and captures everything after
        const moduleNameMatch = quizData.quizTitle.match(/Module \d+ Quiz:\s*(.+)/i);
        
        if (moduleNameMatch && moduleNameMatch[1]) {
            const moduleName = moduleNameMatch[1].trim();
            
            // Get current progress
            const { data: progressData, error: progressError } = await supabase
                .from("students_progress")
                .select("module_progress")
                .eq("student_id", studentData.id)
                .eq("course_id", studentData.course_id)
                .single();
                
            if (progressError) {
                console.error("Error fetching progress:", progressError);
                throw progressError;
            }
            
            // Update the module_progress object
            const updatedModuleProgress = { ...progressData.module_progress };
            
            // Find matching module (case-insensitive comparison)
            const moduleKey = Object.keys(updatedModuleProgress).find(
                key => key.toLowerCase() === moduleName.toLowerCase()
            );
            
            if (moduleKey) {
                // Update quiz status to true
                updatedModuleProgress[moduleKey] = {
                    ...updatedModuleProgress[moduleKey],
                    quiz: true,
                    // Optionally update completed_at if all components are done
                    ...(updatedModuleProgress[moduleKey].software && 
                        updatedModuleProgress[moduleKey].workbook && 
                        updatedModuleProgress[moduleKey].mini_lecture && 
                        updatedModuleProgress[moduleKey].getting_started && 
                        updatedModuleProgress[moduleKey].introduction_video
                        ? { completed_at: new Date().toISOString() }
                        : {})
                };
                
                // Update the students_progress table
                const { data: updateData, error: updateError } = await supabase
                    .from("students_progress")
                    .update({ 
                        module_progress: updatedModuleProgress,
                        updated_at: new Date().toISOString()
                    })
                    .eq("student_id", studentData.id)
                    .eq("course_id", studentData.course_id)
                    .select()
                    .single();
                    
                if (updateError) {
                    console.error("Error updating progress:", updateError);
                    throw updateError;
                }
                
                console.log("Successfully updated module progress for:", moduleKey);
            } else {
                console.warn("Module not found in progress:", moduleName);
            }
        } else {
            console.warn("Could not extract module name from quiz title:", quizData.quizTitle);
        }
        
        return { success: true, data: gradeData };
        
    } catch (error) {
        console.error("Error in submitStudentQuiz:", error);
        return { success: false, error };
    }
}



