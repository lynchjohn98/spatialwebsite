"use server";
import { createClient } from "../../../utils/supabase/server";



// Update Student Settings and also the Students table with new students if needed
export async function updateStudentSettings(payload) {
  const supabase = await createClient();
  try {
    // Parse and prepare all students at once
    const students = typeof payload.studentSettings === 'string' 
      ? JSON.parse(payload.studentSettings) 
      : payload.studentSettings;
    
    // Process each student
    for (const student of students) {
      if (!student.student_username) continue; 
      
      // Check if student exists
      const { data: existingStudent } = await supabase
        .from("students")
        .select("id")
        .eq("student_username", student.student_username)
        .eq("course_id", payload.courseId)
        .single();
      
      const studentRecord = {
        student_username: student.student_username,
        student_first_name: student.first_name,
        student_last_name: student.last_name,
        student_gender: student.gender || 'Not Disclosed',
        student_age: student.age ? parseInt(student.age) : null,
        student_esl: student.esl_status === 'Yes',
        course_id: payload.courseId,
        student_consent: false
      };
      
      if (existingStudent) {
        // Update existing student
        const { error } = await supabase
          .from("students")
          .update(studentRecord)
          .eq("id", existingStudent.id);
        
        if (error) {
          console.error(`Error updating student ${student.student_username}:`, error);
        }
      } else {
        // Insert new student and get the generated ID
        const { data: newStudent, error: insertError } = await supabase
          .from("students")
          .insert({
            ...studentRecord,
            join_date: new Date().toISOString()
          })
          .select('id')
          .single();
        
        if (insertError) {
          console.error(`Error inserting student ${student.student_username}:`, insertError);
        } else if (newStudent) {
          // FIX: Include course_id when creating progress record
          const { error: progressError } = await supabase
            .from("students_progress")
            .insert({
              student_id: newStudent.id,
              course_id: payload.courseId,  // <-- THIS WAS MISSING
              module_progress: defaultModuleProgress,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select('*')
            .single();
          
          if (progressError) {
            console.error(`Error creating progress record for student ${student.student_username}:`, progressError);
            
            // If progress creation fails, you might want to rollback the student creation
            // or at least log this critical error
            if (progressError.code === '23503') {
              console.error('Foreign key violation - course_id does not exist in courses table');
            }
          } else {
            console.log(`Successfully created progress record for student ${student.student_username}`);
          }
        }
      }
    } 
    
    // Update course student settings
    const { data, error } = await supabase
      .from("courses_settings")
      .update({
        student_settings: payload.studentSettings,
        updated_at: new Date().toISOString()
      })
      .eq("course_id", payload.courseId)
      .single();
    
    if (error) {
      console.error("❌ Error updating course settings:", error.message);
      return { error: error.message };
    }
    
    console.log("Successfully updated settings and students");
    return { success: true, data };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { error: "An unexpected error occurred" };
  }
}

export async function deleteStudent(payload) {
  console.log("Running async with this payload: ", payload);

  const supabase = await createClient();

  try {
    // Start a transaction-like operation
    // First, get the current student_settings from course_settings
    const { data: courseSettings, error: fetchError } = await supabase
      .from("courses_settings")
      .select("student_settings")
      .eq("course_id", payload.courseId)
      .single();

    if (fetchError) {
      console.error("Error fetching course settings:", fetchError);
      return { 
        error: "Failed to fetch course settings", 
        success: false 
      };
    }

    // Parse the student_settings JSONB
    let studentSettings = [];
    if (courseSettings?.student_settings) {
      try {
        studentSettings = JSON.parse(courseSettings.student_settings);
      } catch (parseError) {
        console.error("Error parsing student settings:", parseError);
        studentSettings = [];
      }
    }

    // Filter out the student with the matching username
    const updatedStudentSettings = studentSettings.filter(
      student => student.student_username !== payload.studentUsername
    );

    // Check if student was actually found and removed from settings
    if (studentSettings.length === updatedStudentSettings.length) {
      console.log("Student not found in course settings");
      // Continue anyway to try deleting from students table
    }

    // Update the course_settings with the filtered student list
    const { error: updateError } = await supabase
      .from("courses_settings")
      .update({ 
        student_settings: JSON.stringify(updatedStudentSettings) 
      })
      .eq("course_id", payload.courseId);

    if (updateError) {
      console.error("Error updating course settings:", updateError);
      return { 
        error: "Failed to update course settings", 
        success: false 
      };
    }

    // Now delete the student from the students table
    const { data: deletedStudent, error: deleteError } = await supabase
      .from("students")
      .delete()
      .eq("student_username", payload.studentUsername)
      .eq("course_id", payload.courseId)
      .select(); // Add select() to return deleted rows

    if (deleteError) {
      console.error("Error deleting student from students table:", deleteError);
      
      // Rollback the course_settings update if student deletion fails
      // Put the student back in the settings
      await supabase
        .from("courses_settings")
        .update({ 
          student_settings: JSON.stringify(studentSettings) // Original settings
        })
        .eq("course_id", payload.courseId);

      return { 
        error: deleteError.message, 
        success: false 
      };
    }

    console.log("Successfully deleted student from both tables");
    return { 
      success: true, 
      data: {
        deletedStudent: deletedStudent?.[0] || null,
        updatedSettingsCount: updatedStudentSettings.length,
        removedFromSettings: studentSettings.length !== updatedStudentSettings.length
      }
    };

  } catch (error) {
    console.error("Unexpected error in deleteStudent:", error);
    return { 
      error: error.message || "An unexpected error occurred", 
      success: false 
    };
  }
}


// Define default module list to load for new students added to the course. Students will have the intro video auto-true 
// so that they do not need to watch it. Will be true.
const defaultModuleProgress = 
{
  "Pre-Module: The Importance of Spatial Skills": {
    "introduction_video": true,
    "mini_lecture": true,
    "software": true,
    "getting_started": true,
    "workbook": false,
    "quiz": true,
    "completed_at": null
  },
  "Combining Solids": {
    "introduction_video": true,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Surfaces and Solids of Revolution": {
    "introduction_video": true,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Isometric Drawings and Coded Plans": {
    "introduction_video": true,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Flat Patterns": {
    "introduction_video": true,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Rotation of Objects About a Single Axis": {
    "introduction_video": true,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Reflections and Symmetry": {
    "introduction_video": true,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Cutting Planes and Cross-Sections": {
    "introduction_video": true,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Rotation of Objects About Two or More Axes": {
    "introduction_video": true,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Orthographic Projection": {
    "introduction_video": true,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Inclined and Curved Surfaces": {
    "introduction_video": true,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  }
};