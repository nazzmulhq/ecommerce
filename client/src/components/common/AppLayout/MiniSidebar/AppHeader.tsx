import { Dropdown } from "antd";
import { FiMoreVertical } from "react-icons/fi";
import { useIntl } from "react-intl";

import AppHeaderMessages from "@components/common/AppHeaderMessages";
import AppLanguageSwitcher from "@components/common/AppLanguageSwitcher";
import AppNotifications from "@components/common/AppNotifications";
import AppLogo from "../components/AppLogo";
import { StyledDropdownWrapper } from "../index.styled";
import {
    StyledAppHeaderMini,
    StyledAppHeaderMiniSecDesktop,
    StyledAppHeaderMiniSecMobile,
    StyledHeaderSearchMini,
} from "./index.styled";

const items = [
    { key: 1, label: <AppHeaderMessages /> },
    { key: 2, label: <AppNotifications /> },
    { key: 3, label: <AppLanguageSwitcher /> },
];

const AppHeader = () => {
    const { messages } = useIntl();

    return (
        <StyledAppHeaderMini className="app-header-mini">
            <AppLogo />

            <StyledHeaderSearchMini placeholder={messages["common.searchHere"] as string} />
            <StyledAppHeaderMiniSecDesktop>
                <AppLanguageSwitcher />
                <AppHeaderMessages />
                <AppNotifications />
            </StyledAppHeaderMiniSecDesktop>
            <StyledAppHeaderMiniSecMobile>
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
            </StyledAppHeaderMiniSecMobile>
        </StyledAppHeaderMini>
    );
};

export default AppHeader;
