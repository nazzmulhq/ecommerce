"use client";
import { Card } from "antd";
import styled from "styled-components";

export const StyledCard = styled(Card)`
    margin-bottom: 20px;

    .ant-breadcrumb {
        display: flex;
        align-items: center;
    }

    .ant-breadcrumb ol {
        display: flex;
        align-items: center;
        margin: 0;
    }

    .ant-breadcrumb ol li {
        height: 16px;
        display: flex;
        align-items: center;
    }

    .ant-breadcrumb-link {
        display: flex;
        align-items: center;
    }

    .ant-breadcrumb-separator {
        display: flex;
        align-items: center;
    }

    .ant-card-body {
        padding: 10px 24px !important;
    }
`;
