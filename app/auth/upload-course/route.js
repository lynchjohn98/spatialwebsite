import { getSupabaseClient } from "@/utils/supabase/supabase";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
        console.log("Error signing in:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.log("User signed in anonymously:", data);

    const { newData, newError } = await supabase.from("courses").insert([
      {
        name: req.body.courseData.name,
        school: req.body.courseData.school,
        classType: req.body.courseData.classType,
        joinCode: req.body.joinCode,
        studentCount: req.body.studentCount,
        teacherCode: req.body.teacherCode,
      },
    ]);

    if (error) {
      console.log("Error inserting course:", error);
      return NextResponse.json({ error: newError.message }, { status: 500 });
    } else {
      console.log("Course inserted successfully:", data);
      return NextResponse.json({ data: newData });
    }
  } catch (error) {
    console.log("Error signing in:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
