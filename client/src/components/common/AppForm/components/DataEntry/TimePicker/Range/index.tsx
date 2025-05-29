import { TTimePickerRange } from "@components/common/AppForm/components/type";
import { TimePicker } from "antd";
import { FC } from "react";

const TimeRangePicker: FC<TTimePickerRange> = props => {
    return <TimePicker.RangePicker {...props} />;
};

export default TimeRangePicker;
