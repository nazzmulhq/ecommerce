import { SliderSingleProps, Slider as Sliders } from "antd";

import { SliderRangeProps } from "antd/es/slider";
import { FC } from "react";
import { DataEntryFieldTypes } from "../types";

export interface ISlider {
    ctype: typeof DataEntryFieldTypes.SLIDER;
    props: SliderSingleProps | SliderRangeProps;
}

const Slider: FC<ISlider> = ({ props }) => {
    return <Sliders {...props} />;
};

export default Slider;
