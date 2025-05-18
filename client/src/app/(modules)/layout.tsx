import AppLayout from "@components/common/AppLayout";
import React, { FC } from "react";

export interface ILayout {
    children: React.ReactNode;
}

const Layout: FC<ILayout> = ({ children }) => {
    return <AppLayout>{children}</AppLayout>;
};

export default Layout;
