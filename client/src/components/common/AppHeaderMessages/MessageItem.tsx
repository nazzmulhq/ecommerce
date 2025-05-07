import React from "react";

import { StyledMsgAvatar, StyledMsgListItem, StyledMsgListItemContent } from "./MessageItem.styled";

type MessageItemProps = {
    item: { image: string; name: string; message: string };
};

const MessageItem: React.FC<MessageItemProps> = ({ item }) => {
    return (
        <StyledMsgListItem className="item-hover">
            <StyledMsgAvatar src={item.image} />
            <StyledMsgListItemContent>
                <h3>{item.name}</h3>
                <p>{item.message}</p>
            </StyledMsgListItemContent>
        </StyledMsgListItem>
    );
};

export default MessageItem;
