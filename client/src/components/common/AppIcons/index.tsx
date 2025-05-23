"use client";
import { TIconName } from "@src/types/iconName";
import React from "react";
import iconPacks from "./icons";

interface IconProps {
    name: TIconName; // e.g., "IoSettingsSharp", "MdHome", "FaUserLock"
    size?: number;
    color?: string;
    className?: string;
}

const Icons: React.FC<IconProps> = ({ name, size = 20, color = "currentColor", className = "", ...rest }) => {
    // Extract prefix (first two letters, e.g., "Io", "Md", "Fa")
    const prefix = name.slice(0, 2);
    const [IconComponent, setIconComponent] = React.useState<React.ComponentType<any> | null>(null);

    React.useEffect(() => {
        let isMounted = true;
        const loadIcon = async () => {
            const importPack = iconPacks[prefix];
            if (!importPack) {
                console.warn(`Icon pack for prefix "${prefix}" not found`);
                return;
            }
            const icons = await importPack();
            const Component = icons[name];
            if (!Component) {
                console.warn(`Icon "${name}" not found in pack "${prefix}"`);
                return;
            }
            if (isMounted) setIconComponent(() => Component);
        };
        loadIcon();
        return () => {
            isMounted = false;
        };
    }, [name, prefix]);

    if (!IconComponent) return null;
    return <IconComponent size={size} color={color} className={className} {...rest} />;
};

export default Icons;
