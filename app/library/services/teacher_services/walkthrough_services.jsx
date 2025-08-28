"use server";
import { createClient } from "../../../utils/supabase/server";

export async function validateTeacherCredentials(username, adminCode) {
  try {
    const supabase = await createClient(); // Add await here if createClient is async
    const { data, error } = await supabase
      .from('teachers')
      .select('username')
      .eq('username', username)
      .single();
    
    if (error || !data) {
      console.log("Username not found:", error);
      return { success: false, error: "username_not_found" };
    }
    
    // Validate admin code
    if (adminCode !== "SPA2025") {
      return { success: false, error: "invalid_code" };
    }
    
    return { success: true };
  } catch (err) {
    console.error("Error validating teacher credentials:", err);
    return { success: false, error: "server_error" };
  }
}

export async function resetTeacherPassword(resetUsername, newPassword) {
  try {
    const supabase = await createClient(); // Add await here if createClient is async
    const { data, error } = await supabase
      .from('teachers')
      .update({ password: newPassword })
      .eq('username', resetUsername);
    
    if (error) {
      console.error("Error updating password:", error);
      return { success: false };
    }
    
    return { success: true };
  } catch (err) {
    console.error("Error resetting password:", err);
    return { success: false };
  }
}