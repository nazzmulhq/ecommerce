"use client";

import defaultConfig from "@lib/constants/defaultConfig";
import React, { createContext, ReactNode, useContext, useState } from "react";

export type LayoutData = {
    layoutType: string;
    navStyle: string;
    footerType: string;
    direction: string;
    footer: boolean;
};

export type LayoutActions = {
    updateLayoutType: (layout: string) => void;
    updateNavStyle: (navStyle: string) => void;
    setFooterType: (footerType: string) => void;
    setFooter: (footer: boolean) => void;
    updateDirection: (direction: string) => void;
};

const LayoutContext = createContext<LayoutData>({
    footer: defaultConfig.footer,
    navStyle: defaultConfig.navStyle,
    layoutType: defaultConfig.layoutType,
    footerType: defaultConfig.footerType,
    direction: defaultConfig.direction,
});

const LayoutActionsContext = createContext<LayoutActions>({
    updateLayoutType: () => {},
    updateNavStyle: () => {},
    setFooterType: () => {},
    setFooter: () => {},
    updateDirection: () => {},
});

export const useLayoutContext = () => useContext(LayoutContext);

export const useLayoutActionsContext = () => useContext(LayoutActionsContext);

type LayoutContextProviderProps = {
    children: ReactNode;
};

const LayoutContextProvider: React.FC<LayoutContextProviderProps> = ({ children }) => {
    const [layoutState, setLayoutState] = useState<LayoutData>({
        layoutType: defaultConfig.layoutType,
        navStyle: defaultConfig.navStyle,
        direction: defaultConfig.direction,
        footerType: defaultConfig.footerType,
        footer: defaultConfig.footer,
    });

    const layoutActions = React.useMemo<LayoutActions>(
        () => ({
            updateLayoutType: (layoutType: string) => setLayoutState(prev => ({ ...prev, layoutType })),
            updateNavStyle: (navStyle: string) => setLayoutState(prev => ({ ...prev, navStyle })),
            setFooterType: (footerType: string) => setLayoutState(prev => ({ ...prev, footerType })),
            setFooter: (footer: boolean) => setLayoutState(prev => ({ ...prev, footer })),
            updateDirection: (direction: string) => setLayoutState(prev => ({ ...prev, direction })),
        }),
        [],
    );

    const layoutValue = React.useMemo(() => layoutState, [layoutState]);

    return (
        <LayoutContext.Provider value={layoutValue}>
            <LayoutActionsContext.Provider value={layoutActions}>{children}</LayoutActionsContext.Provider>
        </LayoutContext.Provider>
    );
};

export default React.memo(LayoutContextProvider);
