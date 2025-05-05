"use client";
import AppLocale from "@lib/localization";
import { getAntTheme } from "@lib/utils/ThemeHelper";
import { ConfigProvider } from "antd";
import React, { ReactElement, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { useLayoutContext } from "../AppContextProvider/LayoutContextProvider";
import { useLocaleContext } from "../AppContextProvider/LocaleContextProvider";
import { useThemeContext } from "../AppContextProvider/ThemeContextProvider";

interface AppThemeProviderProps {
    children: ReactElement;
}

const AppThemeProvider: React.FC<AppThemeProviderProps> = props => {
    const { direction } = useLayoutContext();
    const { locale } = useLocaleContext();
    const { theme } = useThemeContext();

    const { antLocale } = AppLocale[locale.locale];

    useEffect(() => {
        document.body.setAttribute("dir", direction);
    }, [direction]);

    return (
        <ThemeProvider theme={theme}>
            <ConfigProvider
                // direction={direction}
                locale={antLocale}
                theme={{
                    token: getAntTheme(theme),
                }}
            >
                {props.children}
            </ConfigProvider>
        </ThemeProvider>
    );
};

export default React.memo(AppThemeProvider);
