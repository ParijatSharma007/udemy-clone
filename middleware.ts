import { NextRequest, NextResponse } from "next/server";
// If the incoming request has the "token" cookie
export function middleware(request: NextRequest) {
  const has_token = request.cookies.get("token")?.name;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;
  console.log(pathname, "pathname");
  console.log(has_token, "token")
  
  if (!has_token) {
    request.nextUrl.pathname = "auth/login";
    return NextResponse.redirect(request.nextUrl);
  }

  if (role === "teacher" && pathname.includes("student")) {
    request.nextUrl.pathname = "teacher";
    return NextResponse.redirect(request.nextUrl);
  }

  if (role === "student" && pathname.includes("teacher")) {
    request.nextUrl.pathname = "student";
    return NextResponse.redirect(request.nextUrl);
  }

  if (
    (pathname === "/auth/login/" || pathname === "/auth/signup/") && has_token
  ) {
    request.nextUrl.pathname = "/";
    return NextResponse.redirect(request.nextUrl);
  }

  return 
}

export const config = {
  matcher: ["/teacher/", "/student/", "/videoplayer/:any*"],
};
