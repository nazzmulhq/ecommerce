import { RouterConfigData } from "@src/types/Apps";
import React from "react";
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
const MiniSidebarToggle: React.FC<Props> = ({ children }) => {
    // const { footer, footerType } = useLayoutContext();

    return (
        <StyledAppLayoutMiniSidebar
        // className={clsx({
        //     appMainFooter: footer && footerType === FooterType.FLUID,
        //     appMainFixedFooter: footer && footerType === FooterType.FIXED,
        // })}
        >
            <AppSidebar />
            <StyledAppLayoutMiniSidebarMain className="app-layout-mini-sidebar-main">
                <AppHeader />
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
