import React, { ReactNode } from "react";
import SimpleBarReact from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import styled from "styled-components";

export const StyledScrollbar = styled(SimpleBarReact)`
    position: relative;
    width: 100%;
    height: 100%;

    & .simplebar-offset,
    & .simplebar-content-wrapper,
    & .simplebar-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
    }
`;

type AppScrollbarProps = {
    children: ReactNode;
    className?: string;
    scrollToTop?: boolean;

    [x: string]: any;
};

const AppScrollbar: React.FC<AppScrollbarProps> = ({ children, className, scrollToTop = false, ...others }) => {
    return (
        <StyledScrollbar {...others} className={className}>
            {children}
        </StyledScrollbar>
    );
};

export default AppScrollbar;
