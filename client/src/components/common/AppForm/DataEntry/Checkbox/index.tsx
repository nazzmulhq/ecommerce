import { CheckboxProps, Checkbox as Checkboxs } from 'antd';
import React, { FC } from 'react';
import { CHECKBOX } from '../../Types';

export interface ICheckbox {
    ctype: typeof CHECKBOX;
    props: CheckboxProps;
}

const Checkbox: FC<ICheckbox> = ({ props }) => {
    return <Checkboxs {...props} />;
};

export default Checkbox;
