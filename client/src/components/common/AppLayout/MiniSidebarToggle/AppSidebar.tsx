import React from "react";
import UserInfo from "../components/UserInfo";
import clsx from "clsx";
import AppVerticalMenu from "../components/AppVerticalNav";
import { useSidebarContext } from "@crema/context/AppContextProvider/SidebarContextProvider";
import {
  StyledMiniSidebarScrollbar,
  StyledMiniSidebarToggle,
} from "./index.styled";
import { RouterConfigData } from "@crema/types/models/Apps";

type AppSidebarProps = {
  isCollapsed: boolean;
  routesConfig: RouterConfigData[];
};

const AppSidebar = ({ isCollapsed, routesConfig }: AppSidebarProps) => {
  const { allowSidebarBgImage } = useSidebarContext();

  return (
    <StyledMiniSidebarToggle
      className={clsx({
        "mini-sidebar-toggle-img-background": allowSidebarBgImage,
      })}
      collapsible
      breakpoint="xl"
      collapsedWidth="0"
      collapsed={isCollapsed}
    >
      <UserInfo hasColor />
      <StyledMiniSidebarScrollbar scrollToTop={false}>
        <AppVerticalMenu routesConfig={routesConfig} />
      </StyledMiniSidebarScrollbar>
    </StyledMiniSidebarToggle>
  );
};

export default AppSidebar;
