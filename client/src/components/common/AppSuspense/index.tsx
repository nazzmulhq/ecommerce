"use client";
import React, { ReactNode, Suspense } from "react";
import AppLoader from "../AppLoader";

interface AppSuspenseProps {
    children: ReactNode;
}

const AppSuspense: React.FC<AppSuspenseProps> = ({ children }) => {
    return <Suspense fallback={<AppLoader />}>{children}</Suspense>;
};

export default AppSuspense;
