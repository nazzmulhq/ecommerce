import { Form } from 'antd';
import { FormProviderProps } from 'antd/es/form/context';
import React, { FC } from 'react';
import { FORM_PROVIDER } from '../../../Types';

export interface IFormProvider {
    ctype: typeof FORM_PROVIDER;
    props: FormProviderProps;
}

const FormProvider: FC<IFormProvider> = ({ props }) => {
    return <Form.Provider {...props} />;
};

export default FormProvider;
