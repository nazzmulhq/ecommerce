import { TTypographyParagraph } from "@components/common/AppForm/components/type";
import { Typography } from "antd";
import { FC } from "react";

const TypographyParagraph: FC<TTypographyParagraph> = props => {
    const { children, ...rest } = props;
    return <Typography.Paragraph {...rest}>{children}</Typography.Paragraph>;
};

export default TypographyParagraph;
