import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import clsx from "clsx";
import React from "react";
import AppVerticalMenu from "../components/AppVerticalNav";
import UserInfo from "../components/UserInfo";
import { StyledAppMainSidebar, StyledAppSidebarScrollbar } from "./index.styled";

type AppSidebarProps = {
    routesConfig: RouterConfigData[];
    isCollapsed: boolean;
};

const AppSidebar: React.FC<AppSidebarProps> = ({ isCollapsed, routesConfig }) => {
    const { allowSidebarBgImage } = useSidebarContext();

    return (
        <StyledAppMainSidebar
            breakpoint="xl"
            className={clsx({
                "sidebar-img-background": allowSidebarBgImage,
            })}
            collapsed={isCollapsed}
            collapsible
        >
            <UserInfo hasColor />
            <StyledAppSidebarScrollbar scrollToTop={false}>
                <AppVerticalMenu routesConfig={routesConfig} />
            </StyledAppSidebarScrollbar>
        </StyledAppMainSidebar>
    );
};

export default AppSidebar;
