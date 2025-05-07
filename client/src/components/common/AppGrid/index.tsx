import React, { CSSProperties, ReactNode } from "react";
import GridFooter from "./GridFooter";
import GridView from "./GridView";

type AppCardProps = {
    loading?: boolean;
    border?: boolean;
    footerProps?: {
        loading: boolean;
        footerText: string;
    };
    containerStyle?: CSSProperties;
    ListEmptyComponent?: ReactNode;
    ListFooterComponent?: ReactNode;
    data: any[];
    onEndReached?: () => void;
    renderItem: (item: any, index: number) => ReactNode;

    [x: string]: any;
};

const AppGrid: React.FC<AppCardProps> = ({ footerProps, ...rest }) => {
    return (
        <GridView
            {...rest}
            ListFooterComponent={
                footerProps ? <GridFooter footerText={footerProps.footerText} loading={footerProps.loading} /> : null
            }
        />
    );
};

export default AppGrid;
