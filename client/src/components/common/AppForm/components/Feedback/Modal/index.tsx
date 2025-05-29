import { TModal } from "@components/common/AppForm/components/type";
import { Modal as Modals } from "antd";
import { FC } from "react";
import { renderComponent } from "../../Render";

const Modal: FC<TModal> = props => {
    const { children, ...rest } = props;
    return <Modals {...rest}>{renderComponent(children)}</Modals>;
};

export default Modal;
