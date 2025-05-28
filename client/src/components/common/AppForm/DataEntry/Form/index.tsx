import { FormProps, Form as Forms } from "antd";
import { FC } from "react";

import FieldRender from "../FieldReader";
import { DataEntryFieldTypes, TDataEntryField } from "../types";

interface IChildren extends Omit<FormProps, "children"> {
    children: TDataEntryField[];
}

export interface IForm {
    ctype: typeof DataEntryFieldTypes.FORM;
    props: IChildren;
}

const Form: FC<IForm> = ({ props }) => {
    const { children, ...rest } = props;
    return (
        <Forms {...rest}>
            {children.map((child, index) => (
                <FieldRender key={index} field={child} />
            ))}
        </Forms>
    );
};

export default Form;
