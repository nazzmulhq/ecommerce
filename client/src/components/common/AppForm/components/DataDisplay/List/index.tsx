import { TList } from "@components/common/AppForm/components/type";
import { List as Lists } from "antd";
import { FC } from "react";

const List: FC<TList> = props => {
    return <Lists {...props} />;
};

export default List;
