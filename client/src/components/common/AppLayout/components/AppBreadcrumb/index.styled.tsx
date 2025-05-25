import { Breadcrumb } from "antd";
import styled from "styled-components";

export const StyledBreadcrumb = styled(Breadcrumb)`
    padding: 10px 18px;
    font-size: 14px;
    background: ${({ theme }) => theme.palette.background.paper};
    border-radius: 8px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.03);
    display: flex;
    align-items: center;
    min-height: 40px;
    margin-bottom: 12px;

    .ant-breadcrumb-link {
        color: ${({ theme }) => theme.palette.text.secondary};
        font-weight: 500;
        transition: color 0.2s;
        display: flex;
        align-items: center;
        gap: 4px;
        border-radius: 5px;
        padding: 2px 8px;
        cursor: pointer;
        &:hover {
            color: ${({ theme }) => theme.palette.primary.main};
        }
    }

    .ant-breadcrumb-link a {
        color: ${({ theme }) => theme.palette.primary.main};
        text-decoration: none;
        &:hover {
            color: ${({ theme }) => theme.palette.primary.dark};
        }
    }

    .ant-breadcrumb-separator {
        margin: 0 6px;
        color: ${({ theme }) => theme.palette.text.disabled};
        font-size: 16px;
        font-weight: 400;
    }

    .ant-breadcrumb-link:last-child {
        color: ${({ theme }) => theme.palette.text.primary};
        font-weight: 600;
        background: none;
        cursor: default;
    }
`;
