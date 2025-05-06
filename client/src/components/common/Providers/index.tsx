"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import AppContextProvider from "@lib/context/AppContextProvider";
import AppLocaleProvider from "@lib/context/AppLocaleProvider";
import AppStyleProvider from "@lib/context/AppStyleProvider";
import AppThemeProvider from "@lib/context/AppThemeProvider";
import { GlobalStyles } from "@lib/theme/GlobalStyle";
import { FC, ReactNode } from "react";
import { Normalize } from "styled-normalize";

export interface IProviders {
    children: ReactNode;
}

const Providers: FC<IProviders> = ({ children }) => {
    return (
        <AppContextProvider>
            <AppThemeProvider>
                <AppLocaleProvider>
                    <AntdRegistry>
                        <AppStyleProvider>
                            <GlobalStyles />
                            <Normalize />
                            {children}
                        </AppStyleProvider>
                    </AntdRegistry>
                </AppLocaleProvider>
            </AppThemeProvider>
        </AppContextProvider>
    );
};

export default Providers;
