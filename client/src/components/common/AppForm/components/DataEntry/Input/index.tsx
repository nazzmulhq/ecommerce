import { TInput } from "@components/common/AppForm/components/type";
import { Input as Inputs } from "antd";
import { FC } from "react";

const Input: FC<TInput> = props => {
    return <Inputs {...props} />;
};

export default Input;
