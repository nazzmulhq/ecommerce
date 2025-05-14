"use client";

import { useLayoutActionsContext, useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { useSidebarActionsContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
// import "slick-carousel/slick/slick-theme.css";
// import "slick-carousel/slick/slick.css";
import { NavStyle } from "@lib/constants/AppEnums";
import routesConfig from "../AppRoutes/routeConfig";
import Layouts from "./Layouts";

export interface AppLayoutProps {
    children: React.ReactNode;
    token?: string;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { navStyle } = useLayoutContext();

    // Check if the navStyle exists in Layouts, otherwise use a default
    const selectedNavStyle = navStyle && Layouts[navStyle] ? navStyle : NavStyle.STANDARD;

    // Log the navStyle to help with debugging
    console.log("Current navStyle:", navStyle, "Available layouts:", Object.keys(Layouts));

    // Get the Layout component safely with fallback to a default layout
    const Layout = Layouts[selectedNavStyle] || Layouts[NavStyle.STANDARD];

    if (!Layout) {
        console.error("No valid layout found! Using fallback div container.");
        // Return a basic container if no layout is found (should never happen with fallback)
        return <div className="app-container">{children}</div>;
    }

    const { updateNavStyle } = useLayoutActionsContext();
    const { updateMenuStyle, setSidebarBgImage } = useSidebarActionsContext();
    const searchParams = useSearchParams();

    const layout = searchParams.get("layout");
    const menuStyle = searchParams.get("menuStyle");
    const sidebarImage = searchParams.get("sidebarImage");

    useEffect(() => {
        if (layout) {
            updateNavStyle(layout);
        }
        if (menuStyle) {
            updateMenuStyle(menuStyle);
        }
        if (sidebarImage) {
            setSidebarBgImage(true);
        }
    }, []);

    // if (!user || isLoading) {
    //     return <AppLoader />;
    // }

    return <Layout routesConfig={routesConfig}>{children}</Layout>;
}
