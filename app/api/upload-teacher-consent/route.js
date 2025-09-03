// app/api/upload-teacher-consent/route.js
import { NextRequest, NextResponse } from 'next/server';
import { createAPIClient } from '../../utils/supabase/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const teacherId = formData.get('teacherId');

    if (!file || !teacherId) {
      return NextResponse.json({
        success: false,
        message: 'File and teacher ID are required'
      }, { status: 400 });
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        message: 'File size must be less than 10MB'
      }, { status: 400 });
    }

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
        message: 'Unauthorized: Teacher not found'
      }, { status: 401 });
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `consent-forms/${teacherId}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('teacher-consent-files')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({
        success: false,
        message: uploadError.message
      }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('teacher-consent-files')
      .getPublicUrl(fileName);

    // Save file record to database
    const { data, error } = await supabase
      .from('teacher_consent_files')
      .insert({
        teacher_id: teacherId,
        file_name: file.name,
        file_path: fileName,
        file_url: publicUrl,
        file_size: file.size,
        file_type: file.type,
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      // Clean up uploaded file if database insert fails
      await supabase.storage
        .from('teacher-consent-files')
        .remove([fileName]);

      console.error('Database insert error:', error);
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}
