import { TCardGrid } from "@components/common/AppForm/components/type";
import { Card } from "antd";
import { FC } from "react";

const CardGrid: FC<TCardGrid> = props => {
    return <Card.Grid {...props} />;
};

export default CardGrid;
