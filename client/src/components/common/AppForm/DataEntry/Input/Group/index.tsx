import { Input } from "antd";
import { GroupProps } from "antd/es/input";
import { FC } from "react";
import { DataEntryFieldTypes } from "../../types";

export interface IInputGroup {
    ctype: typeof DataEntryFieldTypes.INPUT_GROUP;
    props: GroupProps;
}

const InputGroup: FC<IInputGroup> = ({ props }) => {
    return <Input.Group {...props} />;
};

export default InputGroup;
