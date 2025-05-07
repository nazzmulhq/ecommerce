import React from "react";

import { List } from "antd";
import { StyledNotifyListItem, StyledNotifyMsgAvatar } from "./NotificationItem.styled";

type NotificationItemProps = {
    item: {
        image: string;
        name: string;
        message: string;
    };
};

const NotificationItem: React.FC<NotificationItemProps> = ({ item }) => {
    return (
        <StyledNotifyListItem className="item-hover">
            <List.Item.Meta
                avatar={<StyledNotifyMsgAvatar alt={item.name} src={item.image} />}
                description={item.message}
                title={item.name}
            />
        </StyledNotifyListItem>
    );
};

export default NotificationItem;
