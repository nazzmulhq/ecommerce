import { UploadProps, Upload as Uploads } from 'antd';
import React, { FC } from 'react';
import { UPLOAD } from '../../Types';

export interface IUpload {
    ctype: typeof UPLOAD;
    props: UploadProps;
}

const Upload: FC<IUpload> = ({ props }) => {
    return <Uploads {...props} />;
};

export default Upload;
