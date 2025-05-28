import { SwitchProps, Switch as Switchs } from 'antd';
import React, { FC } from 'react';
import { SWITCH } from '../../Types';

export interface ISwitch {
    ctype: typeof SWITCH;
    props: SwitchProps;
}

const Switch: FC<ISwitch> = ({ props }) => {
    return <Switchs {...props} />;
};

export default Switch;
