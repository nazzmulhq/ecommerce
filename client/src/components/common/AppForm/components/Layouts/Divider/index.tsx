import { TDivider } from "@components/common/AppForm/components/type";
import { Divider as Dividers } from "antd";
import { FC } from "react";

const Divider: FC<TDivider> = props => {
    const { children, ...rest } = props;
    return <Dividers {...rest}>{children}</Dividers>;
};

export default Divider;
