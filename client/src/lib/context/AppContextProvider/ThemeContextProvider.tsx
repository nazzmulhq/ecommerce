"use client";

import { LayoutDirection, ThemeMode, ThemeStyle } from "@lib/constants/AppEnums";
import defaultConfig, {
    backgroundDark,
    backgroundLight,
    defaultTheme,
    textDark,
    textLight,
} from "@lib/constants/defaultConfig";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DefaultTheme } from "styled-components";

interface ThemeData {
    theme: DefaultTheme;
    themeMode: string;
    themeStyle: string;
}

interface ThemeActions {
    updateTheme: (theme: DefaultTheme) => void;
    updateThemeMode: (themeMode: string) => void;
    updateThemeStyle: (themeStyle: ThemeStyle) => void;
}

const ThemeContext = createContext<ThemeData>({
    theme: defaultTheme.theme,
    themeMode: defaultConfig.themeMode,
    themeStyle: defaultConfig.themeStyle,
});

const ThemeActionsContext = createContext<ThemeActions>({
    updateTheme: () => {},
    updateThemeMode: () => {},
    updateThemeStyle: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);
export const useThemeActionsContext = () => useContext(ThemeActionsContext);

type ThemeContextProviderProps = {
    children: ReactNode;
};

const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<DefaultTheme>(defaultTheme.theme);
    const [themeMode, setThemeMode] = useState(defaultConfig.themeMode);
    const [themeStyle, setThemeStyle] = useState<ThemeStyle>(defaultConfig.themeStyle);

    const updateTheme = useCallback((newTheme: DefaultTheme) => {
        setTheme(newTheme);
    }, []);

    const handleThemeModeChange = useCallback((newThemeMode: string) => {
        setThemeMode(newThemeMode);
    }, []);

    const handleThemeStyleChange = useCallback((newThemeStyle: ThemeStyle) => {
        setThemeStyle(newThemeStyle);
    }, []);

    // Update theme palette when themeMode changes
    useEffect(() => {
        const isDarkMode = themeMode === ThemeMode.DARK;
        setTheme(prevTheme => ({
            ...prevTheme,
            palette: {
                ...prevTheme.palette,
                mode: isDarkMode ? ThemeMode.DARK : ThemeMode.LIGHT,
                background: isDarkMode ? backgroundDark : backgroundLight,
                text: isDarkMode ? textDark : textLight,
            },
        }));
    }, [themeMode]);

    // Handle RTL/LTR layout direction changes
    useEffect(() => {
        document.body.setAttribute(
            "dir",
            theme.direction === LayoutDirection.RTL ? LayoutDirection.RTL : LayoutDirection.LTR,
        );
    }, [theme.direction]);

    // Memoize context values to optimize performance
    const themeContextValue = useMemo(
        () => ({
            theme,
            themeMode,
            themeStyle,
        }),
        [theme, themeMode, themeStyle],
    );

    const themeActionsValue = useMemo(
        () => ({
            updateTheme,
            updateThemeMode: handleThemeModeChange,
            updateThemeStyle: handleThemeStyleChange,
        }),
        [updateTheme, handleThemeModeChange, handleThemeStyleChange],
    );

    return (
        <ThemeContext.Provider value={themeContextValue}>
            <ThemeActionsContext.Provider value={themeActionsValue}>{children}</ThemeActionsContext.Provider>
        </ThemeContext.Provider>
    );
};

export default React.memo(ThemeContextProvider);
