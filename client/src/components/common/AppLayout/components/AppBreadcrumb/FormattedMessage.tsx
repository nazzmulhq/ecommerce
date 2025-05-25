"use client";
import { FC } from "react";
import MemoizedFormattedMessage from "react-intl/src/components/message";

export interface IFormattedMessage {
    message_id: string;
}

const FormattedMessage: FC<IFormattedMessage> = ({ message_id }) => {
    return (
        <MemoizedFormattedMessage
            data-testid={`${message_id.toLowerCase()}-nav`}
            id={message_id}
            defaultMessage={message_id as string}
            values={{ name: message_id }}
            tagName="span"
        />
    );
};

export default FormattedMessage;
