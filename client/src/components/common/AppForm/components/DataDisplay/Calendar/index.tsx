import { TCalendar } from "@components/common/AppForm/components/type";
import { Calendar as Calendars } from "antd";
import { FC } from "react";

const Calendar: FC<TCalendar> = props => {
    return <Calendars {...props} />;
};

export default Calendar;
