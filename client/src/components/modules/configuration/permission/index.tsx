"use client";
import AppContainer from "@components/common/AppContainer";
import AppForm, { stepFormSchema } from "@components/common/AppForm";
import { FC } from "react";

export interface IPermissions {}

const Permissions: FC<IPermissions> = () => {
    return (
        <AppContainer
            title="Permissions Management"
            extra={[
                {
                    key: 1,
                    position: 1,
                    children: "View",
                },
            ]}
        >
            <AppForm
                schema={stepFormSchema}
                onFinish={values => console.log("Form submitted:", values)}
                onValuesChange={(changed, all) => console.log("Values changed:", changed)}
            />
        </AppContainer>
    );
};

export default Permissions;
