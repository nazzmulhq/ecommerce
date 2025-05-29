import { TSkeleton } from "@components/common/AppForm/components/type";
import { Skeleton as Skeletons } from "antd";
import { FC } from "react";

const Skeleton: FC<TSkeleton> = props => {
    return <Skeletons {...props} />;
};

export default Skeleton;
