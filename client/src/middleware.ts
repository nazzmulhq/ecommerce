import DEV_ONLY_ROUTES from "@lib/routes/DEV_ONLY_ROUTES";
import GUEST_ROUTES from "@lib/routes/GUEST_ROUTES";
import { PROTECTED_ROUTES } from "@lib/routes/PROTECTED_ROUTES";
import SHARED_ROUTES from "@lib/routes/SHARED_ROUTES";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token");
    // const user = req.cookies.get("user");
    const permissions = req.cookies.get("permissions");

    const isUserLoggedIn = !!token;

    const { pathname } = req.nextUrl;
    const isGuestRoute = GUEST_ROUTES.some(route => pathname.endsWith(route.path));
    const isSharedRoute = SHARED_ROUTES.some(route => pathname.includes(route.path));
    const isPrivateRoute = !isGuestRoute && !isSharedRoute;

    // Allow specific routes in development mode without authentication
    // for vercel deployment development mode not work otherwise use this on if condition;
    // process.env.NODE_ENV === 'development' &&
    if (process.env.NODE_ENV === "development" && DEV_ONLY_ROUTES.some(route => pathname.includes(route.path))) {
        return NextResponse.next();
    }

    // Bypass API routes
    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    if (!isUserLoggedIn && isPrivateRoute) {
        if (process.env.NODE_ENV === "development") {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isUserLoggedIn && isGuestRoute) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (isUserLoggedIn && permissions) {
        const userPermissions = permissions?.value ? JSON.parse(permissions.value) : [];

        const hasPermission = (permission: string[]) => {
            return permission.some(p => userPermissions.includes(p));
        };

        const matchedRoute = PROTECTED_ROUTES.find((route: { path: string }) => pathname.startsWith(route.path));

        if (matchedRoute && matchedRoute.permissions && !hasPermission(matchedRoute.permissions)) {
            return NextResponse.redirect(new URL("/403", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|favicon.ico|images/.*).*)"],
};
