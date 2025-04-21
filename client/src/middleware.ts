import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Add this import

import DEV_ONLY_ROUTES from "./routes/DEV_ONLY_ROUTES";
import GUEST_ROUTES from "./routes/GUEST_ROUTES";
import { PROTECTED_ROUTES } from "./routes/PROTECTED_ROUTES";
import SHARED_ROUTES from "./routes/SHARED_ROUTES";

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
        return NextResponse.redirect(newUrl);
    }

    // Rest of your middleware logic remains the same...
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";

    // 2. Now proceed with your existing auth logic
    const token = req.cookies.get("token");
    const permissions = req.cookies.get("permissions");
    const isUserLoggedIn = !!token;

    const isGuestRoute = GUEST_ROUTES.some(route => pathWithoutLocale.endsWith(route.path));
    const isSharedRoute = SHARED_ROUTES.some(route => pathWithoutLocale.includes(route.path));
    const isPrivateRoute = !isGuestRoute && !isSharedRoute;

    // Development routes
    if (
        process.env.NODE_ENV === "development" &&
        DEV_ONLY_ROUTES.some(route => pathWithoutLocale.includes(route.path))
    ) {
        return NextResponse.next();
    }

    // Auth checks
    if (!isUserLoggedIn && isPrivateRoute) {
        const redirectUrl =
            process.env.NODE_ENV === "development"
                ? new URL(`/${pathLocale}`, req.url)
                : new URL(`/${pathLocale}/login`, req.url);
        return NextResponse.redirect(redirectUrl);
    }

    if (isUserLoggedIn && isGuestRoute) {
        return NextResponse.redirect(new URL(`/${pathLocale}`, req.url));
    }

    // Permission checks
    if (isUserLoggedIn && permissions) {
        const userPermissions = permissions?.value ? JSON.parse(permissions.value) : [];

        const hasPermission = (permission: string[]) => {
            return permission.some(p => userPermissions.includes(p));
        };

        const matchedRoute = PROTECTED_ROUTES.find((route: { path: string }) =>
            pathWithoutLocale.startsWith(route.path),
        );

        if (matchedRoute && matchedRoute.permissions && !hasPermission(matchedRoute.permissions)) {
            return NextResponse.redirect(new URL(`/${pathLocale}/403`, req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|favicon.ico|images/.*|icons/.*).*)"],
};
