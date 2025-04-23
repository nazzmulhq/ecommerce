import Login from "@ui/auth/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login Page",
    description: "Login to your account",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const searchParam = await searchParams;
    return <Login searchParams={searchParam} />;
}
