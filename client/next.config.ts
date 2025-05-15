import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
    env: {
        NEXT_PUBLIC_INITIAL_URL: "/permissions",
        NEXT_PUBLIC_STATE_TYPE: "context",
        NEXT_PUBLIC_FILESTACK_KEY: "Ach6MsgoQHGK6tCaq5uJ34gz",
        NEXT_PUBLIC_LAYOUT: "default",
        NEXT_PUBLIC_MULTILINGUAL: "true",
        NEXT_PUBLIC_PRIMARY_COLOR: "#0A8FDC",
        NEXT_PUBLIC_SECONDARY_COLOR: "#F04F47",
        NEXT_PUBLIC_THEME_MODE: "light",
        NEXT_PUBLIC_NAV_STYLE: "default",
        NEXT_PUBLIC_LAYOUT_TYPE: "full-width",
    },
};

export default nextConfig;
