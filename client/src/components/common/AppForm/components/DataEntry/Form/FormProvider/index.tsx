import { TFormProvider } from "@components/common/AppForm/components/type";
import { Form } from "antd";
import { FC } from "react";

const FormProvider: FC<TFormProvider> = props => {
    return <Form.Provider {...props} />;
};

export default FormProvider;
