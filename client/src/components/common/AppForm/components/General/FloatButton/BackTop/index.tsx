import { TFloatButtonBackTop } from "@components/common/AppForm/components/type";
import { FloatButton } from "antd";
import { FC } from "react";

const FloatButtonBackTop: FC<TFloatButtonBackTop> = props => {
    const { children, ...rest } = props;
    return <FloatButton.BackTop {...rest}>{children}</FloatButton.BackTop>;
};

export default FloatButtonBackTop;
