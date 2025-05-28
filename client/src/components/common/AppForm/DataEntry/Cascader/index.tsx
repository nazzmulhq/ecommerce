import { CascaderProps, Cascader as Cascaders } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../types";

export interface ICascader {
    ctype: typeof DataEntryFieldTypes.CASCADER;
    props: CascaderProps;
}

const Cascader: FC<ICascader> = ({ props }) => {
    const { multiple, ...rest } = props;
    return <Cascaders {...rest} />;
};

export default Cascader;
