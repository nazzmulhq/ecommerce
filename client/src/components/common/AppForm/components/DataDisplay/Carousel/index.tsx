import { TCarousel } from "@components/common/AppForm/components/type";
import { Carousel as Carousels } from "antd";
import { FC } from "react";

const Carousel: FC<TCarousel> = props => {
    return <Carousels {...props} />;
};

export default Carousel;
