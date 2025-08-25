"use server";
import { createClient } from "../../utils/supabase/server";

//Fresh course inserted into backend
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
                course_name: payload.courseName,
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

    return { success: true, courseId: data.id };
}

//This runs to auto generate course settings part of the boilerplate of every course
export async function insertCourseSettings(allPayload) {
    const supabase = await createClient();
    const studentSettings = allPayload.studentSettings || '{}';
    const moduleSettings = allPayload.moduleSettings || '{}';
    const quizSettings = allPayload.quizSettings || '{}';
    try {
        const { data, error } = await supabase
            .from("courses_settings")
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

// Course settings that are extra modules for the teacher to access
export async function retrieveSupplementalCourseInformation(payload: { id: any; }) {
  console.log("Retrieving course settings", payload);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", payload.id)
    .single();
  if (error) {
    console.error("❌ Supabase Insert Error:", error.message);
    return { error: error.message };
  }
  return { success: true, data };
}


// Course Settings Updated inside the Course Settings dashboard nav bar (only module / quiz settings)
export async function updateCourseSettings(payload: { courseId: any; moduleSettings: any; quizSettings: any; }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses_settings")
    .update({
      module_settings: payload.moduleSettings,
      quiz_settings: payload.quizSettings,
      updated_at : new Date().toISOString()
    })
    .eq("course_id", payload.courseId)
    .single();
  if (error) {
    console.error("❌ Supabase Insert Error:", error.message);
    return { error: error.message };
  }
  else {
    console.log ("Updated course settings", data);
    return { success: true, data };
  }
}

// Fix for retrieving modules
export async function retrieveModules(payload: { id: any; }) {
  console.log("Fetching modules", payload);
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("courses_settings")
      .select("module_settings")
      .eq("course_id", payload.id)
      .maybeSingle(); // Use maybeSingle instead of single
      
    if (error) {
      console.error("❌ Supabase Query Error:", error.message);
      return { error: error.message };
    }
    
    if (!data) {
      console.log("No module settings found for course ID:", payload.id);
      return { success: true, data: { module_settings: [] } }; // Return empty default
    }
    
    return { success: true, data };
  } catch (err) {
    console.error("❌ Error retrieving modules:", err);
    return { error: "Failed to retrieve modules" };
  }
}

// Fix for retrieving quizzes
export async function retrieveQuizzes(payload: { id: any; }) {
  console.log("Fetching quizzes", payload);
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("courses_settings")
      .select("quiz_settings")
      .eq("course_id", payload.id)
      .maybeSingle(); // Use maybeSingle instead of single
      
    if (error) {
      console.error("❌ Supabase Query Error:", error.message);
      return { error: error.message };
    }
    
    if (!data) {
      console.log("No quiz settings found for course ID:", payload.id);
      return { success: true, data: { quiz_settings: [] } }; // Return empty default
    }
    
    return { success: true, data };
  } catch (err) {
    console.error("❌ Error retrieving quizzes:", err);
    return { error: "Failed to retrieve quizzes" };
  }
}

// Fix for retrieving course settings
export async function retrieveCourseSettings(payload: { id: any; }) {
  console.log("Retrieving course settings", payload);
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("courses_settings")
      .select("*")
      .eq("course_id", payload.id)
      .maybeSingle(); // Use maybeSingle instead of single
    if (error) {
      console.error("❌ Supabase Query Error:", error.message);
      return { error: error.message };
    }
    if (!data) {
      console.log("No settings found for course ID:", payload.id);
      return { success: true, data: null };
    }
    return { success: true, data };
  } catch (err) {
    console.error("❌ Error retrieving course settings:", err);
    return { error: "Failed to retrieve course settings" };
  }
}



export async function deleteCourse(payload) {
  const supabase = await createClient();
  const { data, error } = await supabase
      .from("courses")
      .delete()
        .eq("id", payload);
    if (error) {
        console.error("❌ Supabase Delete Error:", error.message);
        return { error: error.message };
    }
    return { success: true, data };
}



//Student Table functions to help with username generation



// Course consent settings, specifically to update the student settings of consent in the students page and also the courses_settings student_settings page
export async function updateStudentConsentSettings(updatePayload, courseId) {
  try {
    const supabase = await createClient();
    
    // Update each student's consent status individually in students table
    const results = [];
    console.log("Update Payload:", updatePayload);

    for (const student of updatePayload) {
      console.log(student.student_consent);
      const { data, error } = await supabase
        .from('students')
        .update({ 
          student_consent: student.student_consent,
          student_notes: student.student_notes,
          consent_date: student.consent_date
        })
        .eq('student_username', student.student_username)
        .select();
      
      if (error) {
        console.error(`Error updating student ${student.student_username}:`, error);
        results.push({ username: student.student_username, success: false, error: error.message });
      } else {
        results.push({ username: student.student_username, success: true });
        console.log(`Successfully updated student ${student.student_username}`);
      }
    }
    
    // Check if all updates succeeded
    const failedUpdates = results.filter(r => !r.success);
    if (failedUpdates.length > 0) {
      return {
        success: false,
        error: `Failed to update ${failedUpdates.length} students`,
        details: failedUpdates
      };
    }

    // Now update the student_settings JSONB in courses_settings table
    try {
      // First, fetch the current student_settings
      const { data: currentSettings, error: fetchError } = await supabase
        .from('courses_settings')
        .select('student_settings')
        .eq('course_id', courseId)
        .single();

      if (fetchError) {
        console.error('Error fetching current settings:', fetchError);
        return {
          success: false,
          error: `Failed to fetch current settings: ${fetchError.message}`
        };
      }

      // Parse the current settings
      let studentSettings = [];
      if (currentSettings && currentSettings.student_settings) {
        studentSettings = typeof currentSettings.student_settings === 'string' 
          ? JSON.parse(currentSettings.student_settings)
          : currentSettings.student_settings;
      }

      // Create a map for quick lookup of updates
      const updateMap = new Map();
      updatePayload.forEach(update => {
        updateMap.set(update.student_username, {
          student_consent: update.student_consent,
          student_notes: update.student_notes,
          consent_date: update.consent_date
        });
      });

      // Update the student_settings array with new consent data
      const updatedStudentSettings = studentSettings.map(student => {
        if (updateMap.has(student.student_username)) {
          const updates = updateMap.get(student.student_username);
          return {
            ...student,
            student_consent: updates.student_consent,
            student_notes: updates.student_notes || student.student_notes,
            consent_date: updates.consent_date || student.consent_date
          };
        }
        return student;
      });

      // Update the courses_settings table with the modified student_settings
      const { data: updateData, error: updateError } = await supabase
        .from('courses_settings')
        .update({ 
          student_settings: JSON.stringify(updatedStudentSettings)
        })
        .eq('course_id', courseId)
        .select();

      if (updateError) {
        console.error('Error updating course settings:', updateError);
        return {
          success: false,
          error: `Students updated but failed to update course settings: ${updateError.message}`
        };
      }

      console.log('Successfully updated course settings with new consent data');

    } catch (jsonError) {
      console.error('Error updating student_settings JSONB:', jsonError);
      return {
        success: false,
        error: `Students updated but failed to update course settings: ${jsonError.message}`
      };
    }

    return {
      success: true,
      message: `Successfully updated consent for ${updatePayload.length} students in both tables`,
      results: results
    };
    
  } catch (error) {
    console.error('Error updating student consent:', error);
    return {
      success: false,
      error: error.message
    };
  }
}



// Fetch Data for the Student Course Progress Page
export async function fetchAllStudentCourseProgress(payload) {
  console.log("Here:", payload);
  const supabase = createClient();


}




