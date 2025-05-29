import { TImagePreview } from "@components/common/AppForm/components/type";
import { Image } from "antd";
import { FC } from "react";

const ImagePreviewGroup: FC<TImagePreview> = props => {
    const { children, ...rest } = props;
    return (
        <Image.PreviewGroup {...rest}>
            {children?.map((imgProps, idx) => <Image key={idx} {...imgProps} />)}
        </Image.PreviewGroup>
    );
};

export default ImagePreviewGroup;
