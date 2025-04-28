import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { IPermission, IRoute } from "./types/index";

const PUBLIC_FILE = /\.(.*)$/;

const locales = ["en", "bn", "fr"]; // Add your supported locales here
const defaultLocale = "en"; // Set your default locale here

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Skip public files and API routes
    if (pathname.startsWith("/_next") || pathname.startsWith("/api") || PUBLIC_FILE.test(pathname)) {
        return NextResponse.next();
    }

    // Extract locale from path
    const pathLocale =
        locales.find(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) || defaultLocale;

    // If no locale in path, redirect to default locale while preserving the requested path
    if (!locales.some(locale => pathname.startsWith(`/${locale}`))) {
        const newUrl = new URL(`/${pathLocale}${pathname}`, req.url);
        if (req.nextUrl.pathname === newUrl.pathname) {
            return NextResponse.next(); // Prevent redirection loop
        }
        return NextResponse.redirect(newUrl);
    }

    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";

    // Authentication and route checks
    const token = req.cookies.get("token")?.value;
    const permissionsString = req.cookies.get("permissions")?.value;
    const routesString = req.cookies.get("routes")?.value;
    const routes: IRoute[] = JSON.parse(routesString || "[]");
    const permissions: IPermission[] = JSON.parse(permissionsString || "[]");

    const isUserLoggedIn = !!token;

    if (routes.length === 0) {
        const redirectUrl = new URL(`/${pathLocale}/login`, req.url);
        if (req.nextUrl.pathname === redirectUrl.pathname) {
            return NextResponse.next(); // Prevent redirection loop
        }
        return NextResponse.redirect(redirectUrl);
    }

    const GUEST_ROUTES = routes.filter(route => route.type === "guest");
    const PROTECTED_ROUTES = routes.filter(route => route.type === "protected");

    const isGuestRoute = GUEST_ROUTES.some(route => pathWithoutLocale === route.path);
    const isPrivateRoute = PROTECTED_ROUTES.some(route => pathWithoutLocale.startsWith(route.path));

    // User not logged in but trying to access a private route
    if (!isUserLoggedIn && isPrivateRoute) {
        const redirectUrl = new URL(`/${pathLocale}/login`, req.url);
        if (req.nextUrl.pathname === redirectUrl.pathname) {
            return NextResponse.next(); // Prevent redirection loop
        }
        return NextResponse.redirect(redirectUrl);
    }

    // User logged in but trying to access a guest route
    if (isUserLoggedIn && isGuestRoute) {
        const redirectUrl = new URL(`/${pathLocale}`, req.url);
        if (req.nextUrl.pathname === redirectUrl.pathname) {
            return NextResponse.next(); // Prevent redirection loop
        }
        return NextResponse.redirect(redirectUrl);
    }

    // Permission checks for private routes
    if (isUserLoggedIn && isPrivateRoute) {
        const userPermissions = permissions.map(p => p.slug);
        const hasPermission = (required: string[]) => required.some(p => userPermissions.includes(p));

        const matchedRoute = PROTECTED_ROUTES.find(route => pathWithoutLocale.startsWith(route.path));

        if (matchedRoute?.permissions?.length && !hasPermission(matchedRoute.permissions.map(p => p.slug))) {
            const redirectUrl = new URL(`/${pathLocale}/403`, req.url);
            if (req.nextUrl.pathname === redirectUrl.pathname) {
                return NextResponse.next(); // Prevent redirection loop
            }
            return NextResponse.redirect(redirectUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|favicon.ico|images/.*|icons/.*).*)"],
};
