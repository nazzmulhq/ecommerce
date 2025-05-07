import { CheckOutlined, PlusOutlined } from "@ant-design/icons";

import { ThemeColorType } from "@lib/constants/ColorSets";
import { useThemeContext } from "@lib/context/AppContextProvider/ThemeContextProvider";
import IntlMessages from "@lib/utils/IntlMessages";
import React from "react";
import {
    StyledColorBody,
    StyledColorBodyColor,
    StyledColorBodyWrapper,
    StyledColorCheckboxWrapper,
    StyledColorHeadingWrapper,
    StyledColorTitle,
    StyledColorWrapper,
} from "./index.styled";

type ColorCellProps = {
    themeColorSet: ThemeColorType;
    updateThemeColors: (colorSet: ThemeColorType) => void;
};
const CustomColorCell: React.FC<ColorCellProps> = ({ themeColorSet, updateThemeColors }) => {
    const { theme } = useThemeContext();
    return (
        <div
            onClick={() => {
                updateThemeColors(themeColorSet);
            }}
        >
            <StyledColorWrapper>
                <StyledColorHeadingWrapper style={{ backgroundColor: themeColorSet.primary.main }}>
                    Primary
                    {theme.palette.primary.main === themeColorSet.primary.main &&
                    theme.palette.secondary.main === themeColorSet.secondary.main &&
                    theme.palette.mode === themeColorSet.mode ? (
                        <StyledColorCheckboxWrapper>
                            <CheckOutlined>
                                <IntlMessages id="customizer.checked" />
                            </CheckOutlined>
                        </StyledColorCheckboxWrapper>
                    ) : null}
                </StyledColorHeadingWrapper>
                <StyledColorBodyWrapper
                    style={{
                        backgroundColor: themeColorSet.background.default,
                        color: themeColorSet.text.primary,
                    }}
                >
                    <StyledColorBody
                        style={{
                            backgroundColor: themeColorSet.background.paper,
                            color: themeColorSet.text.primary,
                        }}
                    >
                        Paper
                        <StyledColorBodyColor style={{ backgroundColor: themeColorSet.secondary.main }}>
                            <PlusOutlined />
                        </StyledColorBodyColor>
                    </StyledColorBody>
                    Background
                </StyledColorBodyWrapper>
            </StyledColorWrapper>
            <StyledColorTitle>{themeColorSet.title}</StyledColorTitle>
        </div>
    );
};

export default CustomColorCell;
