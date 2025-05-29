import { TBadgeRibbon } from "@components/common/AppForm/components/type";
import { Badge } from "antd";
import { FC } from "react";
import { renderComponent } from "../../../Render";

const BadgeRibbon: FC<TBadgeRibbon> = props => {
    const { children, ...rest } = props;
    return <Badge.Ribbon {...rest}>{renderComponent(children)}</Badge.Ribbon>;
};

export default BadgeRibbon;
