import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleLogin(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    // Mock user data - replace with real database lookup
    const mockUser = {
        id: "123",
        email: "user@example.com",
        password: "password", // In real app, store hashed passwords
    };

    if (email === mockUser.email && password === mockUser.password) {
        // Generate JWT token
        const token = "mock-jwt-token"; // Replace with actual JWT generation logic

        // Set cookie with token
        (await cookies()).set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60, // 1 hour
            path: "/",
        });
        (await cookies()).set({
            name: "user",
            value: JSON.stringify(mockUser),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60, // 1 hour
            path: "/",
        });
        (await cookies()).set({
            name: "permissions",
            value: JSON.stringify(["read", "write"]), // Replace with actual permissions
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60, // 1 hour
            path: "/",
        });
        redirect("/");
    }
}
