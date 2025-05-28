import { RadioProps, Radio as Radios } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../types";

export interface IRadio {
    ctype: typeof DataEntryFieldTypes.RADIO;
    props: RadioProps;
}

const Radio: FC<IRadio> = ({ props }) => {
    return <Radios {...props} />;
};

export default Radio;
