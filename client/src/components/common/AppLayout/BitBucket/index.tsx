"use client";
import clsx from "clsx";
import React, { useState } from "react";

import AppContentView from "@components/common/AppContentView";
import AppThemeSetting from "@components/common/AppThemeSetting";
import { FooterType } from "@lib/constants/AppEnums";
import { useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import AppFooter from "../components/AppFooter";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { StyledAppBitbucketLayout, StyledAppBitbucketLayoutMain, StyledBitbucketMainScrollbar } from "./index.styled";

type Props = {
    children: React.ReactNode;
    routesConfig: RouterConfigData[];
};

const BitBucket: React.FC<Props> = ({ children, routesConfig }) => {
    const [isVisible, setVisible] = useState(false);
    const { footer, footerType } = useLayoutContext();

    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    return (
        <StyledAppBitbucketLayout
            className={clsx({
                appMainFooter: footer && footerType === FooterType.FLUID,
                appMainFixedFooter: footer && footerType === FooterType.FIXED,
            })}
        >
            <AppSidebar onClose={onClose} routesConfig={routesConfig} visible={isVisible} />
            <StyledAppBitbucketLayoutMain>
                <AppHeader showDrawer={showDrawer} />
                <StyledBitbucketMainScrollbar>
                    <AppContentView>{children}</AppContentView>
                    <AppFooter />
                </StyledBitbucketMainScrollbar>
            </StyledAppBitbucketLayoutMain>
            <AppThemeSetting />
        </StyledAppBitbucketLayout>
    );
};

export default React.memo(BitBucket);
