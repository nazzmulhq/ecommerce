import { Dropdown } from "antd";
import { AiOutlineMenu } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { useIntl } from "react-intl";

import AppHeaderMessages from "@components/common/AppHeaderMessages";
import AppLanguageSwitcher from "@components/common/AppLanguageSwitcher";
import AppNotifications from "@components/common/AppNotifications";
import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import AppLogo from "../components/AppLogo";
import UserInfo from "../components/UserInfo";
import { StyledDropdownWrapper } from "../index.styled";
import {
    StyledAppHeaderHorFixed,
    StyledAppHeaderHorFixedMain,
    StyledAppHeaderHorMainFlex,
    StyledAppHorizontalNav,
    StyledContainer,
    StyledHeaderHorFixedSecDesktop,
    StyledHeaderHorFixedSecMobile,
    StyledHeaderSearchHorFixed,
} from "./index.styled";

const items = [
    { key: 1, label: <AppHeaderMessages /> },
    { key: 2, label: <AppNotifications /> },
    { key: 3, label: <AppLanguageSwitcher /> },
];

type AppHeaderProps = {
    showDrawer: () => void;
    routesConfig?: RouterConfigData[];
};

const AppHeader = ({ showDrawer, routesConfig }: AppHeaderProps) => {
    const { messages } = useIntl();
    const { sidebarColorSet } = useSidebarContext();

    return (
        <StyledAppHeaderHorFixed
            style={{
                backgroundColor: sidebarColorSet.sidebarBgColor,
                color: sidebarColorSet.sidebarTextColor,
            }}
        >
            <StyledAppHeaderHorFixedMain>
                <StyledContainer className="container">
                    <StyledAppHeaderHorMainFlex>
                        <a className="trigger" onClick={showDrawer}>
                            <AiOutlineMenu />
                        </a>
                        <AppLogo hasSidebarColor />
                        <StyledAppHorizontalNav routesConfig={routesConfig} />
                        <StyledHeaderSearchHorFixed placeholder={messages["common.searchHere"] as string} />

                        <StyledHeaderHorFixedSecDesktop>
                            <AppLanguageSwitcher />
                            <AppHeaderMessages />
                            <AppNotifications />
                        </StyledHeaderHorFixedSecDesktop>
                        <UserInfo />
                        <StyledHeaderHorFixedSecMobile>
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
                        </StyledHeaderHorFixedSecMobile>
                    </StyledAppHeaderHorMainFlex>
                </StyledContainer>
            </StyledAppHeaderHorFixedMain>
        </StyledAppHeaderHorFixed>
    );
};

export default AppHeader;
