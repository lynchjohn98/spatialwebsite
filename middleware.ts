import { type NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { updateSession } from './utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  // First, set up a basic response
  const response = NextResponse.next();
  
  // Clear Supabase tokens if needed (from your app/middleware.ts)
  response.cookies.delete("sb:token");
  response.cookies.delete("sb:refresh_token");
  
  // Update the session using the existing utility from utils/supabase/middleware
  return await updateSession(request);
  
  // Note: We're no longer forcing redirects to /home or / based on auth status
  // This allows you to freely navigate your application
}

export const config = {
  matcher: [
    // Match all paths except specific static assets and image files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/',
    '/course-join',
    '/student',
    '/student-join',
  ],
};