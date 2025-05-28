import { Form, FormItemProps } from "antd";
import { FC } from "react";
import FieldRender from "../../FieldReader";
import { DataEntryFieldTypes, TDataEntryField } from "../../types";

interface IChildren extends Omit<FormItemProps, "children"> {
    children: TDataEntryField[];
}

export interface IFormItem {
    ctype: typeof DataEntryFieldTypes.FORM_ITEM;
    props: IChildren;
}

const FormItem: FC<IFormItem> = ({ props }) => {
    const { children, ...rest } = props;
    return (
        <Form.Item {...rest}>
            {children.map((child, index) => (
                <FieldRender key={index} field={child} />
            ))}
        </Form.Item>
    );
};

export default FormItem;
