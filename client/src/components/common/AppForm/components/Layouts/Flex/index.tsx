import { TFlex } from "@components/common/AppForm/components/type";
import { Flex as Flexs } from "antd";
import { FC } from "react";
import { renderComponent } from "../../Render";

const Flex: FC<TFlex> = props => {
    const { children, ...rest } = props;
    return <Flexs {...rest}>{renderComponent(children)}</Flexs>;
};

export default Flex;
