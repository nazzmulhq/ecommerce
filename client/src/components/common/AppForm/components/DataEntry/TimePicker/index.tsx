import { TTimePicker } from "@components/common/AppForm/components/type";
import { TimePicker as TimePickers } from "antd";
import { FC } from "react";

const TimePicker: FC<TTimePicker> = props => {
    return <TimePickers {...props} />;
};

export default TimePicker;
