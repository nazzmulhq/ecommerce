import { TTabs } from "@components/common/AppForm/components/type";
import { Tabs as Tabss } from "antd";
import { FC } from "react";

const Tabs: FC<TTabs> = props => {
    return <Tabss {...props} />;
};

export default Tabs;
