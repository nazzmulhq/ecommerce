import { TBreadcrumb } from "@components/common/AppForm/components/type";
import { Breadcrumb as Breadcrumbs } from "antd";
import { FC } from "react";

const Breadcrumb: FC<TBreadcrumb> = props => {
    return <Breadcrumbs {...props} />;
};

export default Breadcrumb;
