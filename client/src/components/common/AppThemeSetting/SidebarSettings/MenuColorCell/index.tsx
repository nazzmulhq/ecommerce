import { MenuStyle, NavStyle, ThemeMode } from "@lib/constants/AppEnums";
import defaultConfig, { SidebarData } from "@lib/constants/defaultConfig";
import { useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { useSidebarActionsContext, useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import clsx from "clsx";
import React from "react";
import AppSelectedIcon from "../../../AppSelectedIcon";
import {
    StyledMenuColorCell,
    StyledMenuColorCellContent,
    StyledMenuColorCellHeader,
    StyledMenuColorCellHeaderAvatar,
    StyledMenuColorCellHeaderContent,
    StyledMenuColorCellHeaderContentLine,
    StyledMenuColorCellItem,
    StyledMenuColorCellItemSelected,
} from "./index.styled";

type Props = {
    sidebarColors: SidebarData;
};
const MenuColorCell: React.FC<Props> = ({ sidebarColors }) => {
    const { sidebarColorSet, menuStyle } = useSidebarContext();
    const { updateSidebarColorSet } = useSidebarActionsContext();
    const { sidebarBgColor, sidebarTextColor, sidebarMenuSelectedBgColor, sidebarMenuSelectedTextColor } =
        sidebarColorSet;
    const { navStyle } = useLayoutContext();

    return (
        <StyledMenuColorCell
            onClick={() => updateSidebarColorSet(sidebarColors)}
            style={{
                border:
                    sidebarColors.mode === ThemeMode.LIGHT
                        ? `solid 2px ${defaultConfig.sidebar.borderColor}`
                        : `solid 2px ${sidebarColors.sidebarBgColor}`,
            }}
        >
            {navStyle === NavStyle.DEFAULT ? (
                <StyledMenuColorCellHeader
                    style={{
                        backgroundColor: sidebarColors.sidebarHeaderColor,
                        borderBottom: `solid 1px ${sidebarColors.sidebarTextColor}`,
                    }}
                >
                    <StyledMenuColorCellHeaderAvatar
                        style={{
                            border: `solid 1px ${sidebarColors.sidebarTextColor}`,
                        }}
                    />
                    <StyledMenuColorCellHeaderContent>
                        <StyledMenuColorCellHeaderContentLine
                            style={{
                                backgroundColor: sidebarColors.sidebarTextColor,
                            }}
                        />
                        <StyledMenuColorCellHeaderContentLine
                            style={{
                                backgroundColor: sidebarColors.sidebarTextColor,
                            }}
                        />
                    </StyledMenuColorCellHeaderContent>
                </StyledMenuColorCellHeader>
            ) : null}
            <StyledMenuColorCellContent
                style={{
                    backgroundColor: sidebarColors.sidebarBgColor,
                }}
            >
                <StyledMenuColorCellItem
                    style={{
                        color: sidebarColors.sidebarTextColor,
                    }}
                >
                    Menu-1
                </StyledMenuColorCellItem>
                <StyledMenuColorCellItem
                    style={{
                        color: sidebarColors.sidebarTextColor,
                    }}
                >
                    Menu-2
                </StyledMenuColorCellItem>
                <StyledMenuColorCellItemSelected
                    className={clsx({
                        "rounded-menu": menuStyle === MenuStyle.ROUNDED,
                        "rounded-menu-reverse": menuStyle === MenuStyle.ROUNDED_REVERSE,
                        "standard-menu": menuStyle === MenuStyle.STANDARD,
                        "default-menu": menuStyle === MenuStyle.DEFAULT,
                        "curved-menu": menuStyle === MenuStyle.CURVED_MENU,
                    })}
                    style={{
                        backgroundColor: sidebarColors.sidebarMenuSelectedBgColor,
                        color: sidebarColors.sidebarMenuSelectedTextColor,
                    }}
                >
                    Selected Menu
                </StyledMenuColorCellItemSelected>
                <StyledMenuColorCellItem
                    style={{
                        color: sidebarColors.sidebarTextColor,
                    }}
                >
                    Menu-4
                </StyledMenuColorCellItem>
            </StyledMenuColorCellContent>
            {sidebarColors.sidebarBgColor === sidebarBgColor &&
            sidebarColors.sidebarTextColor === sidebarTextColor &&
            sidebarColors.sidebarMenuSelectedBgColor === sidebarMenuSelectedBgColor &&
            sidebarColors.sidebarMenuSelectedTextColor === sidebarMenuSelectedTextColor ? (
                <AppSelectedIcon
                    backgroundColor={sidebarMenuSelectedBgColor}
                    color={sidebarMenuSelectedTextColor}
                    isCenter={false}
                />
            ) : null}
        </StyledMenuColorCell>
    );
};

export default MenuColorCell;
