import React, { ErrorInfo, ReactNode } from "react";
import ErrorIcon from "./ErrorIcon";
import { StyledAppBoundary } from "./index.styled";

class AppErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        console.log("errorInfo: ", error, errorInfo);
        // logErrorToMyService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <StyledAppBoundary>
                    <ErrorIcon />
                    <div style={{ fontSize: 30, marginTop: 4 }}>Ah! Something went wrong.</div>
                    <div style={{ fontSize: 18, textAlign: "center" }}>Brace yourself till we get the error fixed.</div>
                    <div style={{ fontSize: 18, textAlign: "center" }}>
                        You may also refresh the page or try again latter
                    </div>
                </StyledAppBoundary>
            );
        }
        return this.props.children;
    }
}

export default AppErrorBoundary;
