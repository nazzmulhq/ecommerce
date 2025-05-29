import { TMention } from "@components/common/AppForm/components/type";
import { Mentions as Mentionss } from "antd";
import { FC } from "react";

const Mentions: FC<TMention> = props => {
    return <Mentionss {...props} />;
};

export default Mentions;
