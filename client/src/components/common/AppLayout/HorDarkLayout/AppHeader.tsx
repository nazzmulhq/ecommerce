import { Dropdown } from "antd";
import { AiOutlineMenu } from "react-icons/ai";
import { FiMoreVertical } from "react-icons/fi";
import { useIntl } from "react-intl";

import AppHeaderMessages from "@components/common/AppHeaderMessages";
import AppLanguageSwitcher from "@components/common/AppLanguageSwitcher";
import AppNotifications from "@components/common/AppNotifications";
import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import AppLogo from "../components/AppLogo";
import UserInfo from "../components/UserInfo";
import { StyledDropdownWrapper } from "../index.styled";
import {
    StyledAppHeaderHorDark,
    StyledAppMainHorDarkMainMenu,
    StyledContainer,
    StyledHeaderHorDarkMain,
    StyledHeaderHorDarkSecDesktop,
    StyledHeaderHorDarkSecMobile,
    StyledHeaderNavHorDark,
    StyledHeaderSearchHorDark,
    StyledHorDarkMainFlex,
} from "./index.styled";
import NotificationBar from "./NotificationBar";

const items = [
    { key: 1, label: <AppHeaderMessages /> },
    { key: 2, label: <AppNotifications /> },
    { key: 3, label: <AppLanguageSwitcher /> },
];

type AppHeaderProps = {
    showDrawer: () => void;
    routesConfig?: any;
};

const AppHeader = ({ showDrawer, routesConfig }: AppHeaderProps) => {
    const { messages } = useIntl();
    const { sidebarColorSet } = useSidebarContext();

    return (
        <StyledAppHeaderHorDark
            style={{
                backgroundColor: sidebarColorSet.sidebarBgColor,
                color: sidebarColorSet.sidebarTextColor,
            }}
        >
            <NotificationBar />

            <StyledHeaderHorDarkMain
                style={{
                    backgroundColor: sidebarColorSet.sidebarBgColor,
                    color: sidebarColorSet.sidebarTextColor,
                }}
            >
                <StyledContainer>
                    <StyledHorDarkMainFlex>
                        <a className="trigger" onClick={showDrawer}>
                            <AiOutlineMenu />
                        </a>
                        <AppLogo hasSidebarColor />
                        <StyledHeaderSearchHorDark placeholder={messages["common.searchHere"] as string} />

                        <StyledHeaderHorDarkSecDesktop>
                            <AppLanguageSwitcher />
                            <AppHeaderMessages />
                            <AppNotifications />
                        </StyledHeaderHorDarkSecDesktop>
                        <UserInfo />
                        <StyledHeaderHorDarkSecMobile>
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
                        </StyledHeaderHorDarkSecMobile>
                    </StyledHorDarkMainFlex>
                </StyledContainer>
            </StyledHeaderHorDarkMain>

            <StyledHeaderNavHorDark
                style={{
                    backgroundColor: sidebarColorSet.sidebarBgColor,
                    color: sidebarColorSet.sidebarTextColor,
                }}
            >
                <StyledContainer>
                    <StyledAppMainHorDarkMainMenu routesConfig={routesConfig} />
                </StyledContainer>
            </StyledHeaderNavHorDark>
        </StyledAppHeaderHorDark>
    );
};

export default AppHeader;
