import { getRoutes } from "@lib/actions/auth/login";
import { notFound } from "next/navigation";
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
 * Function to check if a path matches a route pattern
 * Supports dynamic segments with ':param' syntax
 *
 * @param {string} path - The actual path from the request
 * @param {string} pattern - Route pattern that may contain dynamic segments
 * @returns {boolean} Whether the path matches the pattern
 */
const matchesPattern = (path: string, pattern: string) => {
    // Split both into segments
    const pathSegments = path.split("/").filter(Boolean);
    const patternSegments = pattern.split("/").filter(Boolean);

    // If segment counts don't match, it's not a match
    if (pathSegments.length !== patternSegments.length) {
        return false;
    }

    // Check each segment
    for (let i = 0; i < pathSegments.length; i++) {
        // If pattern segment starts with ':', it's a parameter and always matches
        if (patternSegments[i].startsWith(":")) {
            continue;
        }

        // Otherwise segments must match exactly
        if (pathSegments[i] !== patternSegments[i]) {
            return false;
        }
    }

    return true;
};

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

    // Check if current path matches any of the after-login-not-visited routes
    const shouldRedirectAfterLogin = afterLoginNotVisitedRoutes.some(route => {
        // Handle routes with dynamic segments by replacing [param] with :param format
        const routePattern = route.replace(/\[([^\]]+)\]/g, ":$1");
        return matchesPattern(pathname, routePattern);
    });

    // Redirect authenticated users away from auth pages
    if (token && shouldRedirectAfterLogin) {
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
    // Use pattern matching to support dynamic routes
    const isRouteExists = allRoute.some(route => {
        // Check if route and route.path exist
        if (!route || !route.path) {
            return false;
        }

        // Convert route path to pattern format (if it contains dynamic segments)
        const routePattern = route.path.replace(/\[([^\]]+)\]/g, ":$1");
        return matchesPattern(pathname, routePattern);
    });

    // If route is not allowed for this user, redirect to login
    if (!isRouteExists) {
        notFound();
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
