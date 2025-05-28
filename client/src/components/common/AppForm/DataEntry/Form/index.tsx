import { FormProps, Form as Forms } from 'antd';
import React, { FC } from 'react';
import { renderComponent } from '../../Render';
import { FORM, TQuickUIProps } from '../../Types';

interface IChildren extends Omit<FormProps, 'children'> {
    children: TQuickUIProps[];
}

export interface IForm {
    ctype: typeof FORM;
    props: IChildren;
}

const Form: FC<IForm> = ({ props }) => {
    const { children, ...rest } = props;
    return <Forms {...rest}>{renderComponent(children)}</Forms>;
};

export default Form;
