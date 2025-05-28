import { Input } from 'antd';
import { OTPProps } from 'antd/es/input/OTP';
import React, { FC } from 'react';
import { INPUT_OTP } from '../../../Types';

export interface IInputOTP {
    ctype: typeof INPUT_OTP;
    props: OTPProps;
}

const InputOTP: FC<IInputOTP> = ({ props }) => {
    return <Input.OTP {...props} />;
};

export default InputOTP;
