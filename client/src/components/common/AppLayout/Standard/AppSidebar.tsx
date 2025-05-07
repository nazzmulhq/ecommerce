import React from "react";
import UserInfo from "../components/UserInfo";
import clsx from "clsx";
import AppVerticalMenu from "../components/AppVerticalNav";
import { useSidebarContext } from "@crema/context/AppContextProvider/SidebarContextProvider";
import {
  StyledAppStandardScrollbar,
  StyledStandardSidebar,
} from "./index.styled";
import { RouterConfigData } from "@crema/types/models/Apps";

type AppSidebarProps = {
  isCollapsed: boolean;
  routesConfig: RouterConfigData[];
};
const AppSidebar = ({ isCollapsed, routesConfig }: AppSidebarProps) => {
  const { allowSidebarBgImage } = useSidebarContext();

  return (
    <StyledStandardSidebar
      className={clsx({
        "standard-sidebar-img-background": allowSidebarBgImage,
      })}
      collapsible
      breakpoint="xl"
      collapsed={isCollapsed}
    >
      <UserInfo hasColor />
      <StyledAppStandardScrollbar scrollToTop={false}>
        <AppVerticalMenu routesConfig={routesConfig} />
      </StyledAppStandardScrollbar>
    </StyledStandardSidebar>
  );
};

export default AppSidebar;
