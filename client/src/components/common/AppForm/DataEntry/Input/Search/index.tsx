import { Input } from 'antd';
import { SearchProps } from 'antd/es/input';
import React, { FC } from 'react';
import { INPUT_SEARCH } from '../../../Types';
export interface IInputSearch {
    ctype: typeof INPUT_SEARCH;
    props: SearchProps;
}

const InputSearch: FC<IInputSearch> = ({ props }) => {
    return <Input.Search {...props} />;
};

export default InputSearch;
