import { TGridCol } from "@components/common/AppForm/components/type";
import { Col } from "antd";
import { FC } from "react";
import { renderComponent } from "../../Render";

const GridCol: FC<TGridCol> = props => {
    const { children, ...rest } = props;
    return <Col {...rest}>{renderComponent(children)}</Col>;
};

export default GridCol;
