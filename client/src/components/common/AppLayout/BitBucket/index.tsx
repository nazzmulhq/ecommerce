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
  StyledAppBitbucketLayout,
  StyledAppBitbucketLayoutMain,
  StyledBitbucketMainScrollbar,
} from './index.styled';
import { RouterConfigData } from '@crema/types/models/Apps';

type Props = {
  children: React.ReactNode;
  routesConfig: RouterConfigData[];
};

const BitBucket: React.FC<Props> = ({ children, routesConfig }) => {
  const [isVisible, setVisible] = useState(false);
  const { footer, footerType } = useLayoutContext();

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <StyledAppBitbucketLayout
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
      <StyledAppBitbucketLayoutMain>
        <AppHeader showDrawer={showDrawer} />
        <StyledBitbucketMainScrollbar>
          <AppContentView>{children}</AppContentView>
          <AppFooter />
        </StyledBitbucketMainScrollbar>
      </StyledAppBitbucketLayoutMain>
      <AppThemeSetting />
    </StyledAppBitbucketLayout>
  );
};

export default React.memo(BitBucket);
