import { Input } from "antd";
import { PasswordProps } from "antd/es/input";
import { FC } from "react";
import { DataEntryFieldTypes } from "../../types";
export interface IInputPassword {
    ctype: typeof DataEntryFieldTypes.INPUT_PASSWORD;
    props: PasswordProps;
}

const InputPassword: FC<IInputPassword> = ({ props }) => {
    return <Input.Password {...props} />;
};

export default InputPassword;
