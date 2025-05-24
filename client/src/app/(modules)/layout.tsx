import AppLayout from "@components/common/AppLayout";
import AppSuspense from "@components/common/AppSuspense";
import React, { FC } from "react";

export interface ILayout {
    children: React.ReactNode;
}

const Layout: FC<ILayout> = ({ children }) => {
    return (
        <AppSuspense>
            <AppLayout>{children}</AppLayout>
        </AppSuspense>
    );
};

export default Layout;
