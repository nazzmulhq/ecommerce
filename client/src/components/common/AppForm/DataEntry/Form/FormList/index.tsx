import { Form } from 'antd';
import { FormListProps } from 'antd/es/form';
import React, { FC } from 'react';
import { FROM_LIST } from '../../../Types';
export interface IFormList {
    ctype: typeof FROM_LIST;
    props: FormListProps;
}

const FormList: FC<IFormList> = ({ props }) => {
    return <Form.List {...props} />;
};

export default FormList;
