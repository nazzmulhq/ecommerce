import { TSpace } from "@components/common/AppForm/components/type";
import { Space as Spaces } from "antd";
import { FC } from "react";
import { renderComponent } from "../../Render";

const Space: FC<TSpace> = props => {
    const { children, ...rest } = props;
    return <Spaces {...rest}>{renderComponent(children)}</Spaces>;
};

export default Space;
