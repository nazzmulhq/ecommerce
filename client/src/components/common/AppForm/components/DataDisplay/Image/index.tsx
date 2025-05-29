import { TImage } from "@components/common/AppForm/components/type";
import { Image as Images } from "antd";
import { FC } from "react";

const Image: FC<TImage> = props => {
    return <Images {...props} />;
};

export default Image;
