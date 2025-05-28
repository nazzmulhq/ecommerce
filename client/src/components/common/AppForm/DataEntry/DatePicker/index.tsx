import { DatePickerProps, DatePicker as DatePickers } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../types";

export interface IDatePicker {
    ctype: typeof DataEntryFieldTypes.DATE_PICKER;
    props: DatePickerProps;
}

const DatePicker: FC<IDatePicker> = ({ props }) => {
    return <DatePickers {...props} />;
};

export default DatePicker;
