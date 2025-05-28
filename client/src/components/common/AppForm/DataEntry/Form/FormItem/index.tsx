import { Form, FormItemProps } from 'antd';
import React, { FC } from 'react';
import { renderComponent } from '../../../Render';
import { FORM_ITEM, TQuickUIProps } from '../../../Types';

interface IChildren extends Omit<FormItemProps, 'children'> {
    children: TQuickUIProps[];
}

export interface IFormItem {
    ctype: typeof FORM_ITEM;
    props: IChildren;
}

const FormItem: FC<IFormItem> = ({ props }) => {
    const { children, ...rest } = props;
    return <Form.Item {...rest}>{renderComponent(children)}</Form.Item>;
};

export default FormItem;
