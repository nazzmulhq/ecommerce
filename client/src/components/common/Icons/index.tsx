import React from "react";
import iconData from "./icon.json";

// Interface for Icon component props
interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: string;
    size?: number | string;
    className?: string;
}

// Define types for SVG element structure
interface SvgElement {
    tag: string;
    attr?: Record<string, string | number>;
    child?: SvgElement[];
}

// Helper function to generate JSX elements from SVG structure
const generateElement = (item: SvgElement, key: string | number = "") => {
    const { tag, attr = {}, child = [] } = item;

    // Use createElement instead of JSX to avoid TypeScript errors
    return React.createElement(
        tag,
        { key, ...attr },
        child.length > 0 ? child.map((childItem, index) => generateElement(childItem, `${key}-${index}`)) : null,
    );
};

// Icon component
export const Icons: React.FC<IconProps> = ({ name, size = "1em", className = "", ...props }) => {
    // Return null if icon name doesn't exist
    if (!iconData[name as keyof typeof iconData]) {
        console.warn(`Icon "${name}" not found in icon data`);
        return null;
    }

    // Get the icon data
    const icon = iconData[name as keyof typeof iconData];

    // Set the width and height
    const svgProps = {
        ...icon.attr,
        ...props,
        width: size,
        height: size,
        className: className ? `icon ${className}` : "icon",
    };

    return generateElement({
        tag: icon.tag,
        attr: svgProps,
        child: icon.child,
    });
};

export default Icons;
