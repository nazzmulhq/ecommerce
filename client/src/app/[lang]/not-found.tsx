"use client";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-primary">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
                    <p className="text-gray-600 mt-4">
                        The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
                    </p>
                </div>

                <div className="space-y-3">
                    <div>
                        <Link
                            className="inline-block w-full px-6 py-3 text-base font-medium rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200"
                            href="/"
                        >
                            Go Back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
