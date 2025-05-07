import { CheckOutlined } from "@ant-design/icons";
import clsx from "clsx";
import React from "react";
import { StyledAppSelectedIcon } from "./index.styled";

type AppSelectedIconProps = {
    backgroundColor?: string;
    color?: string;
    isCenter?: boolean;
};

const AppSelectedIcon: React.FC<AppSelectedIconProps> = ({ backgroundColor, isCenter = true, color }) => {
    return (
        <StyledAppSelectedIcon backgroundColor={backgroundColor} className={clsx({ isCenter: isCenter })} color={color}>
            <CheckOutlined />
        </StyledAppSelectedIcon>
    );
};

export default AppSelectedIcon;
