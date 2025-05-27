import { Button, ButtonProps, Space, Tooltip } from "antd";
import { FC } from "react";

export interface IRenderExtra {
    extra: (ButtonProps & { key?: string | number; position: string | number; tooltipTitle?: string })[];
}

const RenderExtra: FC<IRenderExtra> = ({ extra }) => {
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
                    // Ensure unique key for Tooltip
                    const tooltipKey = key ?? `tooltip-${index}`;
                    return (
                        <Tooltip key={tooltipKey} title={restProps?.tooltipTitle || restProps.children}>
                            <Button key={key || `btn-${index}`} {...restProps} />
                        </Tooltip>
                    );
                })}
        </Space>
    );
};

export default RenderExtra;
