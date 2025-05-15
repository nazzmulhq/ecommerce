import { getRoutes } from "@lib/actions/auth/login";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { IRoute } from "./types/basic";

const afterLoginRedirectRoute = "/configuration/permissions";

/**
 * Regular expression to match public files like images, CSS, JS, etc.
 */
const PUBLIC_FILE = /\.(.*)$/;

/**
 * Routes that shouldn't be accessed after user login
 * These routes will redirect to the homepage if a user is already logged in
 * @type {string[]}
 */
const afterLoginNotVisitedRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/verify-email/[token]",
];

/**
 * Next.js middleware function to handle:
 * - Locale detection and redirection
 * - Authentication checks
 * - Route access control
 * - Public file access
 *
 * @param {NextRequest} req - The incoming request object
 * @returns {NextResponse} Response object with appropriate redirects or next middleware
 */
export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Skip middleware for Next.js internal routes, API routes, public files, and .well-known paths
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        PUBLIC_FILE.test(pathname) ||
        pathname.startsWith("/.well-known")
    ) {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;

    // Redirect authenticated users away from auth pages (login, register, etc.)
    if (token && afterLoginNotVisitedRoutes.includes(pathname)) {
        const redirectUrl = new URL(afterLoginRedirectRoute, req.url);
        return NextResponse.redirect(redirectUrl);
    }

    // Fetch authorized routes for the current user based on their token
    const allRoute: IRoute[] = await getRoutes(token, "plain");

    // If no routes are available, user is not authenticated - redirect to login
    if (allRoute && allRoute.length === 0) {
        const redirectUrl = new URL("/login", req.url);

        return NextResponse.redirect(redirectUrl);
    }

    // Check if the requested route is in the user's allowed routes
    const isRouteExists = allRoute.some(route => route.path === pathname);

    // If route is not allowed for this user, redirect to login
    if (!isRouteExists) {
        const redirectUrl = new URL("/login", req.url);

        return NextResponse.redirect(redirectUrl);
    }

    // Allow the request to proceed
    return NextResponse.next();
}

/**
 * Matcher configuration for the middleware
 * Applies this middleware to all routes except next.js static files, favicon, and image directories
 */
export const config = {
    matcher: ["/((?!_next/static|favicon.ico|images/.*|icons/.*).*)"],
};
