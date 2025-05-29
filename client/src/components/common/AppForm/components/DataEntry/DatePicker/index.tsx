import { TDatePicker } from "@components/common/AppForm/components/type";
import { DatePicker as DatePickers } from "antd";
import { FC } from "react";

const DatePicker: FC<TDatePicker> = props => {
    return <DatePickers {...props} />;
};

export default DatePicker;
