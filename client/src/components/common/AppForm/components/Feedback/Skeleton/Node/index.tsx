import { TSkeletonNode } from "@components/common/AppForm/components/type";
import { Skeleton } from "antd";
import { FC } from "react";
import { renderComponent } from "../../../Render";

const SkeletonNode: FC<TSkeletonNode> = props => {
    const { children, ...rest } = props;
    if (children) {
        return <Skeleton.Node {...rest}>{renderComponent(children)}</Skeleton.Node>;
    }
    return <Skeleton.Node {...rest} />;
};

export default SkeletonNode;
