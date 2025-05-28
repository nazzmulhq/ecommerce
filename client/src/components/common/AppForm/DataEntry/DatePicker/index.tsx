import { DatePickerProps, DatePicker as DatePickers } from 'antd';
import React, { FC } from 'react';
import { DATE_PICKER } from '../../Types';

export interface IDatePicker {
    ctype: typeof DATE_PICKER;
    props: DatePickerProps;
}

const DatePicker: FC<IDatePicker> = ({ props }) => {
    return <DatePickers {...props} />;
};

export default DatePicker;
