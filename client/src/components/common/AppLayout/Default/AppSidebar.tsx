import React from "react";
import UserInfo from "../components/UserInfo";
import clsx from "clsx";
import AppVerticalMenu from "../components/AppVerticalNav";
import {
  StyledAppMainSidebar,
  StyledAppSidebarScrollbar,
} from "./index.styled";
import { useSidebarContext } from "@crema/context/AppContextProvider/SidebarContextProvider";
import { RouterConfigData } from "@crema/types/models/Apps";

type AppSidebarProps = {
  routesConfig: RouterConfigData[];
  isCollapsed: boolean;
};

const AppSidebar: React.FC<AppSidebarProps> = ({
  isCollapsed,
  routesConfig,
}) => {
  const { allowSidebarBgImage } = useSidebarContext();

  return (
    <StyledAppMainSidebar
      className={clsx({
        "sidebar-img-background": allowSidebarBgImage,
      })}
      collapsible
      breakpoint="xl"
      collapsed={isCollapsed}
    >
      <UserInfo hasColor />
      <StyledAppSidebarScrollbar scrollToTop={false}>
        <AppVerticalMenu routesConfig={routesConfig} />
      </StyledAppSidebarScrollbar>
    </StyledAppMainSidebar>
  );
};

export default AppSidebar;
