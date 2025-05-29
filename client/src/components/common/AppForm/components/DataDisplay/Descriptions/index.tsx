import { TDescriptions } from "@components/common/AppForm/components/type";
import { Descriptions as Descriptionss } from "antd";
import { FC } from "react";

const Descriptions: FC<TDescriptions> = props => {
    return <Descriptionss {...props} />;
};

export default Descriptions;
