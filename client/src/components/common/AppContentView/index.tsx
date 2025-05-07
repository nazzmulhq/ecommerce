import React from "react";
import AppErrorBoundary from "../AppErrorBoundary";
import AppSuspense from "../AppSuspense";
import { StyledMainContentView } from "./index.styled";

type AppContentViewProps = {
    children: React.ReactNode;
};

const AppContentView: React.FC<AppContentViewProps> = ({ children }) => {
    return (
        <StyledMainContentView>
            <AppSuspense>
                <AppErrorBoundary>{children}</AppErrorBoundary>
            </AppSuspense>
        </StyledMainContentView>
    );
};

export default AppContentView;
