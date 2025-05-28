import { RadioProps, Radio as Radios } from 'antd';
import React, { FC } from 'react';
import { RADIO } from '../../Types';

export interface IRadio {
    ctype: typeof RADIO;
    props: RadioProps;
}

const Radio: FC<IRadio> = ({ props }) => {
    return <Radios {...props} />;
};

export default Radio;
