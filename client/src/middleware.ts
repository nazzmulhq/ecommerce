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
        return NextResponse.redirect(newUrl);
    }

    // Rest of your middleware logic remains the same...
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";

    // 2. Now proceed with your existing auth logic
    const token = req.cookies.get("token")?.value;
    const permissionsString = req.cookies.get("permissions")?.value;
    const routesString = req.cookies.get("routes")?.value;
    const routes: IRoute[] = JSON.parse(routesString || "[]");
    const permissions: IPermission[] = JSON.parse(permissionsString || "[]");

    const isUserLoggedIn = !!token;

    const GUEST_ROUTES = routes.filter((route: { type: string }) => route.type === "guest");
    const SHARED_ROUTES = routes.filter((route: { type: string }) => route.type === "shared");
    const PROTECTED_ROUTES = routes.filter((route: { type: string }) => route.type === "protected");
    const DEV_ONLY_ROUTES = routes.filter((route: { type: string }) => route.type === "dev");

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
        const userPermissions: string[] = permissions ? permissions.map(p => p.slug) : [];

        const hasPermission = (permission: string[]) => {
            return permission.some(p => userPermissions.includes(p));
        };

        const matchedRoute = PROTECTED_ROUTES.find((route: { path: string }) =>
            pathWithoutLocale.startsWith(route.path),
        );

        if (matchedRoute && matchedRoute.permissions && !hasPermission(matchedRoute.permissions.map(p => p.slug))) {
            return NextResponse.redirect(new URL(`/${pathLocale}/403`, req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|favicon.ico|images/.*|icons/.*).*)"],
};
