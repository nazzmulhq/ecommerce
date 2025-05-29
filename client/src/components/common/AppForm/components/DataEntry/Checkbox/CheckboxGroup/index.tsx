import { TCheckboxGroup } from "@components/common/AppForm/components/type";
import { Checkbox } from "antd";
import { FC } from "react";

const CheckboxGroup: FC<TCheckboxGroup> = props => {
    return <Checkbox.Group {...props} />;
};

export default CheckboxGroup;
