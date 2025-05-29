import { TInputTextArea } from "@components/common/AppForm/components/type";
import { Input } from "antd";
import { FC } from "react";

const InputTextArea: FC<TInputTextArea> = props => {
    return <Input.TextArea {...props} />;
};

export default InputTextArea;
