
// ============================================

// app/api/delete-teacher-consent/route.js
import { NextRequest, NextResponse } from 'next/server';
import { createAPIClient } from '../../utils/supabase/server';

export async function DELETE(request) {
  try {
    const { fileId } = await request.json();

    if (!fileId) {
      return NextResponse.json({
        success: false,
        message: 'File ID is required'
      }, { status: 400 });
    }

    const supabase = await createAPIClient();

    // Get file details first
    const { data: fileData, error: fetchError } = await supabase
      .from('teacher_consent_files')
      .select('file_path, teacher_id')
      .eq('id', fileId)
      .single();

    if (fetchError || !fileData) {
      return NextResponse.json({
        success: false,
        message: 'File not found'
      }, { status: 404 });
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('teacher-consent-files')
      .remove([fileData.file_path]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
      // Continue with database deletion even if storage fails
    }

    // Delete database record
    const { error: deleteError } = await supabase
      .from('teacher_consent_files')
      .delete()
      .eq('id', fileId);

    if (deleteError) {
      console.error('Database deletion error:', deleteError);
      return NextResponse.json({
        success: false,
        message: deleteError.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}