import { TSkeletonInput } from "@components/common/AppForm/components/type";
import { Skeleton } from "antd";
import { FC } from "react";

const SkeletonInput: FC<TSkeletonInput> = props => {
    return <Skeleton.Input {...props} />;
};

export default SkeletonInput;
