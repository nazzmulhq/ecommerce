import { TUploadDragger } from "@components/common/AppForm/components/type";
import { Upload } from "antd";
import { FC } from "react";
import { renderComponent } from "../../../Render";

const UploadImageDraggable: FC<TUploadDragger> = props => {
    const { children, ...rest } = props;
    return <Upload.Dragger {...rest}>{renderComponent(children)}</Upload.Dragger>;
};

export default UploadImageDraggable;
