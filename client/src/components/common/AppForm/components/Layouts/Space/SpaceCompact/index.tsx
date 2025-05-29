import { TSpaceCompact } from "@components/common/AppForm/components/type";
import { Space as Spaces } from "antd";
import { FC } from "react";
import { renderComponent } from "../../../Render";

const SpaceCompact: FC<TSpaceCompact> = props => {
    const { children, ...rest } = props;
    return <Spaces.Compact {...rest}>{renderComponent(children)}</Spaces.Compact>;
};

export default SpaceCompact;
