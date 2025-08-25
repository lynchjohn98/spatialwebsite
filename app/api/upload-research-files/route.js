// app/api/upload-research-files/route.js
import { NextRequest, NextResponse } from 'next/server';
import { createAPIClient } from '../../utils/supabase/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const courseId = formData.get('courseId');
    const files = formData.getAll('files');
    const teacherId = formData.get('teacherId');

    console.log("HERE with teacherId,", teacherId)

    const supabase = await createAPIClient();
    
    // First verify the teacher exists in the database
    
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('id')
      .eq('id', teacherId)
      .single();
    
    if (!teacher || teacherError) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized: Teacher not found'
      }, { status: 401 });
    }
    
    const uploadedFilesData = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${courseId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('research-documents')
        .upload(fileName, buffer, {
          contentType: file.type,
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('research-documents')
        .getPublicUrl(fileName);
      
      // Save file reference to database with teacher_id
      const { data: dbData, error: dbError } = await supabase
        .from('research_documents')
        .insert({
          course_id: courseId,
          teacher_id: teacherId, // Add teacher ID
          file_name: file.name,
          file_path: fileName,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          uploaded_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (dbError) throw dbError;
      
      uploadedFilesData.push(dbData);
    }
    
    return NextResponse.json({
      success: true,
      data: uploadedFilesData
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}