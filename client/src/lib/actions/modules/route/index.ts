export async function getRoutes(
    token: string | null | undefined,
    type: "plain" | "nested" = "nested",
    mode: "server" | "client" = "server",
) {
    const res = await fetch(
        `${mode === "server" ? process.env.API_URL : process.env.NEXT_PUBLIC_API_URL}/route/all?type=${type}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        },
    );

    const { data } = await res.json();

    return data;
}
