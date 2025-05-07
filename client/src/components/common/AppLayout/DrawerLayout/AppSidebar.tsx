import React, { useEffect } from 'react';
import UserInfo from '../components/UserInfo';
import clsx from 'clsx';
import AppVerticalMenu from '../components/AppVerticalNav';
import { usePathname } from 'next/navigation';
import { LayoutDirection } from '@crema/constants/AppEnums';
import { useSidebarContext } from '@crema/context/AppContextProvider/SidebarContextProvider';
import { useLayoutContext } from '@crema/context/AppContextProvider/LayoutContextProvider';
import {
  StyledAppDrawer,
  StyledAppDrawerLayoutSidebar,
  StyledAppDrawerSidebarScrollbar,
} from './index.styled';
import { RouterConfigData } from '@crema/types/models/Apps';

type AppSidebarProps = {
  visible: boolean;
  onClose: () => void;
  routesConfig: RouterConfigData[];
};

const AppSidebar = ({ visible, onClose, routesConfig }: AppSidebarProps) => {
  const { allowSidebarBgImage } = useSidebarContext();
  const { direction } = useLayoutContext();
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname]);

  return (
    <StyledAppDrawer
      placement={direction === LayoutDirection.LTR ? 'left' : 'right'}
      closable={false}
      onClose={onClose}
      open={visible}
    >
      <StyledAppDrawerLayoutSidebar
        className={clsx({
          'drawerLayout-sidebar-img-background': allowSidebarBgImage,
        })}
        collapsible
      >
        <UserInfo hasColor />
        <StyledAppDrawerSidebarScrollbar scrollToTop={false}>
          <AppVerticalMenu routesConfig={routesConfig} />
        </StyledAppDrawerSidebarScrollbar>
      </StyledAppDrawerLayoutSidebar>
    </StyledAppDrawer>
  );
};

export default AppSidebar;
