import { CheckOutlined } from "@ant-design/icons";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { MdColorLens } from "react-icons/md";

import { LayoutDirection, LayoutType } from "@lib/constants/AppEnums";
import { useLayoutActionsContext, useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { layoutTypes, navStyles, sidebarColors } from "@lib/fakedb/navigationStyle";
import IntlMessages from "@lib/utils/IntlMessages";
import AppGrid from "../AppGrid";
import AppScrollbar from "../AppScrollbar";
import {
    StyledCustomizedHeader,
    StyledCustomizedItem,
    StyledCustomizedMain,
    StyledCustomizeDrawer,
    StyledCustomizedSwitch,
    StyledCustomizedSwitchView,
    StyledCustomizeNavOption,
    StyledCustomizeNavOptionContent,
    StyledCustomizeNavOptionItem,
    StyledCustomizeNavOptionRightIcon,
    StyledCustomizerButton,
    StyledCustomizerOption,
} from "./index.styled";
import SidebarSettings from "./SidebarSettings";
import MenuColorCell from "./SidebarSettings/MenuColorCell";
import ThemeColors from "./ThemeColors";
import ThemeModes from "./ThemeModes";

const AppThemeSetting = () => {
    const [open, setCustomizerStatus] = useState(false);
    const [isColorSettingOpen, setColorSettingOpen] = useState(false);

    const {
        navStyle,
        direction,
        // footerType,
        footer,
        layoutType,
    } = useLayoutContext();

    const { setFooter, updateDirection, updateNavStyle, updateLayoutType } = useLayoutActionsContext();

    const onLayoutChange = (layoutType: string) => {
        updateLayoutType(layoutType);
    };
    const onNavStyleChange = (navStyle: string) => {
        updateNavStyle(navStyle);
    };

    const onChangeRtlSetting = (checked: boolean) => {
        updateDirection(checked ? LayoutDirection.RTL : LayoutDirection.LTR);
    };

    return (
        <StyledCustomizerOption>
            <StyledCustomizerButton onClick={() => setCustomizerStatus(!open)}>
                <FiSettings className="ant-spin-dot-spin" style={{ fontSize: 20 }} />
            </StyledCustomizerButton>
            <StyledCustomizerButton onClick={() => setColorSettingOpen(!isColorSettingOpen)}>
                <MdColorLens style={{ fontSize: 20 }} />
            </StyledCustomizerButton>
            <StyledCustomizeDrawer
                className={clsx({
                    boxedDrawer: layoutType === LayoutType.BOXED,
                })}
                closable={false}
                onClose={() => setCustomizerStatus(false)}
                open={open}
                placement={direction === "ltr" ? "right" : "left"}
                title={
                    <StyledCustomizedHeader>
                        <h3>
                            <IntlMessages id="customizer.customiseTheme" />
                        </h3>
                        <p>
                            <IntlMessages id="customizer.customiseText" />
                        </p>
                    </StyledCustomizedHeader>
                }
            >
                <AppScrollbar>
                    <StyledCustomizedMain>
                        <SidebarSettings />

                        <StyledCustomizedItem>
                            <StyledCustomizedSwitchView>
                                <h4>
                                    <IntlMessages id="customizer.rtlSupport" />
                                </h4>
                                <StyledCustomizedSwitch
                                    checked={direction === LayoutDirection.RTL}
                                    onChange={onChangeRtlSetting}
                                />
                            </StyledCustomizedSwitchView>
                        </StyledCustomizedItem>

                        <StyledCustomizedItem>
                            <h4>
                                <IntlMessages id="customizer.navigationStyles" />
                            </h4>
                            <StyledCustomizeNavOption>
                                {navStyles.map(navLayout => {
                                    return (
                                        <StyledCustomizeNavOptionItem key={navLayout.id}>
                                            <StyledCustomizeNavOptionContent
                                                onClick={() => onNavStyleChange(navLayout.alias)}
                                            >
                                                <Image alt="nav" height={57} src={`${navLayout.image}`} width={65} />
                                                {navStyle === navLayout.alias ? (
                                                    <StyledCustomizeNavOptionRightIcon>
                                                        <CheckOutlined />
                                                    </StyledCustomizeNavOptionRightIcon>
                                                ) : null}
                                            </StyledCustomizeNavOptionContent>
                                        </StyledCustomizeNavOptionItem>
                                    );
                                })}
                            </StyledCustomizeNavOption>
                        </StyledCustomizedItem>

                        <StyledCustomizedItem>
                            <h4>
                                <IntlMessages id="customizer.layoutTypes" />
                            </h4>
                            <StyledCustomizeNavOption>
                                {layoutTypes.map(layout => {
                                    return (
                                        <StyledCustomizeNavOptionItem key={layout.id}>
                                            <StyledCustomizeNavOptionContent
                                                onClick={() => onLayoutChange(layout.alias)}
                                            >
                                                <Image
                                                    alt="nav"
                                                    className="layout-img"
                                                    height={48}
                                                    src={`${layout.image}`}
                                                    width={84}
                                                />
                                                {layoutType === layout.alias ? (
                                                    <StyledCustomizeNavOptionRightIcon>
                                                        <CheckOutlined />
                                                    </StyledCustomizeNavOptionRightIcon>
                                                ) : null}
                                            </StyledCustomizeNavOptionContent>
                                        </StyledCustomizeNavOptionItem>
                                    );
                                })}
                            </StyledCustomizeNavOption>
                        </StyledCustomizedItem>

                        <StyledCustomizedItem>
                            <StyledCustomizedSwitchView>
                                <h4>Footer</h4>
                                <StyledCustomizedSwitch checked={footer} onChange={value => setFooter(value)} />
                            </StyledCustomizedSwitchView>
                        </StyledCustomizedItem>

                        {/* <div className='customize-item'>
              <h4>Footer Type</h4>
              <Select className='customize-select-box'>
                <Option value={FooterType.FIXED}>Fixed</Option>
                <Option value={FooterType.FLUID}>Fluid</Option>
              </Select>
            </div>*/}
                    </StyledCustomizedMain>
                </AppScrollbar>
            </StyledCustomizeDrawer>

            <StyledCustomizeDrawer
                className={clsx({
                    boxedDrawer: layoutType === LayoutType.BOXED,
                })}
                closable={false}
                onClose={() => setColorSettingOpen(false)}
                open={isColorSettingOpen}
                placement={direction === "ltr" ? "right" : "left"}
                title={
                    <StyledCustomizedHeader>
                        <h3>
                            <IntlMessages id="customizer.customiseSidebar" />
                        </h3>
                        <p>
                            <IntlMessages id="customizer.customiseSidebarText" />
                        </p>
                    </StyledCustomizedHeader>
                }
            >
                <AppScrollbar>
                    <StyledCustomizedMain>
                        <StyledCustomizedItem>
                            <ThemeModes />
                            <h4>Sidebar Colors</h4>
                            <AppGrid
                                column={2}
                                data={sidebarColors}
                                itemPadding={5}
                                renderItem={(colorSet, index) => <MenuColorCell key={index} sidebarColors={colorSet} />}
                            />
                        </StyledCustomizedItem>
                        <StyledCustomizedItem>
                            <ThemeColors />
                        </StyledCustomizedItem>
                    </StyledCustomizedMain>
                </AppScrollbar>
            </StyledCustomizeDrawer>
        </StyledCustomizerOption>
    );
};

export default AppThemeSetting;
