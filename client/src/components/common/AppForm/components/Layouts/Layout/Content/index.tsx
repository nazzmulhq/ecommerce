import { TContent } from "@components/common/AppForm/components/type";
import { Layout } from "antd";
import { FC } from "react";
import { renderComponent } from "../../../Render";

const Content: FC<TContent> = props => {
    const { children, ...rest } = props;
    return <Layout.Content {...rest}>{renderComponent(children)}</Layout.Content>;
};

export default Content;
