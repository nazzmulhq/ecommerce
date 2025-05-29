import { TTypographyLink } from "@components/common/AppForm/components/type";
import { Typography } from "antd";
import { FC } from "react";

const TypographyLink: FC<TTypographyLink> = props => {
    const { children, ...rest } = props;
    return <Typography.Link {...rest}>{children}</Typography.Link>;
};

export default TypographyLink;
