import { SwitchProps, Switch as Switchs } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../types";

export interface ISwitch {
    ctype: typeof DataEntryFieldTypes.SWITCH;
    props: SwitchProps;
}

const Switch: FC<ISwitch> = ({ props }) => {
    return <Switchs {...props} />;
};

export default Switch;
