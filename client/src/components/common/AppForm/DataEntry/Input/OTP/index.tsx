import { Input } from "antd";
import { OTPProps } from "antd/es/input/OTP";
import { FC } from "react";
import { DataEntryFieldTypes } from "../../types";

export interface IInputOTP {
    ctype: typeof DataEntryFieldTypes.INPUT_OTP;
    props: OTPProps;
}

const InputOTP: FC<IInputOTP> = ({ props }) => {
    return <Input.OTP {...props} />;
};

export default InputOTP;
