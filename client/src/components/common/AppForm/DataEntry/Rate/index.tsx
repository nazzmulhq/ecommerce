import { RateProps, Rate as Rates } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../types";

export interface IRate {
    ctype: typeof DataEntryFieldTypes.RATE;
    props: RateProps;
}

const Rate: FC<IRate> = ({ props }) => {
    return <Rates {...props} />;
};

export default Rate;
