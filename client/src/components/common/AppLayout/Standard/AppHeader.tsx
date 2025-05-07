import React from 'react';
import { Dropdown } from 'antd';
import AppLogo from '../components/AppLogo';
import { useIntl } from 'react-intl';
import AppLanguageSwitcher from '../../AppLanguageSwitcher';
import AppHeaderMessages from '../../AppHeaderMessages';
import AppNotifications from '../../AppNotifications';
import { FiMoreVertical } from 'react-icons/fi';
import { AiOutlineMenu } from 'react-icons/ai';
import {
  StyledAppStandardHeader,
  StyledStandardHeaderSecDesktop,
  StyledStandardHeaderSecMobile,
  StyledStandardSearch,
} from './index.styled';
import { StyledDropdownWrapper } from '../index.styled';

const items = [
  { key: 1, label: <AppHeaderMessages /> },
  { key: 2, label: <AppNotifications /> },
  { key: 3, label: <AppLanguageSwitcher /> },
];

type AppHeaderProps = {
  onToggleSidebar: (isCollapsed: boolean) => void;
  isCollapsed: boolean;
};

const AppHeader = ({ isCollapsed, onToggleSidebar }: AppHeaderProps) => {
  const { messages } = useIntl();

  return (
    <StyledAppStandardHeader>
      <a className="trigger" onClick={() => onToggleSidebar(!isCollapsed)}>
        <AiOutlineMenu />
      </a>
      <AppLogo />
      <StyledStandardSearch
        placeholder={messages['common.searchHere'] as string}
      />
      <StyledStandardHeaderSecDesktop>
        <AppLanguageSwitcher />
        <AppHeaderMessages />
        <AppNotifications />
      </StyledStandardHeaderSecDesktop>
      <StyledStandardHeaderSecMobile>
        <StyledDropdownWrapper>
          <Dropdown
            menu={{ items }}
            overlayClassName="dropdown-wrapper"
            getPopupContainer={(triggerNode) => triggerNode}
            trigger={['click']}
          >
            <a
              className="ant-dropdown-link-mobile"
              onClick={(e) => e.preventDefault()}
            >
              <FiMoreVertical />
            </a>
          </Dropdown>
        </StyledDropdownWrapper>
      </StyledStandardHeaderSecMobile>
    </StyledAppStandardHeader>
  );
};

export default AppHeader;
