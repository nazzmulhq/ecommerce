"use client";

import AppContainer from "@components/common/AppContainer";
import { Select, Typography } from "antd";
import { FC } from "react";

const { Title } = Typography;
const { Option } = Select;

export interface IPermissions {}

const Permissions: FC<IPermissions> = () => {
    return (
        <AppContainer
            title={
                <Title level={4} style={{ margin: 0 }}>
                    Permissions Management
                </Title>
            }
            extra={[
                {
                    children: "View",
                },
            ]}
        >
            ok
        </AppContainer>
    );
};

export default Permissions;
