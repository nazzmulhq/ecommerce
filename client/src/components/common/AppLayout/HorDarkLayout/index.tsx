"use client";
import clsx from "clsx";
import React, { useEffect, useState } from "react";

import AppContentView from "@components/common/AppContentView";
import AppThemeSetting from "@components/common/AppThemeSetting";
import { FooterType, LayoutType } from "@lib/constants/AppEnums";
import { useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import AppFooter from "../components/AppFooter";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { StyledAppLayoutHorDark, StyledAppLayoutHorDarkMain, StyledContainer } from "./index.styled";

type Props = {
    children: React.ReactNode;
    routesConfig: RouterConfigData[];
};

const HorDarkLayout: React.FC<Props> = ({ children, routesConfig }) => {
    const [isVisible, setVisible] = useState(false);
    const { footer, footerType, layoutType } = useLayoutContext();

    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    useEffect(() => {
        if (layoutType === LayoutType.FRAMED) {
            document.body.classList.add("framedHorDarkLayout");
        } else {
            document.body.classList.remove("framedHorDarkLayout");
        }
    }, [layoutType]);

    return (
        <StyledAppLayoutHorDark
            className={clsx({
                appMainFooter: footer && footerType === FooterType.FLUID,
                appMainFixedFooter: footer && footerType === FooterType.FIXED,
            })}
        >
            <AppSidebar onClose={onClose} routesConfig={routesConfig} visible={isVisible} />
            <AppHeader routesConfig={routesConfig} showDrawer={showDrawer} />
            <StyledAppLayoutHorDarkMain>
                <StyledContainer>
                    <AppContentView>{children}</AppContentView>
                    <AppFooter />
                </StyledContainer>
            </StyledAppLayoutHorDarkMain>
            <AppThemeSetting />
        </StyledAppLayoutHorDark>
    );
};

export default HorDarkLayout;
