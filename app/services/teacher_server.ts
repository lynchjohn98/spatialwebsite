"use server";
import { createClient } from "../../utils/supabase/server";
import { v4 as uuidv4, v4 } from "uuid";
import { generateStudentCode } from "../../utils/serverhelpers";


//Generates a new teacher account with the premade trainings set to false

export async function createTeacherAccount(payload) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("teachers")
      .insert([
        {
          id: uuidv4(), // Generate a unique ID for the teacher
          name: payload.name,
          username: payload.username,
          password: payload.password,
          training_complete: false,
          pretest_complete: false,
          posttest_complete: false,
          premodule_training: false,
          module1_training: false,
          module2_training: false,
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


export async function loginTeacherAccount(payload) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
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

export async function updateTeacherAccount(payload) {
  const supabase = await createClient();
  try {
    const { teacher, quiz } = payload;
    console.log("Teacher data:", teacher);  
    console.log("Quiz data:", quiz);
    const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .eq("id", teacher.id);
    if (error) {
      console.error("❌ Supabase Update Error in updateTeacherAccount:", error.message);
      return { error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function submitTeacherQuiz(payload) {
    const supabase = await createClient();
    try {
        const { teacherData, quizData } = payload;
        console.log("Teacher data:", teacherData);
        console.log("Quiz data:", quizData);
        
        // First, get the quiz information to determine the type
        const { data: quiz, error: quizFetchError } = await supabase
            .from("quizzes")
            .select("*")
            .eq("id", quizData.quizId)
            .single();

        if (quizFetchError || !quiz) {
            console.error("❌ Quiz not found:", quizFetchError?.message);
            return { error: "Quiz not found" };
        }

        // Determine which completion field to update
        const getQuizFieldMapping = (quizName) => {
            const name = quizName.toLowerCase();
            
            if (name.includes('practice')) {
                return 'practicequiz_complete';
            } else if (name.includes('pre-test') || name.includes('pretest')) {
                return 'pretest_complete';
            } else if (name.includes('post-test') || name.includes('posttest')) {
                return 'posttest_complete';
            } else {
                return null; // Handle unknown quiz types
            }
        };

        const completionField = getQuizFieldMapping(quiz.name);
        
        if (!completionField) {
            console.error(`❌ Unknown quiz type: ${quiz.name}`);
            return { error: `Unknown quiz type: ${quiz.name}` };
        }

        // Update teacher completion status
        const updateFields = {
            [completionField]: true,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from("teachers")
            .update(updateFields)
            .eq("id", teacherData.id);
            
        if (error) {
            console.error("❌ Supabase Update Error in submitTeacherQuiz:", error.message);
            return { error: error.message };
        }
        
        // Insert quiz results into teacher_grades
        const { data: quizDataResponse, error: quizError } = await supabase
            .from("teacher_grades")
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
        
        console.log("✅ Quiz submission successful for:", quiz.name);
        return { success: true, data, quizData: quizDataResponse };
    } catch (err) {
        console.error("❌ Unexpected error:", err);
        return { error: "An unexpected error occurred. Please try again." };
    }
}
