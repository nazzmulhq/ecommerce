"use client";

import { handleLogin } from "@lib/actions/auth/login";
import { useActionState } from "react";

const initialState = {
    message: "",
    error: false,
    loading: false,
};

export default function LoginPage() {
    const [state, formAction, pending] = useActionState(handleLogin, initialState); // Updated initialState to undefined

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Sign in to your account</h2>
                </div>

                <form action={formAction} className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label className="sr-only" htmlFor="email">
                                Email address
                            </label>
                            <input
                                autoComplete="email"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                defaultValue={"password"}
                                id="password"
                                name="password"
                                placeholder="Password"
                                required
                                type="password"
                            />
                        </div>
                    </div>

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
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                            disabled={pending}
                            type="submit"
                        >
                            Sign in
                        </button>
                    </div>
                    <p aria-live="polite" className="text-sm text-center text-gray-600">
                        {state?.message || ""}
                    </p>
                </form>
            </div>
        </div>
    );
}
