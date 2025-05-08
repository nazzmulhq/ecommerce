import { Dropdown } from "antd";
import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { useIntl } from "react-intl";

import AppHeaderMessages from "@components/common/AppHeaderMessages";
import AppLanguageSwitcher from "@components/common/AppLanguageSwitcher";
import AppNotifications from "@components/common/AppNotifications";
import AppLogo from "../components/AppLogo";
import { StyledDropdownWrapper } from "../index.styled";
import {
    StyledAppHeader,
    StyledAppHeaderSectionDesk,
    StyledAppHeaderSectionMobile,
    StyledHeaderSearch,
} from "./index.styled";

const items = [
    { key: 1, label: <AppHeaderMessages /> },
    { key: 2, label: <AppNotifications /> },
    { key: 3, label: <AppLanguageSwitcher /> },
];

type Props = {
    onToggleSidebar: (isCollapsed: boolean) => void;
    isCollapsed: boolean;
};
const AppHeader: React.FC<Props> = ({ isCollapsed, onToggleSidebar }) => {
    const { messages } = useIntl();

    return (
        <StyledAppHeader>
            <a className="trigger" onClick={() => onToggleSidebar(!isCollapsed)}>
                <AiOutlineMenu />
            </a>
            <AppLogo />
            <StyledHeaderSearch placeholder={messages["common.searchHere"] as string} />
            <StyledAppHeaderSectionDesk>
                <AppLanguageSwitcher />
                <AppHeaderMessages />
                <AppNotifications />
            </StyledAppHeaderSectionDesk>
            <StyledAppHeaderSectionMobile>
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
            </StyledAppHeaderSectionMobile>
        </StyledAppHeader>
    );
};

export default AppHeader;
