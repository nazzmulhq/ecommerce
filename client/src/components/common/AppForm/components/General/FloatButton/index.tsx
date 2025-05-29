import { TFloatButton } from "@components/common/AppForm/components/type";
import { FloatButton as FloatButtons } from "antd";
import { FC } from "react";

const FloatButton: FC<TFloatButton> = props => {
    return <FloatButtons {...props} />;
};

export default FloatButton;
