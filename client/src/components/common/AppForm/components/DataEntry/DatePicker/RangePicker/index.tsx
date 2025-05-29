import { TDatePickerRange } from "@components/common/AppForm/components/type";
import { DatePicker } from "antd";
import { FC } from "react";

const RangeDatePicker: FC<TDatePickerRange> = props => {
    return <DatePicker.RangePicker {...props} />;
};

export default RangeDatePicker;
