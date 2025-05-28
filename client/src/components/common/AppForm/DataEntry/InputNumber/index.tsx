import { InputNumberProps, InputNumber as InputNumbers } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../types";

export interface IInputNumber {
    ctype: typeof DataEntryFieldTypes.INPUT_NUMBER;
    props: InputNumberProps;
}

const InputNumber: FC<IInputNumber> = ({ props }) => {
    return <InputNumbers {...props} />;
};

export default InputNumber;
