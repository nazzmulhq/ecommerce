import { TFormItem } from "@components/common/AppForm/components/type";
import { Form } from "antd";
import { FC } from "react";
import { renderComponent } from "../../../Render";

const FormItem: FC<TFormItem> = props => {
    const { children, ...rest } = props;
    return <Form.Item {...rest}>{renderComponent(children)}</Form.Item>;
};

export default FormItem;
