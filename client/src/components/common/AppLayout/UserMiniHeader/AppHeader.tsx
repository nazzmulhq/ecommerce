import { Dropdown } from "antd";
import { FiMoreVertical } from "react-icons/fi";
import { useIntl } from "react-intl";
import AppHeaderMessages from "../../AppHeaderMessages";
import AppLanguageSwitcher from "../../AppLanguageSwitcher";
import AppNotifications from "../../AppNotifications";
import AppLogo from "../components/AppLogo";
import UserInfo from "../components/UserInfo";
import { StyledDropdownWrapper } from "../index.styled";
import {
    StyledAppUserMinibar,
    StyledUserMiniHeaderSearch,
    StyledUserMiniSectionDesktop,
    StyledUserMiniSectionMobile,
} from "./index.styled";

const items = [
    { key: 1, label: <AppHeaderMessages /> },
    { key: 2, label: <AppNotifications /> },
    { key: 3, label: <AppLanguageSwitcher /> },
];

const AppHeader = () => {
    const { messages } = useIntl();

    return (
        <StyledAppUserMinibar className="app-userMiniHeader">
            <AppLogo />

            <StyledUserMiniHeaderSearch placeholder={messages["common.searchHere"] as string} />
            <StyledUserMiniSectionDesktop>
                <AppLanguageSwitcher />
                <AppHeaderMessages />
                <AppNotifications />
            </StyledUserMiniSectionDesktop>
            <UserInfo />
            <StyledUserMiniSectionMobile>
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
            </StyledUserMiniSectionMobile>
        </StyledAppUserMinibar>
    );
};

export default AppHeader;
