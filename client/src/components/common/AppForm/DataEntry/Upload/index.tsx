import { UploadProps, Upload as Uploads } from "antd";
import { FC } from "react";
import { DataEntryFieldTypes } from "../types";

export interface IUpload {
    ctype: typeof DataEntryFieldTypes.UPLOAD;
    props: UploadProps;
}

const Upload: FC<IUpload> = ({ props }) => {
    return <Uploads {...props} />;
};

export default Upload;
