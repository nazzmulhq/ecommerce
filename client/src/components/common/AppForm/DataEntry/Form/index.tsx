import { FormProps, Form as Forms } from "antd";
import { FC } from "react";

import { DataEntryFieldTypes } from "../types";

interface IChildren extends Omit<FormProps, "children"> {
    children: TQuickUIProps[];
}

export interface IForm {
    ctype: typeof DataEntryFieldTypes.FORM;
    props: IChildren;
}

const Form: FC<IForm> = ({ props }) => {
    const { children, ...rest } = props;
    return <Forms {...rest}>{renderComponent(children)}</Forms>;
};

export default Form;
