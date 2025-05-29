import { TWatermark } from "@components/common/AppForm/components/type";
import { Watermark as Watermarks } from "antd";
import { FC } from "react";
import { renderComponent } from "../../Render";

const Watermark: FC<TWatermark> = props => {
    const { children, ...rest } = props;
    return <Watermarks {...rest}>{renderComponent(children)}</Watermarks>;
};

export default Watermark;
