import { TPopconfirm } from "@components/common/AppForm/components/type";
import { Popconfirm as Popconfirms } from "antd";
import { FC } from "react";
import { renderComponent } from "../../Render";

const Popconfirm: FC<TPopconfirm> = props => {
    const { children, ...rest } = props;
    return <Popconfirms {...rest}>{renderComponent(children)}</Popconfirms>;
};

export default Popconfirm;
