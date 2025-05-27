import AppContainer from "@components/common/AppContainer";
import AppForm from "@components/common/AppForm";
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
            <AppForm />
        </AppContainer>
    );
};

export default Permissions;
