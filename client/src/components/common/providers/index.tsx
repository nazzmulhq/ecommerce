import { StyleProvider } from "@ant-design/cssinjs";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import { GlobalStyles } from "@lib/theme/GlobalStyle";
import theme from "@lib/utils/theme";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import { FC, ReactNode } from "react";
import { Normalize } from "styled-normalize";
import ServerStyleRegistry from "./ServerStyleRegistry";
export interface IProviders {
    children: ReactNode;
}

/**
 * Application provider that sets up Ant Design theming and styling
 * Works in both client and server components
 */
const Providers: FC<IProviders> = ({ children }) => {
    return (
        <AntdRegistry>
            <StyleProvider hashPriority="high">
                <ConfigProvider theme={theme}>
                    <ServerStyleRegistry>
                        <Normalize />
                        <GlobalStyles />
                        {children}
                    </ServerStyleRegistry>
                </ConfigProvider>
            </StyleProvider>
        </AntdRegistry>
    );
};

export default Providers;
