"use client";
import { TIconName } from "@src/types/iconName";
import React from "react";
import iconPacks from "./icons";

interface IconProps {
    name: TIconName;
    size?: number;
    color?: string;
    className?: string;
}

const AppIcons: React.FC<IconProps> = ({ name, size = 20, color = "currentColor", className = "", ...rest }) => {
    // Memoize prefix extraction
    const prefix = React.useMemo(() => name.slice(0, 2), [name]);
    const [IconComponent, setIconComponent] = React.useState<React.ComponentType<any> | null>(null);

    React.useEffect(() => {
        let isMounted = true;
        const importPack = iconPacks[prefix];

        if (!importPack) {
            console.warn(`Icon pack "${prefix}" not found. Please check the icon name.`);
            setIconComponent(null);
            return;
        }
        // Dynamically import the icon pack
        importPack().then(icons => {
            console.log(`Loaded icon pack "${prefix}"`);
            console.log(`icons`, icons);
            const Component = icons[name];
            if (!Component) {
                console.warn(`Icon "${name}" not found in pack "${prefix}"`);
                if (isMounted) setIconComponent(null);
                return;
            }
            if (isMounted) setIconComponent(() => Component);
        });
        return () => {
            isMounted = false;
        };
    }, [name, prefix]);

    if (!IconComponent) return null;
    return <IconComponent size={size} color={color} className={className} {...rest} />;
};

export default AppIcons;
