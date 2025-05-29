import { TQRCode } from "@components/common/AppForm/components/type";
import { QRCode as QRCodes } from "antd";
import { FC } from "react";

const QRCode: FC<TQRCode> = props => {
    return <QRCodes {...props} />;
};

export default QRCode;
