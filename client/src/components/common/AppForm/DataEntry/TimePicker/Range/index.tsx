import { TimePicker, TimeRangePickerProps } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../../types";

export interface ITimeRangePicker {
    ctype: typeof DataEntryFieldTypes.TIME_PICKER_RANGE;
    props: TimeRangePickerProps;
}

const TimeRangePicker: FC<ITimeRangePicker> = ({ props }) => {
    return <TimePicker.RangePicker {...props} />;
};

export default TimeRangePicker;
