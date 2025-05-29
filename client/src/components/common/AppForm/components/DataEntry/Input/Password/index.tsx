import { TInputPassword } from "@components/common/AppForm/components/type";
import { Input } from "antd";
import { FC } from "react";

const InputPassword: FC<TInputPassword> = props => {
    return <Input.Password {...props} />;
};

export default InputPassword;
