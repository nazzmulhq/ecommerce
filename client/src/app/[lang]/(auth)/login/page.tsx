import Login from "@components/modules/auth/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login Page",
    description: "Login to your account",
};

interface ILoginPageProps {
    searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: ILoginPageProps) {
    const searchParam = await searchParams;

    return <Login searchParams={searchParam} />;
}
