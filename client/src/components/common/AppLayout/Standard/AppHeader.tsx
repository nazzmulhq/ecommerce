import { Dropdown } from "antd";
import { AiOutlineMenu } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { useIntl } from "react-intl";

import AppHeaderMessages from "@components/common/AppHeaderMessages";
import AppLanguageSwitcher from "@components/common/AppLanguageSwitcher";
import AppNotifications from "@components/common/AppNotifications";
import AppLogo from "../components/AppLogo";
import { StyledDropdownWrapper } from "../index.styled";
import {
    StyledAppStandardHeader,
    StyledStandardHeaderSecDesktop,
    StyledStandardHeaderSecMobile,
    StyledStandardSearch,
} from "./index.styled";

const items = [
    { key: 1, label: <AppHeaderMessages /> },
    { key: 2, label: <AppNotifications /> },
    { key: 3, label: <AppLanguageSwitcher /> },
];

type AppHeaderProps = {
    onToggleSidebar: (isCollapsed: boolean) => void;
    isCollapsed: boolean;
};

const AppHeader = ({ isCollapsed, onToggleSidebar }: AppHeaderProps) => {
    const { messages } = useIntl();

    return (
        <StyledAppStandardHeader>
            <a className="trigger" onClick={() => onToggleSidebar(!isCollapsed)}>
                <AiOutlineMenu />
            </a>
            <AppLogo />
            <StyledStandardSearch placeholder={messages["common.searchHere"] as string} />
            <StyledStandardHeaderSecDesktop>
                <AppLanguageSwitcher />
                <AppHeaderMessages />
                <AppNotifications />
            </StyledStandardHeaderSecDesktop>
            <StyledStandardHeaderSecMobile>
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
            </StyledStandardHeaderSecMobile>
        </StyledAppStandardHeader>
    );
};

export default AppHeader;
