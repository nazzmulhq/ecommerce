import { DatePicker } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import React, { FC } from 'react';
import { DATE_PICKER_RANGE } from '../../../Types';

export interface IRangePicker {
    ctype: typeof DATE_PICKER_RANGE;
    props: RangePickerProps;
}

const RangeDatePicker: FC<IRangePicker> = ({ props }) => {
    return <DatePicker.RangePicker {...props} />;
};

export default RangeDatePicker;
