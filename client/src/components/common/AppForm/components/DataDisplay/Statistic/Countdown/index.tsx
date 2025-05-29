import { TStatisticCountdown } from "@components/common/AppForm/components/type";
import { Statistic as Statistics } from "antd";
import { FC } from "react";

const Countdown: FC<TStatisticCountdown> = props => {
    return <Statistics.Countdown {...props} />;
};

export default Countdown;
