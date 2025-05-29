import { TSkeletonTitle } from "@components/common/AppForm/components/type";
import { Skeleton } from "antd";
import { FC } from "react";

const SkeletonTitle: FC<TSkeletonTitle> = props => {
    return <Skeleton.Title {...props} />;
};

export default SkeletonTitle;
