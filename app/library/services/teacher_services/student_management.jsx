"use server";
import { createClient } from "../../../utils/supabase/server";

// Update Student Settings - Students table is source of truth
export async function updateStudentSettings(payload) {
  const supabase = await createClient();
  try {
    // First, get the course data to check the gender setting
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("course_gender")
      .eq("id", payload.courseId)
      .single();
    
    if (courseError) {
      console.error("Error fetching course data:", courseError);
    }
    
    // Parse incoming students data
    const incomingStudents = typeof payload.studentSettings === 'string' 
      ? JSON.parse(payload.studentSettings) 
      : payload.studentSettings;

    console.log("Incoming students from frontend:", incomingStudents);
    console.log("Course gender setting:", courseData?.course_gender);
    
    // Array to store the final cleaned student data for courses_settings
    const finalStudentSettings = [];
    
    // Process each student - INSERT/UPDATE in students table FIRST
    for (const student of incomingStudents) {
      if (!student.student_username) continue;
      
      // Clean up gender value
      let finalGender = student.gender;
      
      // Convert "Not Disclosed" to "Other" and handle empty values
      if (!finalGender || finalGender === '' || finalGender === 'Not Disclosed') {
        finalGender = 'Other';
      }
      
      // Override for single-gender courses
      if (courseData?.course_gender === 'Male') {
        finalGender = 'Male';
      } else if (courseData?.course_gender === 'Female') {
        finalGender = 'Female';
      } else if (courseData?.course_gender === 'Mixed') {
        // Ensure valid gender for mixed courses
        if (!['Male', 'Female', 'Other'].includes(finalGender)) {
          finalGender = 'Other';
        }
      }
      
      // Check if student exists in students table
      const { data: existingStudent } = await supabase
        .from("students")
        .select("id, student_consent, student_notes, consent_date")
        .eq("student_username", student.student_username)
        .eq("course_id", payload.courseId)
        .single();
      
      const studentRecord = {
        student_username: student.student_username,
        student_first_name: student.first_name || '',
        student_last_name: student.last_name || '',
        student_gender: finalGender,
        student_age: student.age ? parseInt(student.age) : null,
        student_esl: student.esl_status === 'Yes',
        course_id: payload.courseId,
        // Preserve existing consent data if it exists
        student_consent: existingStudent?.student_consent || student.student_consent || false,
        student_notes: existingStudent?.student_notes || student.student_notes || null,
        consent_date: existingStudent?.consent_date || student.consent_date || null
      };
      
      let studentId;
      
      if (existingStudent) {
        // Update existing student
        const { error } = await supabase
          .from("students")
          .update({
            ...studentRecord,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingStudent.id);
        
        if (error) {
          console.error(`Error updating student ${student.student_username}:`, error);
          continue; // Skip to next student
        }
        
        studentId = existingStudent.id;
        console.log(`Updated student ${student.student_username} with gender: ${finalGender}`);
      } else {
        // Insert new student
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
          continue; // Skip to next student
        }
        
        studentId = newStudent.id;
        console.log(`Inserted new student ${student.student_username} with gender: ${finalGender}`);
        
        // Create progress record for new student
        const { error: progressError } = await supabase
          .from("students_progress")
          .insert({
            student_id: studentId,
            course_id: payload.courseId,
            module_progress: defaultModuleProgress,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (progressError) {
          console.error(`Error creating progress for student ${student.student_username}:`, progressError);
        }
      }
      
      // Build clean student object for courses_settings
      const cleanStudent = {
        student_id: studentId,
        student_username: student.student_username,
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        gender: finalGender,
        age: student.age || '',
        esl_status: student.esl_status || 'No',
        student_consent: studentRecord.student_consent,
        student_notes: studentRecord.student_notes,
        consent_date: studentRecord.consent_date
      };
      
      finalStudentSettings.push(cleanStudent);
    }
    
    // Now update courses_settings with the clean, processed data
    const { error: updateError } = await supabase
      .from("courses_settings")
      .update({
        student_settings: JSON.stringify(finalStudentSettings),
        updated_at: new Date().toISOString()
      })
      .eq("course_id", payload.courseId);
    
    if (updateError) {
      console.error("❌ Error updating course settings:", updateError.message);
      return { error: updateError.message };
    }
    
    console.log(`Successfully updated ${finalStudentSettings.length} students`);
    
    // Also ensure we sync the full student list back to courses_settings
    // This handles any students that might exist in the table but weren't in the update
    const syncResult = await syncStudentSettingsFromStudentsTable(payload.courseId);
    if (!syncResult.success) {
      console.warn("Warning: Could not fully sync student settings:", syncResult.error);
    }
    
    return { success: true, data: finalStudentSettings };
    
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return { error: "An unexpected error occurred" };
  }
}

// Clean and migrate existing student_settings JSONB data
export async function cleanExistingStudentSettings(courseId) {
  const supabase = await createClient();
  try {
    // Get current settings
    const { data: courseSettings, error: fetchError } = await supabase
      .from("courses_settings")
      .select("student_settings")
      .eq("course_id", courseId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching course settings:", fetchError);
      return { error: fetchError.message };
    }
    
    // Get course gender setting
    const { data: courseData } = await supabase
      .from("courses")
      .select("course_gender")
      .eq("id", courseId)
      .single();
    
    // Parse existing settings
    let existingSettings = [];
    if (courseSettings?.student_settings) {
      if (typeof courseSettings.student_settings === 'string') {
        try {
          existingSettings = JSON.parse(courseSettings.student_settings);
        } catch (e) {
          console.error("Error parsing existing settings:", e);
          existingSettings = [];
        }
      } else {
        existingSettings = courseSettings.student_settings;
      }
    }
    
    // Clean up each student entry
    const cleanedSettings = existingSettings.map(student => {
      // Fix gender
      let gender = student.gender || 'Other';
      if (gender === 'Not Disclosed' || gender === '') {
        gender = 'Other';
      }
      
      // Apply course-specific gender rules
      if (courseData?.course_gender === 'Male') {
        gender = 'Male';
      } else if (courseData?.course_gender === 'Female') {
        gender = 'Female';
      } else if (!['Male', 'Female', 'Other'].includes(gender)) {
        gender = 'Other';
      }
      
      // Return cleaned object without unnecessary fields
      return {
        student_id: student.student_id || student.id,
        student_username: student.student_username,
        first_name: student.first_name || '',
        last_name: student.last_name || '',
        gender: gender,
        age: student.age || '',
        esl_status: student.esl_status || 'No',
        student_consent: student.student_consent || false,
        student_notes: student.student_notes || null,
        consent_date: student.consent_date || null
      };
    });
    
    // Update with cleaned data
    const { error: updateError } = await supabase
      .from("courses_settings")
      .update({
        student_settings: JSON.stringify(cleanedSettings),
        updated_at: new Date().toISOString()
      })
      .eq("course_id", courseId);
    
    if (updateError) {
      console.error("Error updating cleaned settings:", updateError);
      return { error: updateError.message };
    }
    
    console.log(`Successfully cleaned student_settings for course ${courseId}`);
    return { success: true, data: cleanedSettings };
    
  } catch (err) {
    console.error("Error cleaning student settings:", err);
    return { error: "Failed to clean student settings" };
  }
}

// Batch clean all courses' student_settings (for admin use)
export async function batchCleanAllStudentSettings() {
  const supabase = await createClient();
  try {
    // Get all courses
    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("id, course_gender");
    
    if (coursesError) {
      console.error("Error fetching courses:", coursesError);
      return { error: coursesError.message };
    }
    
    const results = [];
    
    // Clean each course's settings
    for (const course of courses) {
      const cleanResult = await cleanExistingStudentSettings(course.id);
      results.push({
        courseId: course.id,
        success: cleanResult.success,
        error: cleanResult.error
      });
      
      // Also sync from students table to ensure consistency
      const syncResult = await syncStudentSettingsFromStudentsTable(course.id);
      if (!syncResult.success) {
        console.warn(`Could not sync course ${course.id}:`, syncResult.error);
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    console.log(`Batch cleaning complete: ${successCount} succeeded, ${failureCount} failed`);
    
    return { 
      success: true, 
      results,
      summary: {
        total: courses.length,
        succeeded: successCount,
        failed: failureCount
      }
    };
    
  } catch (err) {
    console.error("Error in batch cleaning:", err);
    return { error: "Batch cleaning failed" };
  }
}

// Sync function to rebuild courses_settings from students table
export async function syncStudentSettingsFromStudentsTable(courseId) {
  const supabase = await createClient();
  try {
    // Get all students from the students table for this course
    const { data: students, error: fetchError } = await supabase
      .from("students")
      .select("*")
      .eq("course_id", courseId)
      .order("student_last_name", { ascending: true });
    
    if (fetchError) {
      console.error("Error fetching students:", fetchError);
      return { error: fetchError.message };
    }
    
    // Get course gender setting
    const { data: courseData } = await supabase
      .from("courses")
      .select("course_gender")
      .eq("id", courseId)
      .single();
    
    // Build clean student settings array from students table data
    const cleanStudentSettings = students.map(student => {
      // Clean up gender
      let gender = student.student_gender;
      if (!gender || gender === 'Not Disclosed') {
        gender = 'Other';
      }
      
      // Apply course-specific rules
      if (courseData?.course_gender === 'Male') {
        gender = 'Male';
      } else if (courseData?.course_gender === 'Female') {
        gender = 'Female';
      }
      
      return {
        student_id: student.id,
        student_username: student.student_username,
        first_name: student.student_first_name || '',
        last_name: student.student_last_name || '',
        gender: gender,
        age: student.student_age ? student.student_age.toString() : '',
        esl_status: student.student_esl ? 'Yes' : 'No',
        student_consent: student.student_consent || false,
        student_notes: student.student_notes || null,
        consent_date: student.consent_date || null
      };
    });
    
    // Update courses_settings with the rebuilt data
    const { error: updateError } = await supabase
      .from("courses_settings")
      .update({
        student_settings: JSON.stringify(cleanStudentSettings),
        updated_at: new Date().toISOString()
      })
      .eq("course_id", courseId);
    
    if (updateError) {
      console.error("Error updating course settings:", updateError);
      return { error: updateError.message };
    }
    
    console.log(`Successfully synced ${cleanStudentSettings.length} students from students table`);
    return { success: true, data: cleanStudentSettings };
    
  } catch (err) {
    console.error("Error in sync:", err);
    return { error: "Sync failed" };
  }
}

// Fetch students directly from students table instead of courses_settings
export async function fetchStudentsFromTable(courseId) {
  const supabase = await createClient();
  try {
    const { data: students, error } = await supabase
      .from("students")
      .select("*")
      .eq("course_id", courseId)
      .order("student_last_name", { ascending: true });
    
    if (error) {
      console.error("Error fetching students:", error);
      return { error: error.message };
    }
    
    // Transform to match frontend format
    const transformedStudents = students.map(student => ({
      student_id: student.id,
      student_username: student.student_username,
      first_name: student.student_first_name || '',
      last_name: student.student_last_name || '',
      gender: student.student_gender === 'Not Disclosed' ? 'Other' : (student.student_gender || 'Other'),
      age: student.student_age ? student.student_age.toString() : '',
      esl_status: student.student_esl ? 'Yes' : 'No',
      student_consent: student.student_consent || false,
      student_notes: student.student_notes || null,
      consent_date: student.consent_date || null
    }));
    
    return { success: true, data: transformedStudents };
    
  } catch (err) {
    console.error("Error fetching students:", err);
    return { error: "Failed to fetch students" };
  }
}

export async function deleteStudent(payload) {
  console.log("Deleting student:", payload);
  const supabase = await createClient();

  try {
    // Get student ID if we only have username
    let studentId = payload.studentId;
    
    if (!studentId && payload.studentUsername) {
      const { data: studentRecord } = await supabase
        .from("students")
        .select("id")
        .eq("student_username", payload.studentUsername)
        .eq("course_id", payload.courseId)
        .single();
      
      if (studentRecord) {
        studentId = studentRecord.id;
      }
    }

    // Delete related records if we have a student ID
    if (studentId) {
      // Delete from students_progress
      await supabase
        .from("students_progress")
        .delete()
        .eq("student_id", studentId)
        .eq("course_id", payload.courseId);
      
      // Delete from students_grades
      await supabase
        .from("students_grades")
        .delete()
        .eq("student_id", studentId)
        .eq("course_id", payload.courseId);
    }

    // Delete from students table
    const { error: deleteError } = await supabase
      .from("students")
      .delete()
      .eq("student_username", payload.studentUsername)
      .eq("course_id", payload.courseId);

    if (deleteError) {
      console.error("Error deleting student:", deleteError);
      return { error: deleteError.message, success: false };
    }

    // Rebuild courses_settings from remaining students
    await syncStudentSettingsFromStudentsTable(payload.courseId);
    
    console.log("Successfully deleted student and synced settings");
    return { success: true };

  } catch (error) {
    console.error("Unexpected error in deleteStudent:", error);
    return { error: error.message || "An unexpected error occurred", success: false };
  }
}

// Default module progress for new students
const defaultModuleProgress = {
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