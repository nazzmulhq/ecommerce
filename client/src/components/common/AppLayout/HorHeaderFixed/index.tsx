import React, { useEffect, useState } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import AppContentView from '../../AppContentView';
import AppThemeSetting from '../../AppThemeSetting';
import AppFooter from '../components/AppFooter';
import clsx from 'clsx';
import { FooterType, LayoutType } from '@crema/constants/AppEnums';
import { useLayoutContext } from '@crema/context/AppContextProvider/LayoutContextProvider';
import {
  StyledAppLayoutHeaderFixedMain,
  StyledAppLayoutHorFixed,
  StyledContainer,
} from './index.styled';
import { RouterConfigData } from '@crema/types/models/Apps';

type Props = {
  children: React.ReactNode;
  routesConfig: RouterConfigData[];
};
const HorHeaderFixed: React.FC<Props> = ({ children, routesConfig }) => {
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
      document.body.classList.add('framedHorHeaderFixedLayout');
    } else {
      document.body.classList.remove('framedHorHeaderFixedLayout');
    }
  }, [layoutType]);

  return (
    <StyledAppLayoutHorFixed
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
      <StyledAppLayoutHeaderFixedMain>
        <StyledContainer>
          <AppContentView>{children}</AppContentView>
          <AppFooter />
        </StyledContainer>
      </StyledAppLayoutHeaderFixedMain>
      <AppThemeSetting />
    </StyledAppLayoutHorFixed>
  );
};

export default HorHeaderFixed;
