"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import theme from "@lib/utils/theme";
import { ConfigProvider, unstableSetRender } from "antd";
import { FC, useEffect } from "react";
import { createRoot } from "react-dom/client";

export interface IProviders {
    children: React.ReactNode;
}

const Providers: FC<IProviders> = ({ children }) => {
    useEffect(() => {
        unstableSetRender((node, container) => {
            container._reactRoot ||= createRoot(container);
            const root = container._reactRoot;
            root.render(node);
            return async () => {
                await new Promise(resolve => setTimeout(resolve, 0));
                root.unmount();
            };
        });
    }, []);
    return (
        <>
            <AntdRegistry>
                <ConfigProvider theme={theme}>{children}</ConfigProvider>
            </AntdRegistry>
        </>
    );
};

export default Providers;
