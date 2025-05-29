import { TInputGroup } from "@components/common/AppForm/components/type";
import { Input } from "antd";
import { FC } from "react";

const InputGroup: FC<TInputGroup> = props => {
    return <Input.Group {...props} />;
};

export default InputGroup;
