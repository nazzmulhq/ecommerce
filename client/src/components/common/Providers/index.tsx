import AppContextProvider from "@lib/context/AppContextProvider";
import AppLocaleProvider from "@lib/context/AppLocaleProvider";
import StyledComponentsRegistry from "@lib/context/AppStyleProvider";
import AppThemeProvider from "@lib/context/AppThemeProvider";
import { GlobalStyles } from "@lib/theme/GlobalStyle";
import { FC, ReactNode } from "react";
import AntdRegistryRegistry from "./AntdRegistryRegistry";

export interface IProviders {
    children: ReactNode;
}

const Providers: FC<IProviders> = ({ children }) => {
    return (
        <AppContextProvider>
            <AppThemeProvider>
                <AppLocaleProvider>
                    <AntdRegistryRegistry>
                        <StyledComponentsRegistry>
                            <GlobalStyles />
                            {children}
                        </StyledComponentsRegistry>
                    </AntdRegistryRegistry>
                </AppLocaleProvider>
            </AppThemeProvider>
        </AppContextProvider>
    );
};

export default Providers;
