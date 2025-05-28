import { CheckboxProps, Checkbox as Checkboxs } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../types";

export interface ICheckbox {
    ctype: typeof DataEntryFieldTypes.CHECKBOX;
    props: CheckboxProps;
}

const Checkbox: FC<ICheckbox> = ({ props }) => {
    return <Checkboxs {...props} />;
};

export default Checkbox;
