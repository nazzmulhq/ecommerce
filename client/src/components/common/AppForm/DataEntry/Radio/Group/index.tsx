import { Radio, RadioGroupProps } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../../types";

export interface IRadioGroup {
    ctype: typeof DataEntryFieldTypes.RADIO_GROUP;
    props: RadioGroupProps;
}

const RadioGroup: FC<IRadioGroup> = ({ props }) => {
    return <Radio.Group {...props} />;
};

export default RadioGroup;
