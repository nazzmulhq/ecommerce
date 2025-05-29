import { TAlert } from "@components/common/AppForm/components/type";
import { Alert as Alerts } from "antd";
import { FC } from "react";

const Alert: FC<TAlert> = props => {
    return <Alerts {...props} />;
};

export default Alert;
