import { TMenu } from "@components/common/AppForm/components/type";
import { Menu as AntMenu } from "antd";
import { FC } from "react";

const Menu: FC<TMenu> = props => {
    return <AntMenu {...props} />;
};

export default Menu;
