import { FooterType } from "@lib/constants/AppEnums";
import { useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import clsx from "clsx";
import React, { useState } from "react";
import AppContentView from "../../AppContentView";
import AppThemeSetting from "../../AppThemeSetting";
import AppFooter from "../components/AppFooter";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { StyledAppLayoutMiniSidebar, StyledAppLayoutMiniSidebarMain, StyledMainMiniScrollbar } from "./index.styled";

type Props = {
    children: React.ReactNode;
    routesConfig: RouterConfigData[];
};
const MiniSidebarToggle: React.FC<Props> = ({ children, routesConfig }) => {
    const [isCollapsed, setCollapsed] = useState(false);
    const { footer, footerType } = useLayoutContext();

    const onToggleSidebar = () => {
        setCollapsed(!isCollapsed);
    };
    return (
        <StyledAppLayoutMiniSidebar
            className={clsx({
                appMainFooter: footer && footerType === FooterType.FLUID,
                appMainFixedFooter: footer && footerType === FooterType.FIXED,
            })}
        >
            <AppSidebar isCollapsed={isCollapsed} routesConfig={routesConfig} />
            <StyledAppLayoutMiniSidebarMain className="app-layout-mini-sidebar-main">
                <AppHeader isCollapsed={isCollapsed} onToggleSidebar={onToggleSidebar} />
                <StyledMainMiniScrollbar>
                    <AppContentView>{children}</AppContentView>
                    <AppFooter />
                </StyledMainMiniScrollbar>
            </StyledAppLayoutMiniSidebarMain>
            <AppThemeSetting />
        </StyledAppLayoutMiniSidebar>
    );
};

export default MiniSidebarToggle;
