"use client";
import { Card } from "antd";
import styled from "styled-components";

export const StyledCard = styled(Card)`
    margin-bottom: 20px;
    .ant-card-body {
        /* display: none; */
        padding: 8px 8px !important;
    }

    @media (max-width: 600px) {
        margin-bottom: 12px;
        .ant-card-body {
            padding: 4px !important;
        }
    }
`;
