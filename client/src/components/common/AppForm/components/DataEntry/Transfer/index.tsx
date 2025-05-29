import { TTransfer } from "@components/common/AppForm/components/type";
import { Transfer as Transfers } from "antd";
import { FC } from "react";

const Transfer: FC<TTransfer> = props => {
    return <Transfers {...props} />;
};

export default Transfer;
