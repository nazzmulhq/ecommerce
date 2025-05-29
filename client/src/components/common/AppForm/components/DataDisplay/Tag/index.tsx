import { TTag } from "@components/common/AppForm/components/type";
import { Tag as Tags } from "antd";
import { FC } from "react";

import { renderComponent } from "../../Render";

const Tag: FC<TTag> = props => {
    const { children, ...rest } = props;
    return <Tags {...rest}>{renderComponent(children)}</Tags>;
};

export default Tag;
