import { TSkeletonButton } from "@components/common/AppForm/components/type";
import { Skeleton } from "antd";
import { FC } from "react";

const SkeletonButton: FC<TSkeletonButton> = props => {
    return <Skeleton.Button {...props} />;
};

export default SkeletonButton;
