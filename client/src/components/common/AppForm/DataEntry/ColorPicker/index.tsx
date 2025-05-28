import { ColorPickerProps, ColorPicker as ColorPickers } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../types";

export interface IColorPicker {
    ctype: typeof DataEntryFieldTypes.COLOR_PICKER;
    props: ColorPickerProps;
}

const ColorPicker: FC<IColorPicker> = ({ props }) => {
    return <ColorPickers {...props} />;
};

export default ColorPicker;
