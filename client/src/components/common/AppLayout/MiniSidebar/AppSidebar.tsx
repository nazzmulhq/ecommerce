import React from 'react';
import collapseMotion from 'antd/lib/_util/motion';
import UserInfo from '../components/UserInfo';
import clsx from 'clsx';
import AppVerticalMenu from '../components/AppVerticalNav';
import { useSidebarContext } from '@crema/context/AppContextProvider/SidebarContextProvider';
import {
  StyledAppSidebarMiniScrollbar,
  StyledMiniSidebar,
} from './index.styled';
import { RouterConfigData } from '@crema/types/models/Apps';

type AppSidebarProps = {
  routesConfig: RouterConfigData[];
};

const AppSidebar = ({ routesConfig }: AppSidebarProps) => {
  const { allowSidebarBgImage } = useSidebarContext();

  return (
    <StyledMiniSidebar
      breakpoint='lg'
      className={clsx({
        'mini-sidebar-img-background': allowSidebarBgImage,
      })}
      collapsed={collapseMotion}
    >
      <UserInfo hasColor />
      <StyledAppSidebarMiniScrollbar scrollToTop={false}>
        <AppVerticalMenu routesConfig={routesConfig} />
      </StyledAppSidebarMiniScrollbar>
    </StyledMiniSidebar>
  );
};

export default AppSidebar;
