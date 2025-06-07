"use client";
import { componentTokens } from "@lib/constants/defaultConfig";
import AppLocale from "@lib/localization";
import { getAntTheme } from "@lib/utils/ThemeHelper";
import { App, ConfigProvider, theme as antdTheme } from "antd";
import React, { ReactElement, useEffect, useRef } from "react";
import { ThemeProvider } from "styled-components";
import { useLayoutContext } from "../AppContextProvider/LayoutContextProvider";
import { useLocaleContext } from "../AppContextProvider/LocaleContextProvider";
import { useThemeContext } from "../AppContextProvider/ThemeContextProvider";

/* 2. Prepare AntD theme tokens and component overrides */
const { defaultAlgorithm, darkAlgorithm } = antdTheme;

interface AppThemeProviderProps {
    children: ReactElement;
}

const AppThemeProvider: React.FC<AppThemeProviderProps> = props => {
    const { direction } = useLayoutContext();
    const { locale } = useLocaleContext();
    const { theme } = useThemeContext();
    const modalContainerRef = useRef<HTMLDivElement>(null);

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
                    algorithm: theme.mode === "dark" ? darkAlgorithm : defaultAlgorithm,
                    components: componentTokens,
                }}
                getPopupContainer={() => modalContainerRef.current as HTMLElement}
            >
                <App>
                    <div ref={modalContainerRef}>{props.children}</div>
                </App>
            </ConfigProvider>
        </ThemeProvider>
    );
};

export default React.memo(AppThemeProvider);
