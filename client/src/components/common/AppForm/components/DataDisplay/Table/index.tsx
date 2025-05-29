import { TTable } from "@components/common/AppForm/components/type";
import { Table as Tables } from "antd";
import { FC } from "react";

const Table: FC<TTable> = props => {
    return <Tables {...props} />;
};

export default Table;
