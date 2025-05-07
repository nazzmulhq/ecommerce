import { Layout } from "antd";
import styled from "styled-components";

const { Content } = Layout;

export const StyledMainContentView = styled(Content)`
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 20px 20px 0;
    min-height: auto !important;
    //background-color: ${({ theme }) => theme.palette.background.default};

    @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}px) {
        padding: 30px 32px 0;
    }
`;
