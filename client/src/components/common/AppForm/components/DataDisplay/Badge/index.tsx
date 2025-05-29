import { TBadge } from "@components/common/AppForm/components/type";
import { Badge as Badges } from "antd";
import { FC } from "react";
import { renderComponent } from "../../Render";

const Badge: FC<TBadge> = props => {
    const { children, ...rest } = props;
    return <Badges {...rest}>{renderComponent(children)}</Badges>;
};

export default Badge;
