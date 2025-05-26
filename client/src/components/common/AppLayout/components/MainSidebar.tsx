"use client";
import { ThemeMode } from "@lib/constants/AppEnums";
import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { useThemeContext } from "@lib/context/AppContextProvider/ThemeContextProvider";
import { Layout } from "antd";
import React from "react";

const { Sider } = Layout;

type Props = {
    children: React.ReactNode;
    className?: string;
    collapsed?: any;
    [key: string]: any;
};
const MainSidebar: React.FC<Props> = ({ children, className, collapsed = false, ...props }) => {
    const { themeMode } = useThemeContext();
    const { sidebarColorSet, allowSidebarBgImage, sidebarBgImageId } = useSidebarContext();

    return (
        <Sider
            breakpoint="lg"
            className={className}
            collapsed={collapsed}
            style={{
                backgroundColor: sidebarColorSet.sidebarBgColor,
                color: sidebarColorSet.sidebarTextColor,
                backgroundImage: allowSidebarBgImage
                    ? `url(/assets/images/sidebar/images/${sidebarBgImageId}.png)`
                    : "",
            }}
            theme={themeMode === ThemeMode.LIGHT ? ThemeMode.LIGHT : ThemeMode.DARK}
            {...props}
        >
            {children}
        </Sider>
    );
};

export default MainSidebar;
