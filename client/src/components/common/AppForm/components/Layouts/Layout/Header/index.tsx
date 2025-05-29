import { THeader } from "@components/common/AppForm/components/type";
import { Layout } from "antd";
import { FC } from "react";
import { renderComponent } from "../../../Render";

const Headers: FC<THeader> = props => {
    const { children, ...rest } = props;
    return <Layout.Header {...rest}>{renderComponent(children)}</Layout.Header>;
};

export default Headers;
