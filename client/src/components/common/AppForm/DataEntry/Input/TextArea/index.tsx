import { Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import React, { FC } from 'react';
import { INPUT_TEXT_AREA } from '../../../Types';

export interface IInputTextArea {
    ctype: typeof INPUT_TEXT_AREA;
    props: TextAreaProps;
}

const InputTextArea: FC<IInputTextArea> = ({ props }) => {
    return <Input.TextArea {...props} />;
};

export default InputTextArea;
