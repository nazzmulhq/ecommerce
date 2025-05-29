import { TTypographyText } from "@components/common/AppForm/components/type";
import { Typography } from "antd";
import { FC } from "react";

const TypographyText: FC<TTypographyText> = props => {
    const { children, ...rest } = props;
    return <Typography.Text {...rest}>{children}</Typography.Text>;
};

export default TypographyText;
