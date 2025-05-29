import { TFormList } from "@components/common/AppForm/components/type";
import { Form } from "antd";
import { FC } from "react";

const FormList: FC<TFormList> = props => {
    return <Form.List {...props} />;
};

export default FormList;
