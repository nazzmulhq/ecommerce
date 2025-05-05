export async function getUserInfo(token: string) {
    const res = await fetch(`${process.env.API_URL}/auth/user-info`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch user info");
    }
    return res.json();
}

export async function getRoutes(token: string | null | undefined) {
    const res = await fetch(`${process.env.API_URL}/route/all`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    return res.json();
}
