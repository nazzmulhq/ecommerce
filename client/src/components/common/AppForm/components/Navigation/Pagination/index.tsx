import { TPagination } from "@components/common/AppForm/components/type";
import { Pagination as Paginations } from "antd";
import { FC } from "react";

const Pagination: FC<TPagination> = props => {
    return <Paginations {...props} />;
};

export default Pagination;
