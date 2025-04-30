import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export default function Login({ searchParams, lang }: { searchParams: { error?: string }; lang: string }) {
    async function handleLogin(formData: FormData) {
        "use server";

        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();

        if (!email || !password) {
            redirect("/login?error=missing_credentials");
        }

        // Authentication API call
        const response = await fetch(`${process.env.URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const { token, user, routes, permissions } = await response.json();

        if (!token) {
            redirect("/login?error=invalid_credentials");
        }

        // Set cookies correctly
        (await cookies()).set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60,
            path: "/",
        });
        (await cookies()).set({
            name: "user",
            value: JSON.stringify(user),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60,
            path: "/",
        });
        (await cookies()).set({
            name: "routes",
            value: JSON.stringify(routes),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60,
            path: "/",
        });
        (await cookies()).set({
            name: "permissions",
            value: JSON.stringify(permissions),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60,
            path: "/",
        });

        redirect(`/${lang}/`, RedirectType.push);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Sign in to your account</h2>
                </div>

                <form action={handleLogin} className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label className="sr-only" htmlFor="email">
                                Email address
                            </label>
                            <input
                                autoComplete="email"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                defaultValue={"john.doe@gmail.com"}
                                id="email"
                                name="email"
                                placeholder="Email address"
                                required
                                type="email"
                            />
                        </div>
                        <div>
                            <label className="sr-only" htmlFor="password">
                                Password
                            </label>
                            <input
                                autoComplete="current-password"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                defaultValue={"password"}
                                id="password"
                                name="password"
                                placeholder="Password"
                                required
                                type="password"
                            />
                        </div>
                    </div>

                    {searchParams.error === "invalid_credentials" && (
                        <p className="text-red-500 text-sm text-center">Invalid email or password</p>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                            />
                            <label className="ml-2 block text-sm text-gray-900" htmlFor="remember-me">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <a className="font-medium text-indigo-600 hover:text-indigo-500" href="#">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            type="submit"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
