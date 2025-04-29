import { getRoutes } from "@lib/actions/auth/login";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { IPermission, IRoute } from "./types/index";

const PUBLIC_FILE = /\.(.*)$/;

const locales = ["en", "bn", "fr"];
const defaultLocale = "en";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/_next") || pathname.startsWith("/api") || PUBLIC_FILE.test(pathname)) {
        return NextResponse.next();
    }

    const pathLocale =
        locales.find(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) || defaultLocale;

    if (!locales.some(locale => pathname.startsWith(`/${locale}`))) {
        const newUrl = new URL(`/${pathLocale}${pathname}`, req.url);
        if (req.nextUrl.pathname === newUrl.pathname) {
            return NextResponse.next();
        }
        return NextResponse.redirect(newUrl);
    }

    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";

    const token = req.cookies.get("token")?.value;
    const permissionsString = req.cookies.get("permissions")?.value;
    const routesString = req.cookies.get("routes")?.value;
    const routes: IRoute[] = JSON.parse(routesString || "[]");
    const permissions: IPermission[] = JSON.parse(permissionsString || "[]");

    const isUserLoggedIn = !!token;

    const allRoute = await getRoutes(token);

    if (routes.length === 0) {
        const redirectUrl = new URL(`/${pathLocale}/login`, req.url);
        if (req.nextUrl.pathname === redirectUrl.pathname) {
            return NextResponse.next();
        }
        return NextResponse.redirect(redirectUrl);
    }

    const GUEST_ROUTES = routes.filter(route => route.type === "guest");
    const SHARED_ROUTES = routes.filter(route => route.type === "shared");
    const DEV_ONLY_ROUTES = routes.filter(route => route.type === "devOnly");
    const PROTECTED_ROUTES = routes.filter(route => route.type === "protected");

    const isGuestRoute = GUEST_ROUTES.some(route => pathWithoutLocale === route.path);
    const isSharedRoute = SHARED_ROUTES.some(route => pathWithoutLocale === route.path);
    const isDevOnlyRoute = DEV_ONLY_ROUTES.some(route => pathWithoutLocale === route.path);
    const isPrivateRoute = PROTECTED_ROUTES.some(route => pathWithoutLocale.startsWith(route.path));

    // console.log("---------------1---------------");
    // console.log("pathWithoutLocale", pathWithoutLocale);
    // console.log("isGuestRoute", isGuestRoute);
    // console.log("isSharedRoute", isSharedRoute);
    // console.log("isDevOnlyRoute", isDevOnlyRoute);
    // console.log("isPrivateRoute", isPrivateRoute);
    // console.log("isUserLoggedIn", isUserLoggedIn);

    if (isUserLoggedIn && isDevOnlyRoute) {
        return NextResponse.next();
    }
    if (!isUserLoggedIn && isDevOnlyRoute) {
        const redirectUrl = new URL(`/${pathLocale}/login`, req.url);
        if (req.nextUrl.pathname === redirectUrl.pathname) {
            return NextResponse.next();
        }
        return NextResponse.redirect(redirectUrl);
    }

    if (!isUserLoggedIn && isPrivateRoute) {
        // console.log("Unauthenticated user attempting to access private route:", pathWithoutLocale);
        const redirectUrl = new URL(`/${pathLocale}/login`, req.url);
        if (req.nextUrl.pathname === redirectUrl.pathname) {
            // console.log("Preventing redirection loop to login page");
            return NextResponse.next();
        }
        // console.log("Redirecting unauthenticated user to login page:", redirectUrl.toString());
        return NextResponse.redirect(redirectUrl);
    }

    // Corrected condition: Only redirect authenticated users from guest routes
    if (isGuestRoute) {
        return NextResponse.next();
    }

    if (isSharedRoute) {
        // console.log("Accessing shared route:", pathWithoutLocale);
        return NextResponse.next();
    }

    if (isUserLoggedIn && isPrivateRoute) {
        const userPermissions = permissions.map(p => p.slug);
        const hasPermission = (required: string[]) => required.some(p => userPermissions.includes(p));

        const matchedRoute = PROTECTED_ROUTES.find(route => pathWithoutLocale.startsWith(route.path));

        if (matchedRoute?.permissions?.length && !hasPermission(matchedRoute.permissions.map(p => p.slug))) {
            // console.log("User lacks required permissions for route:", pathWithoutLocale);
            const redirectUrl = new URL(`/${pathLocale}/403`, req.url);
            if (req.nextUrl.pathname === redirectUrl.pathname) {
                // console.log("Preventing redirection loop to 403 page");
                return NextResponse.next();
            }
            // console.log("Redirecting to 403 page:", redirectUrl.toString());
            return NextResponse.redirect(redirectUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|favicon.ico|images/.*|icons/.*).*)"],
};
