import { Upload } from 'antd';
import { DraggerProps } from 'antd/es/upload';
import React, { FC } from 'react';
import { renderComponent } from '../../../Render';
import { TQuickUIProps, UPLOAD_DRAGGER } from '../../../Types';
interface IChildren extends Omit<DraggerProps, 'children'> {
    children: TQuickUIProps[];
}

export interface IUploadImageDraggable {
    ctype: typeof UPLOAD_DRAGGER;
    props: IChildren;
}

const UploadImageDraggable: FC<IUploadImageDraggable> = ({ props }) => {
    const { children, ...rest } = props;
    return (
        <Upload.Dragger {...rest}>{renderComponent(children)}</Upload.Dragger>
    );
};

export default UploadImageDraggable;
