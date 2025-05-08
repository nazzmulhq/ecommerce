"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { FC } from "react";

export interface IAntdRegistryRegistry {
    children: React.ReactNode;
}

const AntdRegistryRegistry: FC<IAntdRegistryRegistry> = ({ children }) => {
    return <AntdRegistry>{children}</AntdRegistry>;
};

export default AntdRegistryRegistry;
