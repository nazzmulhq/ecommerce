"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { FC } from "react";
import theme from "../../lib/utils/theme";

export interface IProviders {
    children: React.ReactNode;
}

const Providers: FC<IProviders> = ({ children }) => {
    return (
        <>
            <AntdRegistry>
                <ConfigProvider theme={theme}>{children}</ConfigProvider>
            </AntdRegistry>
        </>
    );
};

export default Providers;
