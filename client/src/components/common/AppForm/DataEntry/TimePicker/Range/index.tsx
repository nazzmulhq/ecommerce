import { TimePicker, TimeRangePickerProps } from 'antd';
import React, { FC } from 'react';
import { TIME_PICKER_RANGE } from '../../../Types';

export interface ITimeRangePicker {
    ctype: typeof TIME_PICKER_RANGE;
    props: TimeRangePickerProps;
}

const TimeRangePicker: FC<ITimeRangePicker> = ({ props }) => {
    return <TimePicker.RangePicker {...props} />;
};

export default TimeRangePicker;
