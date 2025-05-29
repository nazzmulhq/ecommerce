import { TRate } from "@components/common/AppForm/components/type";
import { Rate as Rates } from "antd";
import { FC } from "react";

const Rate: FC<TRate> = props => {
    return <Rates {...props} />;
};

export default Rate;
