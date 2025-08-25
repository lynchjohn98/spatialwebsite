"use server";
import { createClient } from "../../utils/supabase/server";
import { v4 as uuidv4, v4 } from "uuid";

export async function createTeacherAccount(payload) {
  const supabase = await createClient();
  console.log("Creating teacher account with payload:", payload);
  try {
    const { data, error } = await supabase
      .from("teachers")
      .insert([
        {
          id: uuidv4(), // Generate a unique ID for the teacher
          name: payload.name,
          username: payload.username,
          password: payload.password,
          training_complete: payload.training_complete,
          research_consent: payload.research_consent,
          pretest_complete: payload.pretest_complete,
          posttest_complete: payload.posttest_complete,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select("*")
      .single();
    //Access the unique id that was generated from the submission page:
    const teacherId = data.id;
    try {
      const { data, error } = await supabase
        .from("teachers_progress")
        .insert([
          {
            teacher_id: teacherId,
            module_progress: teacherModuleProgress,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);

    } catch (error) {
      console.error("❌ Supabase Select Error:", error.message);
      return { error: "An error occurred while fetching teacher progress." };
    }
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

/*
Function logins an existing account and access all elements that are associated with the accounts
- teachers information
-
*/
export async function loginTeacherAccount(payload) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("teachers")
      .select(`
        *,
        courses (*)
      `)
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

export async function logoutTeacherAccount() {
  sessionStorage.clear();

}


export async function getTeacherData(payload) {
  console.log("Inside getTeacherData with ID:", payload);
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("teachers")
      .select(`
    *,
    teachers_grades(*),
    teachers_progress(*)
  `)
      .eq("id", payload.id)
      .single();

    if (error) {
      console.error("❌ Supabase Select Error in getTeacherData:", error.message);
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
    const teacherData = payload.teacher || payload;
    const { id, created_at, ...updatedFields } = teacherData;

    const finalUpdates = {
      ...updatedFields,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("teachers")
      .update(finalUpdates)
      .eq("id", id)
      .select();

    if (error) {
      console.error("❌ Supabase Update Error:", error.message);
      return { error: error.message };
    }
    return { success: true, data: data[0] };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function submitTeacherQuiz(payload) {
  const supabase = await createClient();
  try {
    const { teacherData, quizData } = payload;
    const { data, error } = await supabase
      .from("teachers")
      .update(
        {
          pretest_complete: teacherData.pretest_complete,
          posttest_complete: teacherData.posttest_complete,
          updated_at: new Date().toISOString()
        }
      )
      .eq("id", teacherData.id);
    if (error) {
      console.error("❌ Supabase Update Error in submitTeacherQuiz:", error.message);
      return { error: error.message };
    }
    const { data: quizDataResponse, error: quizError } = await supabase
      .from("teachers_grades")
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
    return { success: true, data, quizData: quizDataResponse };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}


export async function getAllTeacherCourses(payload) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("course_teacher_id", payload.id)
      .order("created_at", { ascending: false });
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

export async function retrieveTeacherCourse(payload) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("course_join_code", payload.joinCode)
    if (error) {
      console.error("❌ Supabase Query Error:", error.message);
      return { error: error.message };
    }
    if (!data || data.length === 0) {
      return { error: "No course found with these credentials. Please check your join code and password." };
    }
    if (data.length > 1) {
      console.warn("Multiple courses found with the same credentials. Using the first one.");
    }
    return { success: true, data: data[0] };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

// Update teacher progress in backend when they use a checkbox in the module pages

export async function updateTeacherModuleProgress(teacher_id: any, module_title: any, progress_section: any) {
  const supabase = await createClient();
  console.log("Inside here", teacher_id, module_title, progress_section);

  try {
    // First, get the current progress
    const { data, error } = await supabase
      .from("teachers_progress")
      .select("module_progress")
      .eq("teacher_id", teacher_id)
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
      .from("teachers_progress")
      .update({
        module_progress: updatedProgress,
        updated_at: new Date().toISOString()
      })
      .eq("teacher_id", teacher_id);

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

// Fetch teacher module progress
export async function fetchTeacherModuleProgress(teacher_id: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teachers_progress")
    .select("*")
    .eq("teacher_id", teacher_id);
  if (error) {
    console.error("❌ Supabase Fetch Error:", error.message);
    return { error: error.message };
  }
  return { success: true, data };
}

// Default Teacher Progress for each Module and for Each Quiz
const teacherModuleProgress =
{
  "Flat Patterns":{"quiz": false, "order": 4, "software": false, "workbook": false, "completed_at": null, "mini_lecture": false, "getting_started": false, "introduction_video": false}, 
  "Combining Solids": {"quiz": true, "order": 1, "software": true, "workbook": true, "completed_at": null,"mini_lecture": true, "getting_started": true, "introduction_video": true}, 
  "Orthographic Projection": { "quiz": false, "order": 9, "software": false, "workbook": false, "completed_at": null, "mini_lecture": false, "getting_started": false, "introduction_video": false },
  "Reflections and Symmetry": { "quiz": false, "order": 6, "software": false, "workbook": false, "completed_at": null, "mini_lecture": false, "getting_started": false, "introduction_video": false },
  "Inclined and Curved Surfaces": { "quiz": false, "order": 10, "software": false, "workbook": false, "completed_at": null, "mini_lecture": false, "getting_started": false, "introduction_video": false },
  "Cutting Planes and Cross-Sections": { "quiz": false, "order": 7, "software": false, "workbook": false, "completed_at": null, "mini_lecture": false, "getting_started": false, "introduction_video": false },
  "Surfaces and Solids of Revolution": { "quiz": false, "order": 2, "software": false, "workbook": false, "completed_at": null, "mini_lecture": false, "getting_started": false, "introduction_video": false },
  "Isometric Drawings and Coded Plans": { "quiz": false, "order": 3, "software": false, "workbook": false, "completed_at": null, "mini_lecture": false, "getting_started": false, "introduction_video": false },
  "Rotation of Objects About a Single Axis": { "quiz": false, "order": 5, "software": false, "workbook": false, "completed_at": null, "mini_lecture": false, "getting_started": false, "introduction_video": false },
  "Rotation of Objects About Two or More Axes": { "quiz": false, "order": 8, "software": false, "workbook": false, "completed_at": null, "mini_lecture": false, "getting_started": false, "introduction_video": false },
  "Pre-Module: The Importance of Spatial Skills": { "quiz": true, "order": 0, "software": true, "workbook": true, "completed_at": null, "mini_lecture": true, "getting_started": true, "introduction_video": true }
}




export async function fetchUploadedFiles(courseId) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('research_documents')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error('Error fetching uploaded files:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
}

// Delete a research file
export async function deleteResearchFile(fileId, filePath) {
  try {
    const supabase = await createClient();

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('research-documents')
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await supabase
      .from('research_documents')
      .delete()
      .eq('id', fileId);

    if (dbError) throw dbError;

    return {
      success: true
    };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}