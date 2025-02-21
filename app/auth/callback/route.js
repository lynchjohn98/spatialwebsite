//Create route handler in nextjs (jsx) 
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
    const cookieStore = cookies() //supabase using cookie to store session, can use these to check for authentication of user
    const supabase = createRouteHandlerClient({cookies: () => cookieStore});

    const {searchParams } = new URL(req.url);

    const code = searchParams.get('code');

    //if we get the code, click the magic link, it will send it to the route with the code in the search parameter in the route
    if (code) {
        await supabase.auth.exchangeCodeForSession(code);
    }
    return NextResponse.redirect(new URL('/home', req.url));
}