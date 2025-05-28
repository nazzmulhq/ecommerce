import { MentionProps, Mentions as Mentionss } from 'antd';
import React, { FC } from 'react';
import { MENTION } from '../../Types';

export interface IMentions {
    ctype: typeof MENTION;
    props: MentionProps;
}

const Mentions: FC<IMentions> = ({ props }) => {
    return <Mentionss {...props} />;
};

export default Mentions;
