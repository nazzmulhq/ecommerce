import { TRadioGroup } from "@components/common/AppForm/components/type";
import { Radio } from "antd";
import { FC } from "react";

const RadioGroup: FC<TRadioGroup> = props => {
    return <Radio.Group {...props} />;
};

export default RadioGroup;
