import { Tree } from "antd";
import styled from "styled-components";

export const StyledRoutesTree = styled(Tree)`
    .ant-tree-treenode {
        margin-bottom: 12px;
    }
    .ant-tree-node-content-wrapper {
        background: #fff;
        border: 1.5px solid #e5e7eb;
        border-radius: 12px;
        padding: 8px 18px;
        margin: 0 8px;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
        transition:
            box-shadow 0.2s,
            border-color 0.2s;
        font-size: 16px;
        min-width: 120px;
        min-height: 36px;
        display: flex;
        align-items: center;
    }
    .ant-tree-node-content-wrapper:hover,
    .ant-tree-node-selected .ant-tree-node-content-wrapper {
        border-color: #1890ff;
        box-shadow: 0 4px 16px 0 rgba(24, 144, 255, 0.1);
        background: #f0f7ff;
    }
    .ant-tree-switcher {
        margin-right: 8px;
    }
    .ant-tree .ant-tree-child-tree {
        margin-left: 40px;
        border-left: 2px dashed #e5e7eb;
        padding-left: 8px;
    }
    .ant-tree .ant-tree-treenode {
        position: relative;
    }
    .ant-tree .ant-tree-treenode:not(:last-child)::after {
        content: "";
        position: absolute;
        left: -20px;
        top: 36px;
        width: 2px;
        height: calc(100% - 36px);
        background: #e5e7eb;
    }
`;
