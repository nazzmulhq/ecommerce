import { TInputOTP } from "@components/common/AppForm/components/type";
import { Input } from "antd";
import { FC } from "react";

const InputOTP: FC<TInputOTP> = props => {
    return <Input.OTP {...props} />;
};

export default InputOTP;
