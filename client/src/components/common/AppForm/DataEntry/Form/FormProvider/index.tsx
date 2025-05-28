import { Form } from "antd";
import { FormProviderProps } from "antd/es/form/context";
import { FC } from "react";
import { DataEntryFieldTypes } from "../../types";

export interface IFormProvider {
    ctype: typeof DataEntryFieldTypes.FORM_PROVIDER;
    props: FormProviderProps;
}

const FormProvider: FC<IFormProvider> = ({ props }) => {
    return <Form.Provider {...props} />;
};

export default FormProvider;
