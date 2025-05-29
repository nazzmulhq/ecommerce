import { TAnchor } from "@components/common/AppForm/components/type";
import { Anchor as Anchors } from "antd";
import { FC } from "react";

const Anchor: FC<TAnchor> = props => {
    return <Anchors {...props} />;
};

export default Anchor;
