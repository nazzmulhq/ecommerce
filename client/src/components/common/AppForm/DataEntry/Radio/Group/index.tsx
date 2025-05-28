import { Radio, RadioGroupProps } from 'antd';
import React, { FC } from 'react';
import { RADIO_GROUP } from '../../../Types';

export interface IRadioGroup {
    ctype: typeof RADIO_GROUP;
    props: RadioGroupProps;
}

const RadioGroup: FC<IRadioGroup> = ({ props }) => {
    return <Radio.Group {...props} />;
};

export default RadioGroup;
