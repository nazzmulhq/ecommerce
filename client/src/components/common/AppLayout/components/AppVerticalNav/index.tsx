import { getCookie } from "@lib/actions";
import { getRoutes } from "@lib/actions/auth/login";
import { MenuStyle, ThemeMode } from "@lib/constants/AppEnums";
import defaultConfig from "@lib/constants/defaultConfig";
import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { useThemeContext } from "@lib/context/AppContextProvider/ThemeContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { StyledVerticalNav } from "./index.styled";
import { getMenuItems, TMenuItem } from "./VerticalMenuUtils";

type Props = {
    routesConfig: RouterConfigData[];
};

const AppVerticalNav: React.FC<Props> = ({ routesConfig }) => {
    const { menuStyle, sidebarColorSet } = useSidebarContext();
    const { themeMode } = useThemeContext();
    const pathname = usePathname();
    const [menuItems, setMenuItems] = useState<TMenuItem[]>([]);
    const [openKeys, setOpenKeys] = useState(pathname.split("/").splice(1));

    useEffect(() => {
        if (pathname && document.getElementById(pathname)) {
            setTimeout(() => {
                document.getElementById(pathname)?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 1);
        }
    }, [pathname]);

    const onOpenChange = (keys: string[]): void => {
        // If the current key array contains a key that isn't in the previous state,
        // add it to openKeys
        if (keys.length > openKeys.length) {
            setOpenKeys(keys);
        } else {
            // If we're closing a submenu (clicking on an already open one)
            const latestClosedKey = openKeys.find((key: string) => keys.indexOf(key) === -1);
            if (latestClosedKey) {
                // Filter out the key that was just closed
                setOpenKeys(openKeys.filter((key: string) => key !== latestClosedKey));
            } else {
                // If keys is empty, close all
                setOpenKeys(keys);
            }
        }
    };

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const token = await getCookie("token");
                const response = await getRoutes(token, "nested", "client");
                const formatMenuItems = getMenuItems(response);

                if (response) {
                    setMenuItems(formatMenuItems);
                }
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        };

        fetchMenuItems();
    }, []);

    return (
        <StyledVerticalNav
            className={clsx({
                "rounded-menu": menuStyle === MenuStyle.ROUNDED,
                "rounded-menu-reverse": menuStyle === MenuStyle.ROUNDED_REVERSE,
                "standard-menu": menuStyle === MenuStyle.STANDARD,
                "default-menu": menuStyle === MenuStyle.DEFAULT,
                "rounded-menu curved-menu": menuStyle === MenuStyle.CURVED_MENU,
                "bg-color-menu": sidebarColorSet.sidebarBgColor !== defaultConfig.sidebar.colorSet.sidebarBgColor,
                "menu-rounded": menuStyle === MenuStyle.ROUNDED,
                "menu-rounded rounded-menu-reverse": menuStyle === MenuStyle.ROUNDED_REVERSE,
                "menu-rounded standard-menu": menuStyle === MenuStyle.STANDARD,
                "menu-rounded curved-menu": menuStyle === MenuStyle.CURVED_MENU,
            })}
            color={sidebarColorSet?.sidebarMenuSelectedTextColor}
            defaultOpenKeys={[pathname]}
            defaultSelectedKeys={[pathname]}
            items={menuItems as any} // Using type assertion as a temporary solution
            mode="inline"
            onOpenChange={onOpenChange}
            openKeys={openKeys}
            selectedKeys={pathname.split("/")}
            theme={themeMode === ThemeMode.DARK ? ThemeMode.DARK : ThemeMode.LIGHT}
        />
    );
};

export default AppVerticalNav;
