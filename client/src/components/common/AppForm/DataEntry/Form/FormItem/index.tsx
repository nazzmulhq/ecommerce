import { Form, FormItemProps } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../../types";

interface IChildren extends Omit<FormItemProps, "children"> {
    children: TQuickUIProps[];
}

export interface IFormItem {
    ctype: typeof DataEntryFieldTypes.FORM_ITEM;
    props: IChildren;
}

const FormItem: FC<IFormItem> = ({ props }) => {
    const { children, ...rest } = props;
    return <Form.Item {...rest}>{renderComponent(children)}</Form.Item>;
};

export default FormItem;
