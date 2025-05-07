import { Dropdown } from "antd";

import { notification } from "@lib/fakedb";
import IntlMessages from "@lib/utils/IntlMessages";
import { IoIosNotificationsOutline } from "react-icons/io";
import {
    StyledDrowdownWrapper,
    StyledNotifyButtonAll,
    StyledNotifyIcon,
    StyledNotifyLink,
    StyledNotifyList,
    StyledNotifyScrollSubmenu,
    StyledNotifyText,
} from "./index.styled";
import NotificationItem from "./NotificationItem";

const items = [
    {
        key: 1,
        label: (
            <span className="header">
                <IntlMessages id="common.notifications" />({notification.length})
            </span>
        ),
    },
    {
        key: 2,
        label: (
            <StyledNotifyScrollSubmenu>
                <StyledNotifyList
                    dataSource={notification}
                    renderItem={(item: any) => {
                        return <NotificationItem item={item} key={item.id} />;
                    }}
                />
            </StyledNotifyScrollSubmenu>
        ),
    },
    {
        key: 3,
        label: (
            <StyledNotifyButtonAll type="primary">
                <IntlMessages id="common.viewAll" />
            </StyledNotifyButtonAll>
        ),
    },
];
const AppNotifications = () => {
    return (
        <StyledDrowdownWrapper>
            <Dropdown
                className="dropdown"
                getPopupContainer={triggerNode => triggerNode}
                menu={{ items }}
                overlayClassName="header-notify-messages"
                trigger={["click"]}
            >
                <StyledNotifyLink onClick={e => e.preventDefault()}>
                    <StyledNotifyIcon>
                        <IoIosNotificationsOutline />
                    </StyledNotifyIcon>
                    <StyledNotifyText>
                        <IntlMessages id="common.notifications" />
                    </StyledNotifyText>
                </StyledNotifyLink>
            </Dropdown>
        </StyledDrowdownWrapper>
    );
};

export default AppNotifications;
