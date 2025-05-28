import { Upload } from "antd";
import { DraggerProps } from "antd/es/upload";
import { FC } from "react";
import { renderComponent } from "../../../Render";
import { TQuickUIProps } from "../../../Types";
import { DataEntryFieldTypes } from "../../types";
interface IChildren extends Omit<DraggerProps, "children"> {
    children: TQuickUIProps[];
}

export interface IUploadImageDraggable {
    ctype: typeof DataEntryFieldTypes.UPLOAD_DRAGGER;
    props: IChildren;
}

const UploadImageDraggable: FC<IUploadImageDraggable> = ({ props }) => {
    const { children, ...rest } = props;
    return <Upload.Dragger {...rest}>{renderComponent(children)}</Upload.Dragger>;
};

export default UploadImageDraggable;
