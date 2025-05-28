import { Form } from "antd";
import { FormListProps } from "antd/es/form";
import { FC } from "react";
import { DataEntryFieldTypes } from "../../types";

export interface IFormList {
    ctype: typeof DataEntryFieldTypes.FORM_LIST;
    props: FormListProps;
}

const FormList: FC<IFormList> = ({ props }) => {
    return <Form.List {...props} />;
};

export default FormList;
