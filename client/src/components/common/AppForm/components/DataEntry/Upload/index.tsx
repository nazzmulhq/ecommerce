import { TUpload } from "@components/common/AppForm/components/type";
import { Upload as Uploads } from "antd";
import { FC } from "react";

const Upload: FC<TUpload> = props => {
    return <Uploads {...props} />;
};

export default Upload;
