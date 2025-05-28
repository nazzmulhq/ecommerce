import { Checkbox } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { FC } from "react";
import { DataEntryFieldTypes } from "../../types";

export interface ICheckboxGroup {
    ctype: typeof DataEntryFieldTypes.CHECKBOX_GROUP;
    props: CheckboxGroupProps;
}

const CheckboxGroup: FC<ICheckboxGroup> = ({ props }) => {
    return <Checkbox.Group {...props} />;
};

export default CheckboxGroup;
