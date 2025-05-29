import { TCardMeta } from "@components/common/AppForm/components/type";
import { Card } from "antd";
import { FC } from "react";

const CardMeta: FC<TCardMeta> = props => {
    return <Card.Meta {...props} />;
};

export default CardMeta;
