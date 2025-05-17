import React from "react";

// Icon map object that contains all available icons
export const icons = {
    IoSettingsSharp: React.lazy(() => import("react-icons/io5").then(module => ({ default: module.IoSettingsSharp }))),
    MdAdminPanelSettings: React.lazy(() =>
        import("react-icons/md").then(module => ({ default: module.MdAdminPanelSettings })),
    ),
};

// Define the types for our props
interface IconProps {
    name: keyof typeof icons;
    size?: number;
    color?: string;
    className?: string;
}

const Icons: React.FC<IconProps> = ({ name, size = 20, color = "currentColor", className = "" }) => {
    const IconComponent = icons[name];

    if (!IconComponent) {
        console.warn(`Icon with name "${name}" not found`);
        return null;
    }

    return <IconComponent size={size} color={color} className={className} />;
};

export default Icons;
