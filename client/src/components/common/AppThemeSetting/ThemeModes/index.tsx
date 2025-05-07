import { ThemeMode } from "@lib/constants/AppEnums";
import {
    backgroundDark,
    backgroundLight,
    DarkSidebar,
    LightSidebar,
    SidebarData,
    textDark,
    textLight,
} from "@lib/constants/defaultConfig";
import { useSidebarActionsContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { useThemeActionsContext, useThemeContext } from "@lib/context/AppContextProvider/ThemeContextProvider";
import IntlMessages from "@lib/utils/IntlMessages";
import { Radio } from "antd";
import clsx from "clsx";
import styled from "styled-components";
import { StyledThemeColorSetting, StyledThemeColorSettingTitle } from "../ThemeColors/index.styled";

const ToggleButtonGroup = styled(Radio.Group)``;
const StyledToggleButton = styled(Radio.Button)``;

const ThemeModes = () => {
    const { updateTheme, updateThemeMode } = useThemeActionsContext();
    const { updateSidebarColorSet } = useSidebarActionsContext();
    const { themeMode, theme } = useThemeContext();

    const onModeChange = (themeMode: ThemeMode) => {
        if (themeMode) {
            updateThemeMode(themeMode);
            if (themeMode === ThemeMode.LIGHT) {
                updateSidebarColorSet({
                    sidebarBgColor: LightSidebar.sidebarBgColor,
                    sidebarTextColor: LightSidebar.sidebarTextColor,
                    sidebarMenuSelectedBgColor: LightSidebar.sidebarMenuSelectedBgColor,
                    sidebarMenuSelectedTextColor: LightSidebar.sidebarMenuSelectedTextColor,
                    sidebarHeaderColor: LightSidebar.sidebarHeaderColor,
                } as SidebarData);
            } else {
                updateSidebarColorSet({
                    sidebarBgColor: DarkSidebar.sidebarBgColor,
                    sidebarTextColor: DarkSidebar.sidebarTextColor,
                    sidebarMenuSelectedBgColor: DarkSidebar.sidebarMenuSelectedBgColor,
                    sidebarMenuSelectedTextColor: DarkSidebar.sidebarMenuSelectedTextColor,
                    sidebarHeaderColor: DarkSidebar.sidebarHeaderColor,
                } as SidebarData);
            }
            updateThemeMode(themeMode);
            updateTheme({
                ...theme,
                palette: {
                    ...theme.palette,
                    mode: themeMode === ThemeMode.DARK ? ThemeMode.DARK : ThemeMode.LIGHT,
                    background: themeMode === ThemeMode.DARK ? backgroundDark : backgroundLight,
                    text: themeMode === ThemeMode.DARK ? textDark : textLight,
                },
            });
        }
    };

    return (
        <StyledThemeColorSetting>
            <StyledThemeColorSettingTitle>
                <IntlMessages id="customizer.themeMode" />
            </StyledThemeColorSettingTitle>

            <ToggleButtonGroup
                aria-label="text alignment"
                onChange={e => onModeChange(e.target.value)}
                value={themeMode}
            >
                <StyledToggleButton
                    aria-label="left aligned"
                    className={clsx({
                        active: themeMode === ThemeMode.LIGHT,
                    })}
                    value={ThemeMode.LIGHT}
                >
                    <IntlMessages id="customizer.light" />
                </StyledToggleButton>

                <StyledToggleButton
                    aria-label="centered"
                    className={clsx({
                        active: themeMode === ThemeMode.DARK || theme.palette.type === ThemeMode.DARK,
                    })}
                    value={ThemeMode.DARK}
                >
                    <IntlMessages id="customizer.dark" />
                </StyledToggleButton>
            </ToggleButtonGroup>
        </StyledThemeColorSetting>
    );
};

export default ThemeModes;
