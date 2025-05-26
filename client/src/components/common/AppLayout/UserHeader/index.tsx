"use client";
import { FooterType } from "@lib/constants/AppEnums";
import { useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { isEmpty } from "@lib/utils/Common";
import { RouterConfigData } from "@src/types/Apps";
import { Grid } from "antd";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import AppContentView from "../../AppContentView";
import AppThemeSetting from "../../AppThemeSetting";
import AppFooter from "../components/AppFooter";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import {
    StyledAppLayoutUserHeader,
    StyledAppLayoutUserHeaderMain,
    StyledUserHeaderMainScrollbar,
} from "./index.styled";

const { useBreakpoint } = Grid;

type Props = {
    children: React.ReactNode;
    routesConfig: RouterConfigData[];
};
const UserHeader: React.FC<Props> = ({ children, routesConfig }) => {
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
        <StyledAppLayoutUserHeader
            className={clsx({
                appMainFooter: footer && footerType === FooterType.FLUID,
                appMainFixedFooter: footer && footerType === FooterType.FIXED,
            })}
        >
            <AppSidebar isCollapsed={isCollapsed} routesConfig={routesConfig} />
            <StyledAppLayoutUserHeaderMain className="app-layout-userHeader-main">
                <AppHeader isCollapsed={isCollapsed} onToggleSidebar={onToggleSidebar} />
                <StyledUserHeaderMainScrollbar>
                    <AppContentView>{children}</AppContentView>
                    <AppFooter />
                </StyledUserHeaderMainScrollbar>
            </StyledAppLayoutUserHeaderMain>
            <AppThemeSetting />
        </StyledAppLayoutUserHeader>
    );
};

export default React.memo(UserHeader);
