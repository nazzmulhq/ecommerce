import { TInputNumber } from "@components/common/AppForm/components/type";
import { InputNumber as InputNumbers } from "antd";
import { FC } from "react";

const InputNumber: FC<TInputNumber> = props => {
    return <InputNumbers {...props} />;
};

export default InputNumber;
