import { Grid } from "antd";
import React, { CSSProperties, ReactNode, useEffect, useState } from "react";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

import { useThemeContext } from "@lib/context/AppContextProvider/ThemeContextProvider";
import AppAnimateGroups from "../AppAnimateGroup";
import { StyledGridColumnCount, StyledGridContainer } from "./index.styled";
type GridViewProps = {
    width?: string;
    responsive?: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
    };
    itemPadding?: number;
    renderItem: (item: any, index: number) => ReactNode;
    border?: boolean;
    column?: number;
    containerStyle?: CSSProperties;
    ListEmptyComponent?: ReactNode;
    ListFooterComponent?: ReactNode;
    data?: any[];
    onEndReached?: () => void;

    [x: string]: any;
};

const { useBreakpoint } = Grid;
const getEmptyContainer = (ListEmptyComponent: any) => {
    if (ListEmptyComponent) {
        return React.isValidElement(ListEmptyComponent) ? ListEmptyComponent : <ListEmptyComponent />;
    }
    return null;
};

const getFooterContainer = (ListFooterComponent: any) => {
    if (ListFooterComponent) {
        return React.isValidElement(ListFooterComponent) ? ListFooterComponent : <ListFooterComponent />;
    }
    return null;
};

const GridView: React.FC<GridViewProps> = ({
    column = 3,
    responsive,
    itemPadding = 12,
    renderItem,
    onEndReached,
    data = [],
    containerStyle,
    border = false,
    animation,
    ListFooterComponent,
    ListEmptyComponent,
    ...rest
}) => {
    const { theme } = useThemeContext();
    const [displayColumn, setColumn] = useState(column);

    const width = useBreakpoint();
    if (!onEndReached) {
        onEndReached = () => {};
    }

    useEffect(() => {
        setColumn(column);
    }, [column]);

    useEffect(() => {
        const getColumnCount = () => {
            if (responsive) {
                if (width.xxl) {
                    return (
                        responsive.xxl ||
                        responsive.xl ||
                        responsive.lg ||
                        responsive.md ||
                        responsive.sm ||
                        responsive.xs ||
                        column
                    );
                } else if (width.xl) {
                    return responsive.xl || responsive.lg || responsive.md || responsive.sm || responsive.xs || column;
                } else if (width.lg) {
                    return responsive.lg || responsive.md || responsive.sm || responsive.xs || column;
                } else if (width.md) {
                    return responsive.md || responsive.sm || responsive.xs || column;
                } else if (width.sm) {
                    return responsive.sm || responsive.xs || column;
                } else if (width.xs) {
                    return responsive.xs || column;
                }
            } else {
                return column;
            }
        };
        setColumn(getColumnCount() as number);
    }, [width, column, responsive]);

    const borderStyle = {
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 4,
        overflow: "hidden",
    };

    let style = containerStyle;
    if (border) {
        style = { ...style, ...borderStyle };
    }

    useBottomScrollListener(onEndReached, { debounce: 200 });
    return (
        <StyledGridContainer>
            <AppAnimateGroups
                // animateStyle={{
                //   marginLeft: -itemPadding,
                //   marginRight: -itemPadding,
                //   flexDirection: 'row',
                //   flexWrap: 'wrap',
                //   height: 'auto',
                //   ...style,
                // }}
                enter={{
                    animation,
                }}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    margin: -itemPadding,
                    ...style,
                }}
                {...rest}
            >
                {data.length > 0
                    ? data.map((item, index) => (
                          <StyledGridColumnCount
                              key={"grid-" + index}
                              style={{
                                  flexGrow: 0,
                                  maxWidth: `${100 / displayColumn}%`,
                                  flexBasis: `${100 / displayColumn}%`,
                                  padding: itemPadding,
                                  boxSizing: "border-box",
                              }}
                          >
                              {renderItem(item, index)}
                          </StyledGridColumnCount>
                      ))
                    : null}
            </AppAnimateGroups>
            {data.length === 0 ? getEmptyContainer(ListEmptyComponent) : null}
            {getFooterContainer(ListFooterComponent)}
        </StyledGridContainer>
    );
};

export default GridView;

// responsive: {
//   xs: 1,
//   sm: 2,
//   md: 2,
//   lg: 4,
//   xl: 4,
//   xxl: 4,
// },
