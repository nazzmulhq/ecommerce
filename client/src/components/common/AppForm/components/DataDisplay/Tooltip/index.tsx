import { TTooltip } from "@components/common/AppForm/components/type";
import { Tooltip as Tooltips } from "antd";
import { FC } from "react";

import { renderComponent } from "../../Render";

const Tooltip: FC<TTooltip> = props => {
    const { children, ...rest } = props;
    return <Tooltips {...rest}>{renderComponent(children)}</Tooltips>;
};

export default Tooltip;
