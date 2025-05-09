// app/actions.js
"use server";

import { cookies } from "next/headers";

export async function getCookie(name: string) {
    return (await cookies()).get(name)?.value;
}

export async function deleteCookie(name: string) {
    (await cookies()).delete(name);
}
