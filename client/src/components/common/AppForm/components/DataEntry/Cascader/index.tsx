import { TCascader } from "@components/common/AppForm/components/type";
import { Cascader as Cascaders } from "antd";
import { FC } from "react";

const Cascader: FC<TCascader> = props => {
    return <Cascaders {...props} />;
};

export default Cascader;
