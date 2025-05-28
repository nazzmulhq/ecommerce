import { InputProps, Input as Inputs } from 'antd';
import React, { FC } from 'react';
import { INPUT } from '../../Types';

export interface IInput {
    ctype: typeof INPUT;
    props: InputProps;
}

const Input: FC<IInput> = ({ props }) => {
    return <Inputs {...props} />;
};

export default Input;
