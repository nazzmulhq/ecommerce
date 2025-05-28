import { ColorPickerProps, ColorPicker as ColorPickers } from 'antd';
import React, { FC } from 'react';
import { COLOR_PICKER } from '../../Types';

export interface IColorPicker {
    ctype: typeof COLOR_PICKER;
    props: ColorPickerProps;
}

const ColorPicker: FC<IColorPicker> = ({ props }) => {
    return <ColorPickers {...props} />;
};

export default ColorPicker;
