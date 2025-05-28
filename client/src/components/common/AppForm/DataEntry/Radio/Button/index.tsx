import { Radio } from 'antd';
import { RadioButtonProps } from 'antd/es/radio/radioButton';
import React, { FC } from 'react';
import { RADIO_BUTTON } from '../../../Types';

export interface IRadioButton {
    ctype: typeof RADIO_BUTTON;
    props: RadioButtonProps;
}

const RadioButton: FC<IRadioButton> = ({ props }) => {
    return <Radio.Button {...props} />;
};

export default RadioButton;
