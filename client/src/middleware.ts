import { getRoutes } from "@lib/actions/auth/login";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { IRoute } from "./types/basic";

/**
 * Regular expression to match public files like images, CSS, JS, etc.
 */
const PUBLIC_FILE = /\.(.*)$/;

/**
 * Available locales for the application
 * @type {string[]}
 */
const locales = ["en", "bn", "fr"];

/**
 * Default locale for the application
 * @type {string}
 */
const defaultLocale = "en";

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

    // Skip middleware for Next.js internal routes, API routes, and public files
    if (pathname.startsWith("/_next") || pathname.startsWith("/api") || PUBLIC_FILE.test(pathname)) {
        return NextResponse.next();
    }

    // Detect the locale from the URL path or use default
    const pathLocale =
        locales.find(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) || defaultLocale;

    // Redirect to localized URL if locale is missing in the URL
    if (!locales.some(locale => pathname.startsWith(`/${locale}`))) {
        const newUrl = new URL(`/${pathLocale}${pathname}`, req.url);
        if (req.nextUrl.pathname === newUrl.pathname) {
            return NextResponse.next();
        }
        return NextResponse.redirect(newUrl);
    }

    // Extract the path without locale prefix for route matching
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";
    const token = req.cookies.get("token")?.value;

    // Redirect authenticated users away from auth pages (login, register, etc.)
    if (token && afterLoginNotVisitedRoutes.includes(pathWithoutLocale)) {
        const redirectUrl = new URL(`/${pathLocale}/`, req.url);
        return NextResponse.redirect(redirectUrl);
    }

    // Fetch authorized routes for the current user based on their token
    const allRoute: IRoute[] = await getRoutes(token);

    // If no routes are available, user is not authenticated - redirect to login
    if (allRoute && allRoute.length === 0) {
        const redirectUrl = new URL(`/${pathLocale}/login`, req.url);

        return NextResponse.redirect(redirectUrl);
    }

    // Check if the requested route is in the user's allowed routes
    const isRouteExists = allRoute.some(route => route.path === pathWithoutLocale);

    // If route is not allowed for this user, redirect to login
    if (!isRouteExists) {
        const redirectUrl = new URL(`/${pathLocale}/login`, req.url);

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
