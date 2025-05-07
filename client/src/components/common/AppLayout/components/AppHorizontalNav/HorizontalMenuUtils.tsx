/* eslint-disable react-hooks/rules-of-hooks */

import { allowMultiLanguage } from "@lib/constants/AppConst";
import { SidebarData } from "@lib/constants/defaultConfig";
import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import { Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useIntl } from "react-intl";

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
