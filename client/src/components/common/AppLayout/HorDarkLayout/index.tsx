import React, { useEffect, useState } from 'react';
import AppHeader from './AppHeader';
import AppContentView from '../../AppContentView';
import AppThemeSetting from '../../AppThemeSetting';
import AppFooter from '../components/AppFooter';
import clsx from 'clsx';
import { FooterType, LayoutType } from '@crema/constants/AppEnums';
import AppSidebar from './AppSidebar';
import { useLayoutContext } from '@crema/context/AppContextProvider/LayoutContextProvider';
import {
  StyledAppLayoutHorDark,
  StyledAppLayoutHorDarkMain,
  StyledContainer,
} from './index.styled';
import { RouterConfigData } from '@crema/types/models/Apps';

type Props = {
  children: React.ReactNode;
  routesConfig: RouterConfigData[];
};

const HorDarkLayout: React.FC<Props> = ({ children, routesConfig }) => {
  const [isVisible, setVisible] = useState(false);
  const { footer, footerType, layoutType } = useLayoutContext();

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (layoutType === LayoutType.FRAMED) {
      document.body.classList.add('framedHorDarkLayout');
    } else {
      document.body.classList.remove('framedHorDarkLayout');
    }
  }, [layoutType]);

  return (
    <StyledAppLayoutHorDark
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
      <AppHeader showDrawer={showDrawer} routesConfig={routesConfig} />
      <StyledAppLayoutHorDarkMain>
        <StyledContainer>
          <AppContentView>{children}</AppContentView>
          <AppFooter />
        </StyledContainer>
      </StyledAppLayoutHorDarkMain>
      <AppThemeSetting />
    </StyledAppLayoutHorDark>
  );
};

export default HorDarkLayout;
