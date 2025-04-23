"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleLogin(prevState: any, formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        // Validate API URL
        if (!process.env.URL) {
            throw new Error("API URL is not defined in environment variables.");
        }

        // Log the API URL for debugging
        console.log("API URL:", process.env.URL);

        // Fetch API call to backend
        const response = await fetch(`${process.env.URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`Invalid credentials. Status: ${response.status}`);
        }

        const { user, token } = await response.json();

        // Set cookies with response data
        (await cookies()).set({
            name: "token2",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60, // 1 hour
            path: "/",
        });
        (await cookies()).set({
            name: "user2",
            value: JSON.stringify(user),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60, // 1 hour
            path: "/",
        });
        (await cookies()).set({
            name: "permissions2",
            value: JSON.stringify(["permissions"]),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60, // 1 hour
            path: "/",
        });

        // Redirect to home page
        redirect("/");
    } catch (error: any) {
        console.error("Login error:", error);

        // Handle connection errors
        if (error.cause?.code === "ECONNREFUSED") {
            return {
                message: "Unable to connect to the server. Please check if the backend is running and try again.",
                error: true,
            };
        }

        // Handle other errors
        return {
            message: error.message || "An unexpected error occurred.",
            error: true,
        };
    }
}
