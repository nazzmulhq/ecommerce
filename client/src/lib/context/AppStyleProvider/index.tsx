"use client";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import Entity from "@ant-design/cssinjs/lib/Cache";
import { useServerInsertedHTML } from "next/navigation";
import React, { ReactNode } from "react";

interface AppStyleProviderProps {
    children: ReactNode;
}

const AppStyleProvider: React.FC<AppStyleProviderProps> = ({ children }) => {
    const cache = React.useMemo<Entity>(() => createCache(), []);
    const isServerInserted = React.useRef<boolean>(false);

    useServerInsertedHTML(() => {
        // Avoid duplicate insertion in the client side
        if (isServerInserted.current) {
            return;
        }
        isServerInserted.current = true;
        return <style dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} id="antd" />;
    });

    return <StyleProvider cache={cache}>{children}</StyleProvider>;
};
export default AppStyleProvider;
