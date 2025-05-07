import React from "react";
import { Dropdown } from "antd";
import { FiMoreVertical } from "react-icons/fi";
import AppLogo from "../components/AppLogo";
import { useIntl } from "react-intl";
import AppLanguageSwitcher from "../../AppLanguageSwitcher";
import AppHeaderMessages from "../../AppHeaderMessages";
import AppNotifications from "../../AppNotifications";
import NotificationBar from "./NotificationBar";
import { AiOutlineMenu } from "react-icons/ai";
import UserInfo from "../components/UserInfo";
import { useSidebarContext } from "@crema/context/AppContextProvider/SidebarContextProvider";
import {
  StyledAppHeaderHor,
  StyledAppHeaderHorDesktop,
  StyledAppHorizontalNav,
  StyledContainer,
  StyledHeaderHorMain,
  StyledHeaderHorMainFlex,
  StyledHeaderHorMobile,
  StyledHeaderNavHor,
  StyledHeaderSearchHor,
} from "./index.styled";
import { StyledDropdownWrapper } from "../index.styled";
import { RouterConfigData } from "@crema/types/models/Apps";

const items = [
  { key: 1, label: <AppHeaderMessages /> },
  { key: 2, label: <AppNotifications /> },
  { key: 3, label: <AppLanguageSwitcher /> },
];

type AppHeaderProps = {
  showDrawer: () => void;
  routesConfig: RouterConfigData[];
};

const AppHeader = ({ showDrawer, routesConfig }: AppHeaderProps) => {
  const { messages } = useIntl();
  const { sidebarColorSet } = useSidebarContext();

  return (
    <StyledAppHeaderHor>
      <NotificationBar />

      <StyledHeaderHorMain>
        <StyledContainer>
          <StyledHeaderHorMainFlex>
            <a className="trigger" onClick={showDrawer}>
              <AiOutlineMenu />
            </a>
            <AppLogo />
            <StyledHeaderSearchHor
              placeholder={messages["common.searchHere"] as string}
            />

            <StyledAppHeaderHorDesktop>
              <AppLanguageSwitcher />
              <AppHeaderMessages />
              <AppNotifications />
            </StyledAppHeaderHorDesktop>
            <UserInfo />
            <StyledHeaderHorMobile>
              <StyledDropdownWrapper>
                <Dropdown
                  menu={{ items }}
                  overlayClassName="dropdown-wrapper"
                  getPopupContainer={(triggerNode) => triggerNode}
                  trigger={["click"]}
                >
                  <a
                    className="ant-dropdown-link-mobile"
                    onClick={(e) => e.preventDefault()}
                  >
                    <FiMoreVertical />
                  </a>
                </Dropdown>
              </StyledDropdownWrapper>
            </StyledHeaderHorMobile>
          </StyledHeaderHorMainFlex>
        </StyledContainer>
      </StyledHeaderHorMain>

      <StyledHeaderNavHor
        style={{
          backgroundColor: sidebarColorSet.sidebarBgColor,
          color: sidebarColorSet.sidebarTextColor,
        }}
      >
        <StyledContainer>
          <StyledAppHorizontalNav routesConfig={routesConfig} />
        </StyledContainer>
      </StyledHeaderNavHor>
    </StyledAppHeaderHor>
  );
};

export default AppHeader;
