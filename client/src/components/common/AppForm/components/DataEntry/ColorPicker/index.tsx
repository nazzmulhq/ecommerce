import { TColorPicker } from "@components/common/AppForm/components/type";
import { ColorPicker as ColorPickers } from "antd";
import { FC } from "react";

const ColorPicker: FC<TColorPicker> = props => {
    return <ColorPickers {...props} />;
};

export default ColorPicker;
