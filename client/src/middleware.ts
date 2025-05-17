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
 * Improved function to check if a path matches a route pattern
 * Better handles deeply nested routes with multiple dynamic segments
 *
 * @param {string} path - The actual path from the request
 * @param {string} pattern - Route pattern that may contain dynamic segments
 * @returns {boolean} Whether the path matches the pattern
 */
const matchesPattern = (path: string, pattern: string) => {
    // Handle root path
    if (pattern === "/" && path === "/") return true;

    // Remove trailing slashes for consistent comparison
    const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;
    const normalizedPattern = pattern.endsWith("/") ? pattern.slice(0, -1) : pattern;

    // Split both into segments
    const pathSegments = normalizedPath.split("/").filter(Boolean);
    const patternSegments = normalizedPattern.split("/").filter(Boolean);

    // Check for parent route match (e.g., /users/1 should match /users/:id)
    // This handles the case where the requested path is a child of an allowed route
    if (patternSegments.length < pathSegments.length) {
        // Check if the pattern is a parent of the path
        for (let i = 0; i < patternSegments.length; i++) {
            // If pattern segment starts with ':', it's a parameter and always matches
            if (patternSegments[i].startsWith(":")) continue;

            // Otherwise segments must match exactly
            if (pathSegments[i] !== patternSegments[i]) return false;
        }
        return true; // All parent segments match
    }

    // Normal exact matching (when path and pattern have same segment count)
    if (pathSegments.length === patternSegments.length) {
        for (let i = 0; i < pathSegments.length; i++) {
            // If pattern segment starts with ':', it's a parameter and always matches
            if (patternSegments[i].startsWith(":")) continue;

            // Otherwise segments must match exactly
            if (pathSegments[i] !== patternSegments[i]) return false;
        }
        return true;
    }

    return false;
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

        // Check if current path matches this route pattern
        const matches = matchesPattern(pathname, routePattern);

        if (matches) {
            console.log(`Route matched: ${pathname} -> ${routePattern}`);
        }

        return matches;
    });

    console.log("isRouteExists", isRouteExists, "for path", pathname);

    // If route is not allowed for this user, redirect to a custom 404 page
    // instead of using notFound() which is not allowed in middleware
    if (!isRouteExists) {
        const notFoundUrl = new URL("/404", req.url);
        return NextResponse.redirect(notFoundUrl);
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
