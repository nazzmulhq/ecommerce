import { Dropdown } from "antd";
import React from "react";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { useIntl } from "react-intl";

import AppHeaderMessages from "@components/common/AppHeaderMessages";
import AppLanguageSwitcher from "@components/common/AppLanguageSwitcher";
import AppNotifications from "@components/common/AppNotifications";
import { selectIsMenuCollapsed, toggleMenuCollapse } from "@lib/redux/config/projectConfig";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import AppLogo from "../components/AppLogo";
import { StyledDropdownWrapper } from "../index.styled";
import {
    StyledHeaderMiniSecDesktop,
    StyledHeaderMiniSecMobile,
    StyledHeaderMiniSidebar,
    StyledHeaderSearchMinibar,
} from "./index.styled";

const items = [
    { key: 1, label: <AppHeaderMessages /> },
    { key: 2, label: <AppNotifications /> },
    { key: 3, label: <AppLanguageSwitcher /> },
];

type AppHeaderProps = {};

const AppHeader = () => {
    const isMenuCollapsed = useAppSelector(selectIsMenuCollapsed);
    const dispatch = useAppDispatch();
    const { messages } = useIntl();

    return (
        <StyledHeaderMiniSidebar className="app-header-mini-sidebar">
            {React.createElement(isMenuCollapsed ? AiOutlineMenuUnfold : AiOutlineMenuFold, {
                className: "trigger",
                onClick: () => dispatch(toggleMenuCollapse()),
            })}
            <AppLogo />

            <StyledHeaderSearchMinibar placeholder={messages["common.searchHere"] as string} />
            <StyledHeaderMiniSecDesktop>
                <AppLanguageSwitcher />
                <AppHeaderMessages />
                <AppNotifications />
            </StyledHeaderMiniSecDesktop>
            <StyledHeaderMiniSecMobile>
                <StyledDropdownWrapper>
                    <Dropdown
                        getPopupContainer={triggerNode => triggerNode}
                        menu={{ items }}
                        overlayClassName="dropdown-wrapper"
                        trigger={["click"]}
                    >
                        <a className="ant-dropdown-link-mobile" onClick={e => e.preventDefault()}>
                            <FiMoreVertical />
                        </a>
                    </Dropdown>
                </StyledDropdownWrapper>
            </StyledHeaderMiniSecMobile>
        </StyledHeaderMiniSidebar>
    );
};

export default AppHeader;
