import { TGridRow } from "@components/common/AppForm/components/type";
import { Row } from "antd";
import { FC } from "react";
import { renderComponent } from "../../Render";

const GridRow: FC<TGridRow> = props => {
    const { children, ...rest } = props;
    return <Row {...rest}>{renderComponent(children)}</Row>;
};

export default GridRow;
