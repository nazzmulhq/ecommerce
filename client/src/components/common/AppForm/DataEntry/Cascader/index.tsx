import { CascaderProps, Cascader as Cascaders } from 'antd';
import React, { FC } from 'react';
import { CASCADER } from '../../Types';

export interface ICascader {
    ctype: typeof CASCADER;
    props: CascaderProps;
}

const Cascader: FC<ICascader> = ({ props }) => {
    const { multiple, ...rest } = props;
    return <Cascaders {...rest} />;
};

export default Cascader;
