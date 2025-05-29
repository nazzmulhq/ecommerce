import { TSegmented } from "@components/common/AppForm/components/type";
import { Segmented as Segmenteds } from "antd";
import { FC } from "react";

const Segmented: FC<TSegmented> = props => {
    return <Segmenteds {...props} />;
};

export default Segmented;
