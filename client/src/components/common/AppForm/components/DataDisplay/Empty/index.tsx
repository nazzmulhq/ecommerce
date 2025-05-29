import { TEmpty } from "@components/common/AppForm/components/type";
import { Empty as Emptys } from "antd";
import { FC } from "react";
import { renderComponent } from "../../Render";

const Empty: FC<TEmpty> = props => {
    const { children, ...rest } = props;
    if (!children) {
        return <Emptys {...rest} />;
    }
    return <Emptys {...rest}>{renderComponent(children)}</Emptys>;
};

export default Empty;
