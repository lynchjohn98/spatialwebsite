import { type NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { updateSession } from './app/utils/supabase/middleware';

export async function middleware(request: NextRequest) {

  const response = NextResponse.next();
    response.cookies.delete("sb:token");
  response.cookies.delete("sb:refresh_token");
    return await updateSession(request);
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