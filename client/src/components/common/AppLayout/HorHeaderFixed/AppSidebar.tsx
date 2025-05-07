import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import UserInfo from '../components/UserInfo';
import clsx from 'clsx';
import AppVerticalMenu from '../components/AppVerticalNav';
import { LayoutDirection } from '@crema/constants/AppEnums';
import { useSidebarContext } from '@crema/context/AppContextProvider/SidebarContextProvider';
import { useLayoutContext } from '@crema/context/AppContextProvider/LayoutContextProvider';
import {
  StyledAppHeaderDrawerFixed,
  StyledAppHorHeaderFixedSidebar,
  StyledAppHorScrollbar,
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
    <StyledAppHeaderDrawerFixed
      placement={direction === LayoutDirection.LTR ? 'left' : 'right'}
      closable={false}
      onClose={onClose}
      open={visible}
    >
      <StyledAppHorHeaderFixedSidebar
        className={clsx({
          'hor-header-fixed-sidebar-img-background': allowSidebarBgImage,
        })}
        collapsible
      >
        <UserInfo />
        <StyledAppHorScrollbar scrollToTop={false}>
          <AppVerticalMenu routesConfig={routesConfig} />
        </StyledAppHorScrollbar>
      </StyledAppHorHeaderFixedSidebar>
    </StyledAppHeaderDrawerFixed>
  );
};

export default AppSidebar;
