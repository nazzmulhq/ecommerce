import { TFloatButtonGroup } from "@components/common/AppForm/components/type";
import { FloatButton } from "antd";
import { FC } from "react";
import { renderComponent } from "../../../Render";

const FloatButtonGroup: FC<TFloatButtonGroup> = props => {
    const { children, ...rest } = props;
    return <FloatButton.Group {...rest}>{renderComponent(children)}</FloatButton.Group>;
};

export default FloatButtonGroup;
