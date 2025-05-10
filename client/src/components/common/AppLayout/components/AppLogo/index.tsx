"use client";
import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import Image from "next/image";
import React from "react";
import { StyledAppLogo } from "./index.styled";

type AppLogoProps = {
    hasSidebarColor?: boolean;
};
const AppLogo: React.FC<AppLogoProps> = ({ hasSidebarColor }) => {
    const { sidebarColorSet } = useSidebarContext();
    return (
        <StyledAppLogo>
            {hasSidebarColor && sidebarColorSet.mode === "dark" ? (
                <Image alt="logo" src="/assets/images/logo-white-with-name.png" width={64} height={64} />
            ) : (
                <Image alt="logo" src="/assets/images/logo-with-name.png" width={64} height={64} />
            )}
        </StyledAppLogo>
    );
};

export default AppLogo;
