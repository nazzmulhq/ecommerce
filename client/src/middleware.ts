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
    try {
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

        // Redirect authenticated users away from auth pages
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
        // Use pattern matching to support dynamic routes
        const isRouteExists = allRoute.some(route => {
            if (route.path) {
                const routePath = route.path.replace(/\/\[(.*?)\]/g, "/$1");
                const regex = new RegExp(`^${routePath.replace(/:[^\s/]+/g, "([^/]+)")}$`);
                return regex.test(pathname);
            } else {
                return false;
            }
        });

        // If the route is not found in the user's allowed routes, redirect to 403 forbidden page
        if (!isRouteExists) {
            // Use redirect instead of forbidden() which is not allowed in middleware
            const forbiddenUrl = new URL("/403", req.url);
            return NextResponse.redirect(forbiddenUrl);
        }

        // Allow the request to proceed
        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        // Handle error appropriately, e.g., redirect to an error page
        const errorUrl = new URL("/500", req.url);
        return NextResponse.redirect(errorUrl);
    }
}

/**
 * Matcher configuration for the middleware
 * Applies this middleware to all routes except next.js static files, favicon, and image directories
 */
export const config = {
    matcher: ["/((?!_next/static|favicon.ico|images/.*|icons/.*|403|404|500).*)"],
};
