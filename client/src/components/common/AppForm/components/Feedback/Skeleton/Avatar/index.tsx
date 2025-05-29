import { TSkeletonAvatar } from "@components/common/AppForm/components/type";
import { Skeleton } from "antd";
import { FC } from "react";

const { Avatar } = Skeleton;

const SkeletonAvatar: FC<TSkeletonAvatar> = props => {
    return <Avatar {...props} />;
};

export default SkeletonAvatar;
