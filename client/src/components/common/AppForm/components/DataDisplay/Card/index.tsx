import { TCard } from "@components/common/AppForm/components/type";
import { Card as Cards } from "antd";
import { FC } from "react";
import { renderComponent } from "../../Render";

const Card: FC<TCard> = props => {
    const { children, ...rest } = props;
    return <Cards {...rest}>{renderComponent(children)}</Cards>;
};

export default Card;
