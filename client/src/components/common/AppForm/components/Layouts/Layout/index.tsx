import { TLayout } from "@components/common/AppForm/components/type";
import { Layout as Layouts } from "antd";
import { FC } from "react";
import { renderComponent } from "../../Render";

const Layout: FC<TLayout> = props => {
    const { children } = props;
    return <Layouts>{renderComponent(children)}</Layouts>;
};

export default Layout;
