import { TUploadImgCrop } from "@components/common/AppForm/components/type";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { FC } from "react";

const UploadImgCrop: FC<TUploadImgCrop> = props => {
    const { upload, ...rest } = props;
    return (
        <ImgCrop {...rest}>
            <Upload {...upload} />
        </ImgCrop>
    );
};

export default UploadImgCrop;
