import { TRadio } from "@components/common/AppForm/components/type";
import { Radio as Radios } from "antd";
import { FC } from "react";

const Radio: FC<TRadio> = props => {
    return <Radios {...props} />;
};

export default Radio;
