import { SliderSingleProps, Slider as Sliders } from 'antd';

import { SliderRangeProps } from 'antd/es/slider';
import React, { FC } from 'react';
import { SLIDER } from '../../Types';

export interface ISlider {
    ctype: typeof SLIDER;
    props: SliderSingleProps | SliderRangeProps;
}

const Slider: FC<ISlider> = ({ props }) => {
    return <Sliders {...props} />;
};

export default Slider;
