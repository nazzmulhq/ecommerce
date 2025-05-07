import AppGrid from "@components/common/AppGrid";
import { ThemeColorType } from "@lib/constants/ColorSets";
import { useThemeActionsContext, useThemeContext } from "@lib/context/AppContextProvider/ThemeContextProvider";
import IntlMessages from "@lib/utils/IntlMessages";

import CustomColorCell from "../ColorCell";
import { StyledThemeColorSetting, StyledThemeColorSettingTitle } from "./index.styled";

const ThemeColors = () => {
    const { theme } = useThemeContext();

    const { updateTheme } = useThemeActionsContext();

    const updateThemeColors = (colorSet: ThemeColorType) => {
        theme.palette.primary.main = colorSet.primary.main;
        theme.palette.secondary.main = colorSet.secondary.main;
        theme.palette.background = colorSet.background;
        theme.palette.mode = colorSet.mode;
        theme.palette.text = colorSet.text;

        updateTheme({ ...theme });
    };
    return (
        <StyledThemeColorSetting>
            <StyledThemeColorSettingTitle>
                <IntlMessages id="customizer.themeColors" />
            </StyledThemeColorSettingTitle>
            <AppGrid
                data={themeColorSets}
                itemPadding={5}
                renderItem={(colorSet, index) => (
                    <CustomColorCell key={index} themeColorSet={colorSet} updateThemeColors={updateThemeColors} />
                )}
                responsive={{
                    xs: 1,
                    sm: 2,
                }}
            />
        </StyledThemeColorSetting>
    );
};

export default ThemeColors;
