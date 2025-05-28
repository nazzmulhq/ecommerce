import { DatePicker } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import { FC } from "react";
import { DataEntryFieldTypes } from "../../types";

export interface IRangePicker {
    ctype: typeof DataEntryFieldTypes.DATE_PICKER_RANGE;
    props: RangePickerProps;
}

const RangeDatePicker: FC<IRangePicker> = ({ props }) => {
    return <DatePicker.RangePicker {...props} />;
};

export default RangeDatePicker;
