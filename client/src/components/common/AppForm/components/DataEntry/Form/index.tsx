import { TForm } from "@components/common/AppForm/components/type";
import { Form as Forms } from "antd";
import { FC } from "react";
import { renderComponent } from "../../Render";

const Form: FC<TForm> = props => {
    const { children, ...rest } = props;
    return <Forms {...rest}>{renderComponent(children)}</Forms>;
};

export default Form;
