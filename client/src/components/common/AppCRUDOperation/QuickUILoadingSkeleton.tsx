import { Card, Skeleton, Table } from "antd";
import styled from "styled-components";

// Loading Skeleton Component
const QuickUILoadingSkeleton = ({ title }: { title: string }) => (
    <Card title={<Skeleton.Input active size="small" style={{ width: 200 }} />} style={{ minHeight: "400px" }}>
        <div style={{ marginBottom: 16 }}>
            <Skeleton.Button active size="default" style={{ marginRight: 8 }} />
            <Skeleton.Button active size="default" />
        </div>

        <div style={{ marginBottom: 16 }}>
            <Skeleton active paragraph={{ rows: 2 }} />
        </div>

        <Table
            columns={[
                { title: <Skeleton.Input active size="small" />, dataIndex: "col1", key: "col1" },
                { title: <Skeleton.Input active size="small" />, dataIndex: "col2", key: "col2" },
                { title: <Skeleton.Input active size="small" />, dataIndex: "col3", key: "col3" },
            ]}
            dataSource={Array.from({ length: 5 }, (_, i) => ({
                key: i,
                col1: <Skeleton.Input active size="small" />,
                col2: <Skeleton.Input active size="small" />,
                col3: <Skeleton.Input active size="small" />,
            }))}
            pagination={false}
            loading={false}
        />
    </Card>
);

const StyledQuickUILoadingSkeleton = styled(QuickUILoadingSkeleton)`
    /* Dark mode skeleton styles */
    .ant-card {
        background-color: var(--ant-color-bg-container);
        border-color: var(--ant-color-border);

        @media (prefers-color-scheme: dark) {
            background-color: #141414;
            border-color: #303030;
        }
    }

    .ant-skeleton-input {
        background: linear-gradient(
            90deg,
            var(--ant-color-fill-content) 25%,
            var(--ant-color-fill-alter) 50%,
            var(--ant-color-fill-content) 75%
        );
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;

        @media (prefers-color-scheme: dark) {
            background: linear-gradient(90deg, #262626 25%, #303030 50%, #262626 75%);
            background-size: 200% 100%;
        }
    }

    .ant-skeleton-button {
        background: linear-gradient(
            90deg,
            var(--ant-color-fill-content) 25%,
            var(--ant-color-fill-alter) 50%,
            var(--ant-color-fill-content) 75%
        );
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;

        @media (prefers-color-scheme: dark) {
            background: linear-gradient(90deg, #262626 25%, #303030 50%, #262626 75%);
            background-size: 200% 100%;
        }

        &:first-child {
            @media (prefers-color-scheme: dark) {
                background: linear-gradient(90deg, #1677ff 25%, #4096ff 50%, #1677ff 75%);
                background-size: 200% 100%;
            }
        }
    }

    .ant-skeleton-paragraph li {
        background: linear-gradient(
            90deg,
            var(--ant-color-fill-content) 25%,
            var(--ant-color-fill-alter) 50%,
            var(--ant-color-fill-content) 75%
        );
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;

        @media (prefers-color-scheme: dark) {
            background: linear-gradient(90deg, #262626 25%, #303030 50%, #262626 75%);
            background-size: 200% 100%;
        }
    }

    .ant-skeleton-title {
        background: linear-gradient(
            90deg,
            var(--ant-color-fill-content) 25%,
            var(--ant-color-fill-alter) 50%,
            var(--ant-color-fill-content) 75%
        );
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;

        @media (prefers-color-scheme: dark) {
            background: linear-gradient(90deg, #262626 25%, #303030 50%, #262626 75%);
            background-size: 200% 100%;
        }
    }

    .ant-table {
        background-color: var(--ant-color-bg-container);

        @media (prefers-color-scheme: dark) {
            background-color: #141414;

            .ant-table-thead > tr > th {
                background-color: #1f1f1f;
                border-bottom-color: #303030;
                color: rgba(255, 255, 255, 0.85);
            }

            .ant-table-tbody > tr > td {
                border-bottom-color: #303030;
                background-color: #141414;
            }

            .ant-table-tbody > tr:hover > td {
                background-color: #1f1f1f;
            }
        }
    }

    /* Skeleton loading animation */
    @keyframes skeleton-loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }

    /* Enhanced dark mode transitions */
    * {
        transition:
            background-color 0.3s ease,
            border-color 0.3s ease;
    }

    /* Dark mode card header */
    .ant-card-head {
        @media (prefers-color-scheme: dark) {
            background-color: #1f1f1f;
            border-bottom-color: #303030;
        }
    }

    .ant-card-head-title {
        @media (prefers-color-scheme: dark) {
            color: rgba(255, 255, 255, 0.85);
        }
    }

    /* Dark mode responsive adjustments */
    @media (prefers-color-scheme: dark) and (max-width: 768px) {
        .ant-card {
            background-color: #0f0f0f;
        }

        .ant-table {
            background-color: #0f0f0f;
        }
    }
`;

export default StyledQuickUILoadingSkeleton;
