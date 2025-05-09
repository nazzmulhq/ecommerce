"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AppContextProvider from "@lib/context/AppContextProvider";
import AppLocaleProvider from "@lib/context/AppLocaleProvider";
import AppThemeProvider from "@lib/context/AppThemeProvider";
import { GlobalStyles } from "@lib/theme/GlobalStyle";
import "antd/dist/reset.css";
import { FC, ReactNode } from "react";
import "simplebar-react/dist/simplebar.min.css";
import "../../../../public/styles/index.css";
import StyledComponentsRegistry from "./StyledComponentsRegistry";
export interface IProviders {
    children: ReactNode;
}

const Providers: FC<IProviders> = ({ children }) => {
    return (
        <AppContextProvider>
            <AppThemeProvider>
                <AppLocaleProvider>
                    <AntdRegistry>
                        <StyledComponentsRegistry>
                            <GlobalStyles />
                            {children}
                        </StyledComponentsRegistry>
                    </AntdRegistry>
                </AppLocaleProvider>
            </AppThemeProvider>
        </AppContextProvider>
    );
};

export default Providers;
