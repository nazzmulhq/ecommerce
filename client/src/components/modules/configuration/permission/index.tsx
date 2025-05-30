"use client";
import AppContainer from "@components/common/AppContainer";
import AppForm from "@components/common/AppForm";
import { basicFormSchema } from "@components/common/AppForm/example";
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
                schema={basicFormSchema}
                onFinish={values => console.log("Form submitted:", values)}
                onValuesChange={(changed, all) => console.log("Values changed:", changed)}
            />
        </AppContainer>
    );
};

export default Permissions;
