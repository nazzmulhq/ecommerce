"use client";
import AppContainer from "@components/common/AppContainer";
import { FC } from "react";

export interface IRole {}

const Role: FC<IRole> = () => {
    return (
        <AppContainer
            title="Role Management"
            extra={[
                {
                    key: 1,
                    position: 1,
                    children: "View",
                    onClick: () => console.log("op"),
                },
            ]}
        >
            Role
        </AppContainer>
    );
};

export default Role;
