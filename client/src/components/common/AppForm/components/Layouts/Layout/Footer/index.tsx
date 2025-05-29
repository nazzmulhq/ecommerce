import { TFooter } from "@components/common/AppForm/components/type";
import { Layout } from "antd";
import { FC } from "react";
import { renderComponent } from "../../../Render";

const Footer: FC<TFooter> = props => {
    const { children, ...rest } = props;
    return <Layout.Footer {...rest}>{renderComponent(children)}</Layout.Footer>;
};

export default Footer;
