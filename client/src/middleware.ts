import { getRoutes } from "@lib/actions/auth/login";
import { initialUrl } from "@lib/constants/AppConst";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { IRoute } from "./types/basic";

const afterLoginRedirectRoute = initialUrl; // Redirect route after login

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

        // Helper to forward pathname in headers
        const nextWithPathname = () => {
            const requestHeaders = new Headers(req.headers);
            requestHeaders.set("x-pathname", pathname);
            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });
        };

        // Redirect authenticated users away from auth pages
        if (token && afterLoginNotVisitedRoutes.includes(pathname)) {
            const redirectUrl = new URL(afterLoginRedirectRoute, req.url);
            return NextResponse.redirect(redirectUrl);
        }

        // Fetch authorized routes for the current user based on their token
        const allRoute: IRoute[] = await getRoutes(token, "plain");

        /**
         * Route access control logic:
         * 1. If user is not logged in (no token):
         *    - If allRoute is empty, redirect to 500 page
         *    - If allRoute is not empty, check if route exists in allRoute
         * 2. If user is logged in (has token):
         *    - If allRoute is empty, redirect to 403 page
         *    - If allRoute is not empty, check if route exists in allRoute
         */

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

        // User is not logged in
        if (!token) {
            // If allRoute is empty, there's a system issue - redirect to 500
            if (allRoute.length === 0) {
                const errorUrl = new URL("/500", req.url);
                return NextResponse.redirect(errorUrl);
            }

            // If route doesn't exist in allowed routes, redirect to login
            if (!isRouteExists) {
                const loginUrl = new URL("/login", req.url);
                return NextResponse.redirect(loginUrl);
            }

            // Allow the request to proceed if route exists
            return nextWithPathname();
        }
        // User is logged in
        else {
            // If allRoute is empty, user has no permissions - redirect to 403
            if (allRoute.length === 0) {
                const forbiddenUrl = new URL("/403", req.url);
                return NextResponse.redirect(forbiddenUrl);
            }

            // If route doesn't exist in allowed routes, redirect to 403
            if (!isRouteExists) {
                const forbiddenUrl = new URL("/403", req.url);
                return NextResponse.redirect(forbiddenUrl);
            }

            // Allow the request to proceed if route exists
            return nextWithPathname();
        }
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
