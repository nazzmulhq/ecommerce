import { TransferProps, Transfer as Transfers } from "antd";
import { FC } from "react";

export interface ITransfer {
    ctype: typeof DataEntryFieldTypes.TRANSFER;
    props: TransferProps;
}

const Transfer: FC<ITransfer> = ({ props }) => {
    return <Transfers {...props} />;
};

export default Transfer;
