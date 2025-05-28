import { TreeSelectProps, TreeSelect as TreeSelects } from 'antd';
import React, { FC } from 'react';
import { TREE_SELECT } from '../../Types';

export interface ITreeSelect {
    ctype: typeof TREE_SELECT;
    props: TreeSelectProps;
}

const TreeSelect: FC<ITreeSelect> = ({ props }) => {
    return <TreeSelects {...props} />;
};

export default TreeSelect;
