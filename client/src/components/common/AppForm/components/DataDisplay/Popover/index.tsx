import { TPopover } from "@components/common/AppForm/components/type";
import { Popover as Popovers } from "antd";
import { FC } from "react";
import { renderComponent } from "../../Render";

const Popover: FC<TPopover> = props => {
    const { children, content, ...rest } = props;
    const renderContent = content ? <>{renderComponent(content)}</> : undefined;
    return (
        <Popovers {...rest} content={renderContent}>
            {renderComponent(children)}
        </Popovers>
    );
};

export default Popover;
