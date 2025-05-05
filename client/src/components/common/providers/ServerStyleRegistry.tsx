"use client";

import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";
import { useServerInsertedHTML } from "next/navigation";
import React from "react";

export default function ServerStyleRegistry({ children }: { children: React.ReactNode }) {
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
}
