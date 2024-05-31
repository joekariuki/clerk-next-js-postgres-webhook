import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/(.*)"]);

export default clerkMiddleware((auth, req) => {
  const { userId, redirectToSignIn } = auth();

  // If user isn't sign in and is trying to access a protected route, redirect them to sign in
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // If user is signed in and route is proteced, allow access
  if (userId && isProtectedRoute(req)) return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
