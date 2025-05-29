import { TSwitch } from "@components/common/AppForm/components/type";
import { Switch as Switchs } from "antd";
import { FC } from "react";

const Switch: FC<TSwitch> = props => {
    return <Switchs {...props} />;
};

export default Switch;
