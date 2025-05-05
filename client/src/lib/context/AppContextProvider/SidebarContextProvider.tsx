"use client";

import defaultConfig, { SidebarData } from "@lib/constants/defaultConfig";
import React, { createContext, ReactNode, useContext, useState } from "react";

export interface SidebarContextData {
    menuStyle: string;
    sidebarColorSet: SidebarData;
    allowSidebarBgImage: boolean;
    sidebarBgImageId: string | number;
}
export interface SidebarActions {
    updateMenuStyle: (style: string) => void;
    updateSidebarColorSet: (color: SidebarData) => void;
    setSidebarBgImage: (isImage: boolean) => void;
    updateSidebarBgImage: (image: number | string) => void;
}

const SidebarContext = createContext<SidebarContextData>({
    menuStyle: defaultConfig.sidebar.menuStyle,
    sidebarColorSet: defaultConfig.sidebar.colorSet,
    allowSidebarBgImage: defaultConfig.sidebar.allowSidebarBgImage,
    sidebarBgImageId: defaultConfig.sidebar.sidebarBgImageId,
});

const SidebarActionsContext = createContext<SidebarActions>({
    updateMenuStyle: () => {},
    updateSidebarColorSet: () => {},
    setSidebarBgImage: () => {},
    updateSidebarBgImage: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

export const useSidebarActionsContext = () => useContext(SidebarActionsContext);

interface SidebarContextProviderProps {
    children: ReactNode;
}

const SidebarContextProvider: React.FC<SidebarContextProviderProps> = ({ children }) => {
    const [menuStyle, updateMenuStyle] = useState<string>(defaultConfig.sidebar.menuStyle);
    const [sidebarColorSet, updateSidebarColorSet] = useState<SidebarData>(defaultConfig.sidebar.colorSet);
    const [allowSidebarBgImage, setSidebarBgImage] = useState<boolean>(defaultConfig.sidebar.allowSidebarBgImage);
    const [sidebarBgImageId, updateSidebarBgImage] = useState<number | string>(defaultConfig.sidebar.sidebarBgImageId);

    return (
        <SidebarContext.Provider
            value={{
                menuStyle,
                sidebarColorSet,
                allowSidebarBgImage,
                sidebarBgImageId,
            }}
        >
            <SidebarActionsContext.Provider
                value={{
                    updateMenuStyle,
                    updateSidebarColorSet,
                    setSidebarBgImage,
                    updateSidebarBgImage,
                }}
            >
                {children}
            </SidebarActionsContext.Provider>
        </SidebarContext.Provider>
    );
};
export default SidebarContextProvider;
