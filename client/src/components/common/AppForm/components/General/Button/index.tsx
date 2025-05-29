import { TButton } from "@components/common/AppForm/components/type";
import { Button as Buttons } from "antd";
import { FC } from "react";

const Button: FC<TButton> = props => {
    const { children, ...rest } = props;
    return <Buttons {...rest}>{children}</Buttons>;
};

export default Button;
