import { getRoutes } from "@lib/actions/auth/login";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { IRoute } from "./types/index";

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

    const allRoute: IRoute[] = await getRoutes(token);

    if (allRoute && allRoute.length === 0) {
        const redirectUrl = new URL(`/${pathLocale}/login`, req.url);

        return NextResponse.redirect(redirectUrl);
    }

    const isRouteExists = allRoute.some(route => route.path === pathWithoutLocale);

    if (!isRouteExists) {
        const redirectUrl = new URL(`/${pathLocale}/login`, req.url);

        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|favicon.ico|images/.*|icons/.*).*)"],
};
