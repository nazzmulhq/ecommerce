import { TimePickerProps, TimePicker as TimePickers } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../types";

export interface ITimePicker {
    ctype: typeof DataEntryFieldTypes.TIME_PICKER;
    props: TimePickerProps;
}

const TimePicker: FC<ITimePicker> = ({ props }) => {
    return <TimePickers {...props} />;
};

export default TimePicker;
