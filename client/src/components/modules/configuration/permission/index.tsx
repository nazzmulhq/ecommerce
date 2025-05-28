"use client";
import AppContainer from "@components/common/AppContainer";
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
            ok
        </AppContainer>
    );
};

export default Permissions;
