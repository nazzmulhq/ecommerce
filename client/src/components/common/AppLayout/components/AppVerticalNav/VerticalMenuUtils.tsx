"use client";
import AppIcons from "@components/common/AppIcons";
import { isArrayOrObjectEmpty } from "@lib/utils/Common";
import { RouterConfigData } from "@src/types/Apps";
import { TIconName } from "@src/types/iconName";
import { MenuProps } from "antd";
import Link from "next/link";
import React from "react";
import { MessageFormatElement } from "react-intl";
import MemoizedFormattedMessage from "react-intl/src/components/message";

const renderMenuItemChildren = (
    item: RouterConfigData,
    messages: Record<string, string> | Record<string, MessageFormatElement[]>,
) => {
    const { icon, messageId, path } = item;

    if (path && path.includes("/")) {
        return {
            key: item.id,
            icon:
                icon &&
                (React.isValidElement(icon) ? (
                    <span className="ant-menu-item-icon">{icon}</span>
                ) : (
                    <span className="ant-menu-item-icon" />
                )),
            label: (
                <Link href={path}>
                    <span data-testid={messageId.toLowerCase + "-nav"}>{messages[messageId] as string}</span>
                </Link>
            ),
        };
    }

    return {
        key: item.id,
        icon:
            icon &&
            (React.isValidElement(icon) ? (
                <span className="ant-menu-item-icon">{icon}</span>
            ) : (
                <span className="ant-menu-item-icon" />
            )),
        label: <span data-testid={messageId.toLowerCase + "-nav"}>{messages[messageId] as string}</span>,
    };
};

const renderMenuItem: any = (
    item: RouterConfigData,
    messages: Record<string, string> | Record<string, MessageFormatElement[]>,
) => {
    return item.type === "collapse"
        ? {
              ...renderMenuItemChildren(item, messages),
              children: item.children?.map(item => renderMenuItem(item, messages)),
              type: "collapse",
          }
        : {
              ...renderMenuItemChildren(item, messages),
          };
};

const renderMenu = (
    item: RouterConfigData,
    messages: Record<string, string> | Record<string, MessageFormatElement[]>,
) => {
    return item.type === "group"
        ? {
              ...renderMenuItemChildren(item, messages),
              children: item.children?.map(item => renderMenuItem(item, messages)),
              type: "group",
          }
        : {
              exact: item.exact,
              ...renderMenuItemChildren(item, messages),
          };
};

export const getRouteMenus = (
    routesConfig: RouterConfigData[],
    messages: Record<string, string> | Record<string, MessageFormatElement[]>,
) => {
    return routesConfig.map(route => renderMenu(route, messages));
};

interface IRouteItem {
    slug: string;
    name: string;
    icon?: TIconName;
    message_id: string;
    path: string;
    type?: string;
    children?: IRouteItem[];
    parentId: string | null;
    not_show_in_menu?: boolean;
}
export type TMenuItem = Required<MenuProps>["items"][number];

/**
 * Recursively traverses the route configuration and returns all nested items as a flat array
 * @param routes - The route configuration to traverse
 * @param isAuthenticated - Flag to determine if user is authenticated
 * @returns A flattened array containing all route items at any nesting level
 */
export const getMenuItems = (routes: IRouteItem[]): TMenuItem[] => {
    if (!routes || routes.length === 0) {
        return [];
    }

    // Filter out root items but keep their children
    const filteredRoutes = routes.flatMap(item => {
        if (item.parentId === null) {
            return item.children || [];
        }
        return [item];
    });

    return filteredRoutes
        .filter(item => {
            // Filter out protected routes if user is not authenticated
            return item.type === "protected" && !item.not_show_in_menu;
        })
        .map(item => {
            // Create the icon element once to avoid repetition
            const iconElement = item.icon ? (
                <span className="ant-menu-item-icon">
                    <AppIcons name={item.icon} size={20} />
                </span>
            ) : (
                <span className="ant-menu-item-icon" />
            );

            // Create the label element once to avoid repetition
            const labelElement = isArrayOrObjectEmpty(item.children) ? (
                <Link href={item.path}>
                    <MemoizedFormattedMessage
                        data-testid={`${item.message_id.toLowerCase()}-nav`}
                        id={item.message_id}
                        defaultMessage={item.message_id as string}
                        values={{ name: item.message_id }}
                        tagName="span"
                    />
                </Link>
            ) : (
                <MemoizedFormattedMessage
                    data-testid={`${item.message_id.toLowerCase()}-nav`}
                    id={item.message_id}
                    defaultMessage={item.message_id as string}
                    values={{ name: item.message_id }}
                    tagName="span"
                />
            );

            // Base menu item properties
            const menuItem: TMenuItem = {
                key: item.slug,
                icon: iconElement,
                label: labelElement,
            };

            if (!isArrayOrObjectEmpty(item.children)) {
                return {
                    ...menuItem,
                    children: getMenuItems(item.children as IRouteItem[]),
                };
            }
            return menuItem;
        });
};
