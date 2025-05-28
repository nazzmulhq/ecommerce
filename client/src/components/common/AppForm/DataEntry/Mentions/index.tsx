import { MentionProps, Mentions as Mentionss } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../types";

export interface IMentions {
    ctype: typeof DataEntryFieldTypes.MENTION;
    props: MentionProps;
}

const Mentions: FC<IMentions> = ({ props }) => {
    return <Mentionss {...props} />;
};

export default Mentions;
