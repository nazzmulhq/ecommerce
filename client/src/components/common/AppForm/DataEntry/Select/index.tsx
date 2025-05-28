import { SelectProps, Select as Selects } from 'antd';
import React, { FC } from 'react';
import { SELECT } from '../../Types';

export interface ISelect {
    ctype: typeof SELECT;
    props: SelectProps;
}

const Select: FC<ISelect> = ({ props }) => {
    return <Selects {...props} />;
};

export default Select;
