import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { usePathname } from 'next/navigation';
import UserInfo from '../components/UserInfo';
import clsx from 'clsx';
import AppVerticalMenu from '../components/AppVerticalNav';
import { LayoutDirection } from '@crema/constants/AppEnums';
import { useSidebarContext } from '@crema/context/AppContextProvider/SidebarContextProvider';
import { useLayoutContext } from '@crema/context/AppContextProvider/LayoutContextProvider';
import {
  StyledAppHorDrawer,
  StyledAppSidebarHorScrollbar,
  StyledHorMainSidebar,
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
    <StyledAppHorDrawer
      placement={direction === LayoutDirection.LTR ? 'left' : 'right'}
      closable={false}
      onClose={onClose}
      open={visible}
    >
      <StyledHorMainSidebar
        className={clsx({
          'hor-sidebar-img-background': allowSidebarBgImage,
        })}
        collapsible
      >
        <UserInfo />
        <StyledAppSidebarHorScrollbar scrollToTop={false}>
          <AppVerticalMenu routesConfig={routesConfig} />
        </StyledAppSidebarHorScrollbar>
      </StyledHorMainSidebar>
    </StyledAppHorDrawer>
  );
};

export default AppSidebar;

AppSidebar.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};
