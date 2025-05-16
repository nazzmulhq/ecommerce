// app/actions.js
"use server";

import { Metadata } from "next";
import { cookies } from "next/headers";

export async function getCookie(name: string) {
    return (await cookies()).get(name)?.value;
}

export async function deleteCookie(name: string) {
    (await cookies()).delete(name);
}

export async function getMetaData(
    slug: string,
    options: Metadata,
    mode: "server" | "client" = "server",
): Promise<Metadata> {
    try {
        const token = await getCookie("token");
        const res = await fetch(
            `${mode === "server" ? process.env.API_URL : process.env.NEXT_PUBLIC_API_URL}/route/metadata/${slug}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                // Cache the response for 1day
                next: { revalidate: 86400 },
            },
        );
        const { data } = await res.json();
        return data;
    } catch (error) {
        // Fallback metadata in case of error
        return options;
    }
}
