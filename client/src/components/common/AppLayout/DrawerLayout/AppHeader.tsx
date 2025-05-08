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
    StyledDrawerLayoutHeader,
    StyledDrawerLayoutHeaderDesk,
    StyledDrawerLayoutHeaderMobile,
    StyledDrawerLayoutHeaderSearch,
} from "./index.styled";

const items = [
    { key: 1, label: <AppHeaderMessages /> },
    { key: 2, label: <AppNotifications /> },
    { key: 3, label: <AppLanguageSwitcher /> },
];

type AppHeaderProps = {
    showDrawer: () => void;
};

const AppHeader = ({ showDrawer }: AppHeaderProps) => {
    const { messages } = useIntl();

    return (
        <StyledDrawerLayoutHeader>
            <a className="trigger" onClick={showDrawer}>
                <AiOutlineMenu />
            </a>
            <AppLogo />
            <StyledDrawerLayoutHeaderSearch placeholder={messages["common.searchHere"] as string} />
            <StyledDrawerLayoutHeaderDesk>
                <AppLanguageSwitcher />
                <AppHeaderMessages />
                <AppNotifications />
            </StyledDrawerLayoutHeaderDesk>
            <StyledDrawerLayoutHeaderMobile>
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
            </StyledDrawerLayoutHeaderMobile>
        </StyledDrawerLayoutHeader>
    );
};

export default AppHeader;
