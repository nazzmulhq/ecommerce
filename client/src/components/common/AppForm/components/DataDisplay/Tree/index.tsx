import { TTree } from "@components/common/AppForm/components/type";
import { Tree as Trees } from "antd";
import { FC } from "react";

const Tree: FC<TTree> = props => {
    return <Trees {...props} />;
};

export default Tree;
