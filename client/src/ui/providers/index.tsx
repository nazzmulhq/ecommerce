"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import theme from "@lib/utils/theme";
import { ConfigProvider } from "antd";
import { FC } from "react";

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
