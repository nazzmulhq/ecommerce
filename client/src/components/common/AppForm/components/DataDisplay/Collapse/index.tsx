import { TCollapse } from "@components/common/AppForm/components/type";
import { Collapse as Collapses } from "antd";
import { FC } from "react";

const Collapse: FC<TCollapse> = props => {
    return <Collapses {...props} />;
};

export default Collapse;
