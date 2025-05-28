import { Radio } from "antd";
import { RadioButtonProps } from "antd/es/radio/radioButton";
import { FC } from "react";
import { DataEntryFieldTypes } from "../../types";

export interface IRadioButton {
    ctype: typeof DataEntryFieldTypes.RADIO_BUTTON;
    props: RadioButtonProps;
}

const RadioButton: FC<IRadioButton> = ({ props }) => {
    return <Radio.Button {...props} />;
};

export default RadioButton;
