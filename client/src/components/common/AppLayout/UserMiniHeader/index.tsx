import clsx from "clsx";
import React from "react";

import AppContentView from "@components/common/AppContentView";
import AppThemeSetting from "@components/common/AppThemeSetting";
import { FooterType, LayoutType } from "@lib/constants/AppEnums";
import { useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import AppFooter from "../components/AppFooter";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { StyledAppLayoutMinibar, StyledAppLayoutMinibarMain, StyledUserMiniHeaderScrollbar } from "./index.styled";

type Props = {
    children: React.ReactNode;
    routesConfig: RouterConfigData[];
};
const UserMiniHeader: React.FC<Props> = ({ children, routesConfig }) => {
    const { footer, layoutType, footerType } = useLayoutContext();

    return (
        <StyledAppLayoutMinibar
            className={clsx({
                appMainFooter: footer && footerType === FooterType.FLUID,
                appMainFixedFooter: footer && footerType === FooterType.FIXED,
                boxedLayout: layoutType === LayoutType.BOXED,
            })}
        >
            <AppSidebar routesConfig={routesConfig} />
            <StyledAppLayoutMinibarMain className="app-layout-userMiniHeader-main">
                <AppHeader />
                <StyledUserMiniHeaderScrollbar>
                    <AppContentView>{children}</AppContentView>
                    <AppFooter />
                </StyledUserMiniHeaderScrollbar>
            </StyledAppLayoutMinibarMain>
            <AppThemeSetting />
        </StyledAppLayoutMinibar>
    );
};

export default UserMiniHeader;
