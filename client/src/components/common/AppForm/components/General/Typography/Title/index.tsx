import { TTypographyTitle } from "@components/common/AppForm/components/type";
import { Typography } from "antd";
import { FC } from "react";

const TypographyTitle: FC<TTypographyTitle> = props => {
    const { children, ...rest } = props;
    return <Typography.Title {...rest}>{children}</Typography.Title>;
};

export default TypographyTitle;
