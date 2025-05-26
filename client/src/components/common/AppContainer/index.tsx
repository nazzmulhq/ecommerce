import { isArrayOrObjectEmpty } from "@lib/utils/Common";
import { Button, ButtonProps, Card, Space, Typography } from "antd";
import React, { isValidElement, ReactNode } from "react";

type TitleConfig = {
    children: string;
    level?: 1 | 2 | 3 | 4 | 5;
    className?: string;
    style?: React.CSSProperties;
};

type AppContainerProps = {
    children: React.ReactNode;
    title?: ReactNode | string | TitleConfig;
    extra?: (ButtonProps & { key?: string | number; position: string | number })[];
};

const { Title } = Typography;

const AppContainer: React.FC<AppContainerProps> = ({ children, title = "", extra = [] }) => {
    const renderTitle = (): ReactNode => {
        // Handle empty/null/undefined
        if (!title || (typeof title === "string" && title.trim() === "")) {
            return null;
        }

        // Handle string
        if (typeof title === "string") {
            return <Title level={4}>{title}</Title>;
        }

        // Handle React component
        if (isValidElement(title)) {
            return title;
        }

        // Handle title config object
        if (typeof title === "object" && !isArrayOrObjectEmpty(title)) {
            const titleConfig = title as TitleConfig;
            return (
                <Title level={titleConfig.level || 4} className={titleConfig.className}>
                    {titleConfig.children}
                </Title>
            );
        }

        return null;
    };

    const renderExtra = (): ReactNode => {
        if (!extra || extra.length === 0) {
            return null;
        }

        return (
            <Space size="small">
                {extra
                    .sort((a, b) => {
                        if (a.position < b.position) return 1;
                        if (a.position > b.position) return -1;
                        return 0;
                    })
                    .map((buttonProps, index) => {
                        const { key, ...restProps } = buttonProps;
                        return <Button key={key || `btn-${index}`} {...restProps} />;
                    })}
            </Space>
        );
    };

    const leftHeader = title ? renderTitle() : null;
    const rightExtra = renderExtra();

    return (
        <Card title={leftHeader} extra={rightExtra}>
            {children}
        </Card>
    );
};

export default AppContainer;
