import { TRadioButton } from "@components/common/AppForm/components/type";
import { Radio } from "antd";
import { FC } from "react";

const RadioButton: FC<TRadioButton> = props => {
    return <Radio.Button {...props} />;
};

export default RadioButton;
