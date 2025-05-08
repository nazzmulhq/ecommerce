import { FooterType } from "@lib/constants/AppEnums";
import { useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { isEmpty } from "@lib/utils/Common";
import { RouterConfigData } from "@src/types/Apps";
import { Grid } from "antd";
import clsx from "clsx";
import React, { useEffect, useState } from "react";

import AppContentView from "@components/common/AppContentView";
import AppThemeSetting from "@components/common/AppThemeSetting";
import AppFooter from "../components/AppFooter";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { StyledAppLayout, StyledAppLayoutMain, StyledMainScrollbar } from "./index.styled";

const { useBreakpoint } = Grid;

type Props = {
    children: React.ReactNode;
    routesConfig: RouterConfigData[];
};
const DefaultLayout: React.FC<Props> = ({ children, routesConfig }) => {
    const width = useBreakpoint();
    const [isCollapsed, setCollapsed] = useState(false);
    const { footer, footerType } = useLayoutContext();

    const onToggleSidebar = () => {
        setCollapsed(!isCollapsed);
    };

    useEffect(() => {
        if (!isEmpty(width)) {
            if (width.xl) {
                setCollapsed(false);
            } else {
                setCollapsed(true);
            }
        }
    }, [width]);

    return (
        <StyledAppLayout
            className={clsx({
                appMainFooter: footer && footerType === FooterType.FLUID,
                appMainFixedFooter: footer && footerType === FooterType.FIXED,
            })}
        >
            <AppSidebar isCollapsed={isCollapsed} routesConfig={routesConfig} />
            <StyledAppLayoutMain className="app-layout-main">
                <AppHeader isCollapsed={isCollapsed} onToggleSidebar={onToggleSidebar} />
                <StyledMainScrollbar>
                    <AppContentView>{children}</AppContentView>
                    <AppFooter />
                </StyledMainScrollbar>
            </StyledAppLayoutMain>
            <AppThemeSetting />
        </StyledAppLayout>
    );
};

export default React.memo(DefaultLayout);
