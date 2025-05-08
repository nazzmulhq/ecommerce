import { FooterType, LayoutType } from "@lib/constants/AppEnums";
import { useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import clsx from "clsx";
import React from "react";

import AppContentView from "@components/common/AppContentView";
import AppThemeSetting from "@components/common/AppThemeSetting";
import AppFooter from "../components/AppFooter";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { StyledAppLayoutMini, StyledAppLayoutMiniMain, StyledMainMiniScrollbar } from "./index.styled";

type Props = {
    children: React.ReactNode;
    routesConfig: RouterConfigData[];
};
const MiniSidebar: React.FC<Props> = ({ children, routesConfig }) => {
    const { footer, layoutType, footerType } = useLayoutContext();

    return (
        <StyledAppLayoutMini
            className={clsx({
                appMainFooter: footer && footerType === FooterType.FLUID,
                appMainFixedFooter: footer && footerType === FooterType.FIXED,
                boxedLayout: layoutType === LayoutType.BOXED,
            })}
        >
            <AppSidebar routesConfig={routesConfig} />
            <StyledAppLayoutMiniMain className="app-layout-mini-main">
                <AppHeader />
                <StyledMainMiniScrollbar>
                    <AppContentView>{children}</AppContentView>
                    <AppFooter />
                </StyledMainMiniScrollbar>
            </StyledAppLayoutMiniMain>
            <AppThemeSetting />
        </StyledAppLayoutMini>
    );
};

export default MiniSidebar;
