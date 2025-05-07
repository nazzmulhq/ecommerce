import { CheckOutlined } from "@ant-design/icons";

import { ThemeColorType } from "@lib/constants/ColorSets";
import React from "react";
import { StyledColorOptionListItem, StyledCustomColorOption, StyledCustomColorOptionRightIcon } from "./index.styled";

type ColorCellProps = {
    themeColorSet: any;
    sidebarBGColor: any;
    updateThemeColors: (colorSet: ThemeColorType) => void;
};
const CustomColorCell: React.FC<ColorCellProps> = ({ themeColorSet, sidebarBGColor, updateThemeColors }) => {
    return (
        <StyledColorOptionListItem
            onClick={() => {
                updateThemeColors(themeColorSet.color);
            }}
        >
            <StyledCustomColorOption style={{ backgroundColor: themeColorSet.color }}>
                {themeColorSet.color === sidebarBGColor ? (
                    <StyledCustomColorOptionRightIcon>
                        <CheckOutlined />
                    </StyledCustomColorOptionRightIcon>
                ) : null}
            </StyledCustomColorOption>
        </StyledColorOptionListItem>
    );
};

export default CustomColorCell;
