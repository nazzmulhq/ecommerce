import { Upload } from "antd";
import { DraggerProps } from "antd/es/upload";
import { FC } from "react";
import { DataEntryFieldTypes } from "../../types";

export interface IUploadImageDraggable {
    ctype: typeof DataEntryFieldTypes.UPLOAD_DRAGGER;
    props: DraggerProps;
}

const UploadImageDraggable: FC<IUploadImageDraggable> = ({ props }) => {
    const { children, ...rest } = props;
    return <Upload.Dragger {...rest} />;
};

export default UploadImageDraggable;
