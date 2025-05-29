import { TTreeSelect } from "@components/common/AppForm/components/type";
import { TreeSelect as TreeSelects } from "antd";
import { FC } from "react";

const TreeSelect: FC<TTreeSelect> = props => {
    return <TreeSelects {...props} />;
};

export default TreeSelect;
