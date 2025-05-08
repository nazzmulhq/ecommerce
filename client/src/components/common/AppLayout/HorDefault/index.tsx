import { FooterType, LayoutType } from "@lib/constants/AppEnums";
import { useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import AppContentView from "../../AppContentView";
import AppThemeSetting from "../../AppThemeSetting";
import AppFooter from "../components/AppFooter";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { StyledAppLayoutHor, StyledAppLayoutHorMain, StyledContainer } from "./index.styled";

type Props = {
    children: React.ReactNode;
    routesConfig: RouterConfigData[];
};

const HorDefault: React.FC<Props> = ({ children, routesConfig }) => {
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
            document.body.classList.add("framedHorLayout");
        } else {
            document.body.classList.remove("framedHorLayout");
        }
    }, [layoutType]);

    return (
        <StyledAppLayoutHor
            className={clsx({
                appMainFooter: footer && footerType === FooterType.FLUID,
                appMainFixedFooter: footer && footerType === FooterType.FIXED,
            })}
        >
            <AppSidebar onClose={onClose} routesConfig={routesConfig} visible={isVisible} />
            <AppHeader routesConfig={routesConfig} showDrawer={showDrawer} />
            <StyledAppLayoutHorMain>
                <StyledContainer>
                    <AppContentView>{children}</AppContentView>
                    <AppFooter />
                </StyledContainer>
            </StyledAppLayoutHorMain>
            <AppThemeSetting />
        </StyledAppLayoutHor>
    );
};

export default HorDefault;
