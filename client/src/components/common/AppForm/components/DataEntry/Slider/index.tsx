import { TSlider } from "@components/common/AppForm/components/type";
import { Slider as Sliders } from "antd";
import { FC } from "react";

const Slider: FC<TSlider> = props => {
    return <Sliders {...props} />;
};

export default Slider;
