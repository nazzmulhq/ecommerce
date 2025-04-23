import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const response = await fetch(`${process.env.URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: response.status });
        }

        const { user, token } = await response.json();

        const responseHeaders = new Headers();
        responseHeaders.append(
            "Set-Cookie",
            `token2=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/`,
        );
        responseHeaders.append(
            "Set-Cookie",
            `user2=${JSON.stringify(user)}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/`,
        );
        responseHeaders.append(
            "Set-Cookie",
            `permissions2=${JSON.stringify(["permissions"])}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/`,
        );

        return NextResponse.json({ message: "Login successful!" }, { headers: responseHeaders });
    } catch (error: any) {
        console.error("API login error:", error);
        return NextResponse.json({ error: "An error occurred. Please try again." }, { status: 500 });
    }
}
