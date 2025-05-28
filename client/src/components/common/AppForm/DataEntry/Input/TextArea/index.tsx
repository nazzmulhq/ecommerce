import { Input } from "antd";
import { TextAreaProps } from "antd/es/input";
import { FC } from "react";
import { DataEntryFieldTypes } from "../../types";

export interface IInputTextArea {
    ctype: typeof DataEntryFieldTypes.INPUT_TEXT_AREA;
    props: TextAreaProps;
}

const InputTextArea: FC<IInputTextArea> = ({ props }) => {
    return <Input.TextArea {...props} />;
};

export default InputTextArea;
