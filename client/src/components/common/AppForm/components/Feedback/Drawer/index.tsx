import { TDrawer } from "@components/common/AppForm/components/type";
import { Drawer as Drawers } from "antd";
import { FC } from "react";
import { renderComponent } from "../../Render";

const Drawer: FC<TDrawer> = props => {
    const { children, ...rest } = props;
    return <Drawers {...rest}>{renderComponent(children)}</Drawers>;
};

export default Drawer;
