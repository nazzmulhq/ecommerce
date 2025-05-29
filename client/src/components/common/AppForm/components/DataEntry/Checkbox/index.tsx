import { TCheckbox } from "@components/common/AppForm/components/type";
import { Checkbox as Checkboxs } from "antd";
import { FC } from "react";

const Checkbox: FC<TCheckbox> = props => {
    return <Checkboxs {...props} />;
};

export default Checkbox;
