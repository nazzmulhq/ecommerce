import { AutoCompleteProps, AutoComplete as AutoCompletes } from 'antd';
import React, { FC } from 'react';
import { AUTO_COMPLETE } from '../../Types';
import { GetProps } from 'react-redux';

type TAutoComplete = GetProps<typeof AutoCompletes>;

export interface IAutoComplete {
    ctype: typeof AUTO_COMPLETE;
    props: AutoCompleteProps;
}

const AutoComplete: FC<IAutoComplete> = ({ props }) => {
    return <AutoCompletes {...props} />;
};

export default AutoComplete;
