import { SelectProps, Select as Selects } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../types";

export interface ISelect {
    ctype: typeof DataEntryFieldTypes.SELECT;
    props: SelectProps;
}

const Select: FC<ISelect> = ({ props }) => {
    return <Selects {...props} />;
};

export default Select;
