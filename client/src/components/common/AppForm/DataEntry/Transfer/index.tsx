import { TransferProps, Transfer as Transfers } from 'antd';
import React, { FC } from 'react';
import { TRANSFER } from '../../Types';

export interface ITransfer {
    ctype: typeof TRANSFER;
    props: TransferProps;
}

const Transfer: FC<ITransfer> = ({ props }) => {
    return <Transfers {...props} />;
};

export default Transfer;
