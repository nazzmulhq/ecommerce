import React, { useState } from "react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import AppContentView from "../../AppContentView";
import AppThemeSetting from "../../AppThemeSetting";
import AppFooter from "../components/AppFooter";
import clsx from "clsx";
import { FooterType } from "@crema/constants/AppEnums";
import { useLayoutContext } from "@crema/context/AppContextProvider/LayoutContextProvider";
import {
  StyledAppLayoutMiniSidebar,
  StyledAppLayoutMiniSidebarMain,
  StyledMainMiniScrollbar,
} from "./index.styled";
import { RouterConfigData } from "@crema/types/models/Apps";

type Props = {
  children: React.ReactNode;
  routesConfig: RouterConfigData[];
};
const MiniSidebarToggle: React.FC<Props> = ({ children, routesConfig }) => {
  const [isCollapsed, setCollapsed] = useState(false);
  const { footer, footerType } = useLayoutContext();

  const onToggleSidebar = () => {
    setCollapsed(!isCollapsed);
  };
  return (
    <StyledAppLayoutMiniSidebar
      className={clsx({
        appMainFooter: footer && footerType === FooterType.FLUID,
        appMainFixedFooter: footer && footerType === FooterType.FIXED,
      })}
    >
      <AppSidebar isCollapsed={isCollapsed} routesConfig={routesConfig} />
      <StyledAppLayoutMiniSidebarMain className="app-layout-mini-sidebar-main">
        <AppHeader
          isCollapsed={isCollapsed}
          onToggleSidebar={onToggleSidebar}
        />
        <StyledMainMiniScrollbar>
          <AppContentView>{children}</AppContentView>
          <AppFooter />
        </StyledMainMiniScrollbar>
      </StyledAppLayoutMiniSidebarMain>
      <AppThemeSetting />
    </StyledAppLayoutMiniSidebar>
  );
};

export default MiniSidebarToggle;
