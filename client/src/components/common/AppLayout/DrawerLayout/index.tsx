import React, { useState } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import AppContentView from '../../AppContentView';
import AppThemeSetting from '../../AppThemeSetting';
import AppFooter from '../components/AppFooter';
import clsx from 'clsx';
import { FooterType } from '@crema/constants/AppEnums';
import { useLayoutContext } from '@crema/context/AppContextProvider/LayoutContextProvider';
import {
  StyledAppDrawerLayout,
  StyledAppDrawerLayoutMain,
  StyledDrawerScrollbar,
} from './index.styled';
import { RouterConfigData } from '@crema/types/models/Apps';

type Props = {
  children: React.ReactNode;
  routesConfig: RouterConfigData[];
};

const DrawerLayout: React.FC<Props> = ({ children, routesConfig }) => {
  const [isVisible, setVisible] = useState(false);

  const { footer, footerType } = useLayoutContext();

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <StyledAppDrawerLayout
      className={clsx({
        appMainFooter: footer && footerType === FooterType.FLUID,
        appMainFixedFooter: footer && footerType === FooterType.FIXED,
      })}
    >
      <AppSidebar
        visible={isVisible}
        onClose={onClose}
        routesConfig={routesConfig}
      />
      <StyledAppDrawerLayoutMain className='app-DrawerLayout-main'>
        <AppHeader showDrawer={showDrawer} />
        <StyledDrawerScrollbar>
          <AppContentView>{children}</AppContentView>
          <AppFooter />
        </StyledDrawerScrollbar>
      </StyledAppDrawerLayoutMain>
      <AppThemeSetting />
    </StyledAppDrawerLayout>
  );
};

export default React.memo(DrawerLayout);
