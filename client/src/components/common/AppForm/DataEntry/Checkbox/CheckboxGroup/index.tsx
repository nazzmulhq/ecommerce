import { Checkbox } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import React, { FC } from 'react';
import { CHECKBOX_GROUP } from '../../../Types';

export interface ICheckboxGroup {
    ctype: typeof CHECKBOX_GROUP;
    props: CheckboxGroupProps;
}

const CheckboxGroup: FC<ICheckboxGroup> = ({ props }) => {
    return <Checkbox.Group {...props} />;
};

export default CheckboxGroup;
