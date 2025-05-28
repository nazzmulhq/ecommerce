import { Upload, UploadProps } from "antd";
import ImgCrop, { ImgCropProps } from "antd-img-crop";
import { FC } from "react";
import { DataEntryFieldTypes } from "../../types";

interface IChildren extends Omit<ImgCropProps, "children"> {
    upload: UploadProps;
}

export interface IUploadImgCrop {
    ctype: typeof DataEntryFieldTypes.UPLOAD_IMG_CROP;
    props: IChildren;
}

const UploadImgCrop: FC<IUploadImgCrop> = ({ props }) => {
    const { upload, ...rest } = props;
    return (
        <ImgCrop {...rest}>
            <Upload {...upload} />
        </ImgCrop>
    );
};

export default UploadImgCrop;
