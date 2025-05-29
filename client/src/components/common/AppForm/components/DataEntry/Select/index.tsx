import { TSelect } from "@components/common/AppForm/components/type";
import { Select as Selects } from "antd";
import { FC } from "react";

const Select: FC<TSelect> = props => {
    return <Selects {...props} />;
};

export default Select;
