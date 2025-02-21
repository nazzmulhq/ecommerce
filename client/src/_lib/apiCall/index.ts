import FetchClient from "./Fetch";

const API = new FetchClient(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api");

API.setRequestInterceptor(async config => {
    const token =
        localStorage.getItem("token") ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4uZG9lQGdtYWlsLmNvbSIsImlhdCI6MTczMjA2NDQwOCwiZXhwIjoxNzMyMTUwODA4fQ.GeJvJie1V8GD74d8jJnX17qlEV19yBFT1rGkTQgBaPA";
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    // console.log("Request Config:", config);
    return config;
});

API.setResponseInterceptor(
    async <T>(response: Response) => {
        const data = await response.json();
        // console.log("Response Data:", data);
        return data as T; // Cast response to generic type
    },
    async error => {
        console.log("Response Error:", error);
        if (error.message.includes("401")) {
            console.warn("Unauthorized! Redirecting to login.");
        }
    },
);

export default API;
