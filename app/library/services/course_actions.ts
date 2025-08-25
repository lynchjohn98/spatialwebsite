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


export async function updateStudentSettings(payload) {

  const supabase = await createClient();
  try {
    // Parse and prepare all students at once
    const students = typeof payload.studentSettings === 'string' 
      ? JSON.parse(payload.studentSettings) 
      : payload.studentSettings  
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
          .select('id')  // Return the newly created student's ID
          .single();
        
        if (insertError) {
          console.error(`Error inserting student ${student.student_username}:`, insertError);
        } else if (newStudent) {
          // Create a corresponding progress record for the new student
          const { error: progressError } = await supabase
            .from("students_progress")
            .insert({
              student_id: newStudent.id,
              module_progress: defaultModuleProgress
              // All other fields will default to false as per your schema
            })
            .select('*')
            .single();
          
          if (progressError) {
            console.error(`Error creating progress record for student ${student.student_username}:`, progressError);
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


// Student Grade Data Table
export async function getStudentGradeData(payload) {
     const supabase = await createClient();
    const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("course_id", payload.courseId)
        .single();
    if (error) {
        console.error("❌ Supabase Insert Error:", error.message);
        return { error: error.message };
    }
    return { success: true, data: data };
}


// Define the const to help with errors
const defaultModuleProgress = 
{
  "Pre-Module: The Importance of Spatial Skills": {
    "introduction_video": false,
    "mini_lecture": true,
    "software": true,
    "getting_started": true,
    "workbook": false,
    "quiz": true,
    "completed_at": null
  },
  "Combining Solids": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Surfaces and Solids of Revolution": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Isometric Sketching and Coded Plans": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Flat Patterns": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Rotation of Objects About a Single Axis": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Reflections and Symmetry": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Cutting Planes and Cross-Sections": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Rotation of Objects About Two or More Axes": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Orthographic Projection": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  },
  "Inclined and Curved Surfaces": {
    "introduction_video": false,
    "mini_lecture": false,
    "software": false,
    "getting_started": false,
    "workbook": false,
    "quiz": false,
    "completed_at": null
  }
};

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
export async function fetchStudentProgress(courseId) {
  try {
    const supabase = await createClient();
    
    // Fetch all student progress for the course
    const { data: progressData, error: progressError } = await supabase
      .from('students_progress')
      .select('*')
      .eq('course_id', courseId);
    
    if (progressError) {
      console.error('Error fetching progress:', progressError);
      return { success: false, error: progressError.message };
    }
    
    return {
      success: true,
      data: progressData || []
    };
  } catch (error) {
    console.error('Error in fetchStudentProgress:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function fetchStudentGrades(courseId) {
  try {
    const supabase = await createClient();
    
    // Fetch all quiz grades for the course
    const { data: gradesData, error: gradesError } = await supabase
      .from('students_grades')
      .select('*')
      .eq('course_id', courseId)
      .order('time_submitted', { ascending: false });
    
    if (gradesError) {
      console.error('Error fetching grades:', gradesError);
      return { success: false, error: gradesError.message };
    }
    
    return {
      success: true,
      data: gradesData || []
    };
  } catch (error) {
    console.error('Error in fetchStudentGrades:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function fetchCourseProgressData(courseId) {
  try {
    const supabase = await createClient();
    
    // Fetch course settings
    const { data: settings, error: settingsError } = await supabase
      .from('courses_settings')
      .select('student_settings, module_settings')
      .eq('course_id', courseId)
      .single();
    
    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
      return { success: false, error: settingsError.message };
    }
    
    // Fetch students with their IDs
    const studentSettings = JSON.parse(settings.student_settings || "[]");
    const studentUsernames = studentSettings.map(s => s.student_username);
    
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id, student_username, student_first_name, student_last_name')
      .in('student_username', studentUsernames);
    
    if (studentsError) {
      console.error('Error fetching students:', studentsError);
      return { success: false, error: studentsError.message };
    }
    
    // Map student IDs to the settings
    const enrichedStudents = studentSettings.map(s => {
      const student = students.find(st => st.student_username === s.student_username);
      return {
        ...s,
        id: student?.id,
        first_name: s.first_name || student?.student_first_name,
        last_name: s.last_name || student?.student_last_name
      };
    });
    
    // Fetch all progress data
    const studentIds = students.map(s => s.id).filter(Boolean);
    
    const { data: progressData, error: progressError } = await supabase
      .from('students_progress')
      .select('*')
      .eq('course_id', courseId)
      .in('student_id', studentIds);
    
    if (progressError) {
      console.error('Error fetching progress:', progressError);
      return { success: false, error: progressError.message };
    }
    
    // Fetch all grades
    const { data: gradesData, error: gradesError } = await supabase
      .from('students_grades')
      .select('*')
      .eq('course_id', courseId)
      .in('student_id', studentIds)
      .order('time_submitted', { ascending: false });
    
    if (gradesError) {
      console.error('Error fetching grades:', gradesError);
      return { success: false, error: gradesError.message };
    }
    
    return {
      success: true,
      data: {
        students: enrichedStudents,
        moduleSettings: JSON.parse(settings.module_settings || "{}"),
        progress: progressData || [],
        grades: gradesData || []
      }
    };
  } catch (error) {
    console.error('Error in fetchCourseProgressData:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

