"use client";
import AppContainer from "@components/common/AppContainer";
import DataEntry from "@components/common/AppForm/DataEntry";
import { FormConfig } from "@components/common/AppForm/DataEntry/types";
import { FC } from "react";

export interface IPermissions {}

const Permissions: FC<IPermissions> = () => {
    const formConfig: FormConfig = {};

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
            <DataEntry config={formConfig} />
        </AppContainer>
    );
};

export default Permissions;
