import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
// Middleware operates as the middleman between the frontend and the backend.
export async function middleware(req) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    const {data: {user } } = await supabase.auth.getUser(); //Nested decoonstruction, get the data object, then get the user property from the data object

    if (user && req.nextUrl.pathname === "/") { //this shows the homepage (root of the application)
        return NextResponse.redirect(new URL("/home", req.url));
    }

    //Not logged in and not redirected
    if (!user && req.nextUrl.pathname !== "/") {
        return NextResponse.redirect(new URL("/", req.url));
    }
    return res;
}


//Need to decide when the middleware is running, the public routes where it should run
export const config = {
    matcher: [
        "/",
        "/home",
        "/login"
    ]
}
