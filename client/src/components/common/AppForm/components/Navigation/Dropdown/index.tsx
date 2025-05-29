import { TDropdown } from "@components/common/AppForm/components/type";
import { Dropdown as AntDropdown } from "antd";
import { FC } from "react";

const Dropdown: FC<TDropdown> = props => {
    return <AntDropdown {...props} />;
};

export default Dropdown;
