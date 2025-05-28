import { TreeSelectProps, TreeSelect as TreeSelects } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../types";

export interface ITreeSelect {
    ctype: typeof DataEntryFieldTypes.TREE_SELECT;
    props: TreeSelectProps;
}

const TreeSelect: FC<ITreeSelect> = ({ props }) => {
    return <TreeSelects {...props} />;
};

export default TreeSelect;
