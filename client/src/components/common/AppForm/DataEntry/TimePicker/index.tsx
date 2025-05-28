import { TimePickerProps, TimePicker as TimePickers } from 'antd';
import React, { FC } from 'react';
import { TIME_PICKER } from '../../Types';

export interface ITimePicker {
    ctype: typeof TIME_PICKER;
    props: TimePickerProps;
}

const TimePicker: FC<ITimePicker> = ({props}) => {
    return <TimePickers {...props} />;
};

export default TimePicker;
