"use client";

import { useLayoutActionsContext, useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { useSidebarActionsContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
// import "slick-carousel/slick/slick-theme.css";
// import "slick-carousel/slick/slick.css";
import routesConfig from "../AppRoutes/routeConfig";
import Layouts from "./Layouts";

export interface AppLayoutProps {
    children: React.ReactNode;
    token?: string;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { navStyle } = useLayoutContext();

    const Layout: React.FC<any> = Layouts[navStyle];

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
