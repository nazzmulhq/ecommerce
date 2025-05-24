/* eslint-disable react-hooks/rules-of-hooks */

import AppIcons from "@components/common/AppIcons";
import { allowMultiLanguage } from "@lib/constants/AppConst";
import { SidebarData } from "@lib/constants/defaultConfig";
import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { isArrayOrObjectEmpty } from "@lib/utils/Common";
import { RouterConfigData } from "@src/types/Apps";
import { TIconName } from "@src/types/iconName";
import { Menu, MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useIntl } from "react-intl";
import MemoizedFormattedMessage from "react-intl/src/components/message";

function getStyles(item: RouterConfigData, sidebarColorSet: SidebarData, index: number) {
    const pathname = usePathname();
    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split("/");

    const isOpen = defaultOpenKeys[index] === item.id;
    return {
        color: isOpen ? sidebarColorSet.sidebarMenuSelectedTextColor : sidebarColorSet.sidebarTextColor,
        backgroundColor: isOpen ? sidebarColorSet.sidebarMenuSelectedBgColor : sidebarColorSet.sidebarBgColor,
    };
}

const renderMenuItemChildren = (item: RouterConfigData) => {
    const { icon, messageId, path } = item;
    const { messages } = useIntl();

    if (path && path.includes("/")) {
        return (
            <Link href={path}>
                {icon &&
                    (React.isValidElement(icon) ? (
                        <span className="ant-menu-item-icon">{icon}</span>
                    ) : (
                        <span className="ant-menu-item-icon" />
                    ))}
                <span data-testid={messageId.toLowerCase + "-nav"}>
                    {allowMultiLanguage ? (messages[messageId] as string) : item.title}
                </span>
            </Link>
        );
    }

    return (
        <>
            {icon &&
                (React.isValidElement(icon) ? (
                    <span className="ant-menu-item-icon">{icon}</span>
                ) : (
                    <span className="ant-menu-item-icon" />
                ))}
            <span data-testid={messageId.toLowerCase + "-nav"}>
                {allowMultiLanguage ? (messages[messageId] as string) : item.title}
            </span>
        </>
    );
};

const renderMenuItem = (item: RouterConfigData, sidebarColorSet: SidebarData, index: number) => {
    return item.type === "collapse" ? (
        <Menu.SubMenu
            key={item.path ? item.path : item.id}
            style={getStyles(item, sidebarColorSet, index)}
            title={renderMenuItemChildren(item)}
        >
            {item?.children?.map(item => renderMenuItem(item, sidebarColorSet, index + 1))}
        </Menu.SubMenu>
    ) : (
        <Menu.Item key={item.id} style={getStyles(item, sidebarColorSet, index)}>
            {item.children ? item.children : (renderMenuItemChildren(item) as any)}
        </Menu.Item>
    );
};

const renderHorMenu = (item: RouterConfigData, sidebarColorSet: SidebarData, index: number) => {
    return item.type === "group" ? (
        <Menu.SubMenu
            key={item.path ? item.path : item.id}
            style={getStyles(item, sidebarColorSet, index)}
            title={renderMenuItemChildren(item)}
        >
            {item?.children?.map(item => renderMenuItem(item, sidebarColorSet, index + 1))}
        </Menu.SubMenu>
    ) : (
        <Menu.Item
            key={item.id}
            // exact={item.exact}
            style={getStyles(item, sidebarColorSet, index)}
        >
            {item?.children ? item?.children : (renderMenuItemChildren(item) as any)}
        </Menu.Item>
    );
};

export const getRouteHorMenus = (routesConfig: RouterConfigData[]) => {
    const { sidebarColorSet } = useSidebarContext();
    return routesConfig.map(route => renderHorMenu(route, sidebarColorSet, 0));
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
