import { InputProps, Input as Inputs } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../types";

export interface IInput {
    ctype: typeof DataEntryFieldTypes.INPUT;
    props: InputProps;
}

const Input: FC<IInput> = ({ props }) => {
    return <Inputs {...props} />;
};

export default Input;
