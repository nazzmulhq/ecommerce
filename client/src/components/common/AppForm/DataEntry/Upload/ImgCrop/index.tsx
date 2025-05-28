import { Upload, UploadProps } from 'antd';
import ImgCrop, { ImgCropProps } from 'antd-img-crop';
import React, { FC } from 'react';
import { UPLOAD_IMG_CROP } from '../../../Types';

interface IChildren extends Omit<ImgCropProps, 'children'> {
    upload: UploadProps;
}

export interface IUploadImgCrop {
    ctype: typeof UPLOAD_IMG_CROP;
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
