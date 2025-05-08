"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AppContextProvider from "@lib/context/AppContextProvider";
import AppLocaleProvider from "@lib/context/AppLocaleProvider";
import StyledComponentsRegistry from "@lib/context/AppStyleProvider";
import AppThemeProvider from "@lib/context/AppThemeProvider";
import { GlobalStyles } from "@lib/theme/GlobalStyle";
import "antd/dist/reset.css";
import { FC, ReactNode } from "react";
import "simplebar-react/dist/simplebar.min.css";
import "../../../../public/styles/index.css";
import AppLayout from "../AppLayout";
export interface IProviders {
    children: ReactNode;
}

const Providers: FC<IProviders> = ({ children }) => {
    return (
        <StyledComponentsRegistry>
            <AntdRegistry>
                <AppContextProvider>
                    <AppThemeProvider>
                        <AppLocaleProvider>
                            <GlobalStyles />
                            <AppLayout>{children}</AppLayout>
                        </AppLocaleProvider>
                    </AppThemeProvider>
                </AppContextProvider>
            </AntdRegistry>
        </StyledComponentsRegistry>
    );
};

export default Providers;
