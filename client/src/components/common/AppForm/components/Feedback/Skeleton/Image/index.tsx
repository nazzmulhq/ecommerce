import { TSkeletonImage } from "@components/common/AppForm/components/type";
import { Skeleton } from "antd";
import { FC } from "react";

const SkeletonImage: FC<TSkeletonImage> = props => {
    return <Skeleton.Image {...props} />;
};

export default SkeletonImage;
