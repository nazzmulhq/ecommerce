import { Input } from 'antd';
import { GroupProps } from 'antd/es/input';
import React, { FC } from 'react';
import { INPUT_GROUP } from '../../../Types';

export interface IInputGroup {
    ctype: typeof INPUT_GROUP;
    props: GroupProps;
}

const InputGroup: FC<IInputGroup> = ({ props }) => {
    return <Input.Group {...props} />;
};

export default InputGroup;
