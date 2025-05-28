import { Input } from "antd";
import { SearchProps } from "antd/es/input";
import { FC } from "react";
import { DataEntryFieldTypes } from "../../types";
export interface IInputSearch {
    ctype: typeof DataEntryFieldTypes.INPUT_SEARCH;
    props: SearchProps;
}

const InputSearch: FC<IInputSearch> = ({ props }) => {
    return <Input.Search {...props} />;
};

export default InputSearch;
