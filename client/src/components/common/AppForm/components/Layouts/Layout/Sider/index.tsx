import { TSider } from "@components/common/AppForm/components/type";
import { Layout } from "antd";
import { FC } from "react";
import { renderComponent } from "../../../Render";

const Sider: FC<TSider> = props => {
    const { children, ...rest } = props;
    return <Layout.Sider {...rest}>{renderComponent(children)}</Layout.Sider>;
};

export default Sider;
