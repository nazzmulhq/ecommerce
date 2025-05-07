import React from 'react';
import AppLogo from '../components/AppLogo';
import { useIntl } from 'react-intl';
import { AiOutlineMenu } from 'react-icons/ai';
import {
  StyledAppBitbucketHeader,
  StyledBitbucketSearch,
  StyledTrigger,
} from './index.styled';

type AppHeaderProps = {
  showDrawer: () => void;
};
const AppHeader = ({ showDrawer }: AppHeaderProps) => {
  const { messages } = useIntl();

  return (
    <StyledAppBitbucketHeader>
      <StyledTrigger onClick={showDrawer}>
        <AiOutlineMenu />
      </StyledTrigger>
      <AppLogo />
      <StyledBitbucketSearch
        placeholder={messages['common.searchHere'] as string}
      />
    </StyledAppBitbucketHeader>
  );
};

export default AppHeader;
