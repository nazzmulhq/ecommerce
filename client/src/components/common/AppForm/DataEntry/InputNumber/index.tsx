import { InputNumberProps, InputNumber as InputNumbers } from 'antd';
import React, { FC } from 'react';
import { INPUT_NUMBER } from '../../Types';

export interface IInputNumber {
    ctype: typeof INPUT_NUMBER;
    props: InputNumberProps;
}

const InputNumber: FC<IInputNumber> = ({ props }) => {
    return <InputNumbers {...props} />;
};

export default InputNumber;
