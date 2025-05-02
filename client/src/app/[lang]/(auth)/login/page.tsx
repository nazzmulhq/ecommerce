import Login from "@components/modules/auth/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login Page",
    description: "Login to your account",
};

interface ILoginPageProps {
    searchParams: Promise<{ error?: string }>;
    params: Promise<{
        lang: string;
    }>;
}

export default async function LoginPage({ searchParams, params }: ILoginPageProps) {
    const searchParam = await searchParams;
    const { lang } = await params;
    return <Login lang={lang} searchParams={searchParam} />;
}
