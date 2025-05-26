"use client";
import AppContentView from "@components/common/AppContentView";
import AppThemeSetting from "@components/common/AppThemeSetting";
import { FooterType } from "@lib/constants/AppEnums";
import { useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { isEmpty } from "@lib/utils/Common";
import { RouterConfigData } from "@src/types/Apps";
import { Grid } from "antd";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import AppFooter from "../components/AppFooter";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import {
    StyledAppLayoutStandard,
    StyledAppLayoutStandardMain,
    StyledAppLayoutStandardRow,
    StyledStandardScrollbar,
} from "./index.styled";

const { useBreakpoint } = Grid;

type Props = {
    children: React.ReactNode;
    routesConfig: RouterConfigData[];
};
const Standard: React.FC<Props> = ({ children, routesConfig }) => {
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
        <StyledAppLayoutStandard
            className={clsx({
                appMainFooter: footer && footerType === FooterType.FLUID,
                appMainFixedFooter: footer && footerType === FooterType.FIXED,
            })}
        >
            <AppHeader isCollapsed={isCollapsed} onToggleSidebar={onToggleSidebar} />
            <StyledAppLayoutStandardRow>
                <AppSidebar isCollapsed={isCollapsed} routesConfig={routesConfig} />
                <StyledAppLayoutStandardMain className="app-layout-standard-main">
                    <StyledStandardScrollbar>
                        <AppContentView>{children}</AppContentView>
                        <AppFooter />
                    </StyledStandardScrollbar>
                </StyledAppLayoutStandardMain>
            </StyledAppLayoutStandardRow>
            <AppThemeSetting />
        </StyledAppLayoutStandard>
    );
};

export default React.memo(Standard);
