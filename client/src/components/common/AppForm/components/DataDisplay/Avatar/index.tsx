import { TAvatar } from "@components/common/AppForm/components/type";
import { Avatar as Avatars } from "antd";
import { FC } from "react";

const Avatar: FC<TAvatar> = props => {
    return <Avatars {...props} />;
};

export default Avatar;
