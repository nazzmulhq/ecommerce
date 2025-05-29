import { TInputSearch } from "@components/common/AppForm/components/type";
import { Input } from "antd";
import { FC } from "react";

const InputSearch: FC<TInputSearch> = props => {
    return <Input.Search {...props} />;
};

export default InputSearch;
