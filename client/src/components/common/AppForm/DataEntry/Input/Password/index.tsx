import { Input } from 'antd';
import { PasswordProps } from 'antd/es/input';
import React, { FC } from 'react';
import { INPUT_PASSWORD } from '../../../Types';
export interface IInputPassword {
    ctype: typeof INPUT_PASSWORD;
    props: PasswordProps;
}

const InputPassword: FC<IInputPassword> = ({ props }) => {
    return <Input.Password {...props} />;
};

export default InputPassword;
