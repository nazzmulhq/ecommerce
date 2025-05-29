import { TStatistic } from "@components/common/AppForm/components/type";
import { Statistic as Statistics } from "antd";
import { FC } from "react";

const Statistic: FC<TStatistic> = props => {
    return <Statistics {...props} />;
};

export default Statistic;
