import { MenuStyle, ThemeMode } from "@lib/constants/AppEnums";
import defaultConfig from "@lib/constants/defaultConfig";
import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { useThemeContext } from "@lib/context/AppContextProvider/ThemeContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { StyledVerticalNav } from "./index.styled";
import { getRouteMenus } from "./VerticalMenuUtils";

type Props = {
    routesConfig: RouterConfigData[];
};

const AppVerticalNav: React.FC<Props> = ({ routesConfig }) => {
    const { menuStyle, sidebarColorSet } = useSidebarContext();
    const { themeMode } = useThemeContext();
    const pathname = usePathname();
    const selectedKeys = pathname.substr(1);
    const [openKeys, setOpenKeys] = useState([selectedKeys?.[0]]);
    const defaultOpenKeys = selectedKeys?.split("/")[1];

    useEffect(() => {
        if (pathname && document.getElementById(pathname)) {
            setTimeout(() => {
                document.getElementById(pathname)?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 1);
        }
    }, [pathname]);

    const onOpenChange = (keys: string[]) => {
        const latestOpenKey = keys.find((key: string) => openKeys.indexOf(key) === -1);
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    };

    const { messages } = useIntl();

    // Convert the menu items to the correct type
    const menuItems = React.useMemo(() => {
        try {
            return getRouteMenus(routesConfig, messages);
        } catch (error) {
            console.error("Error generating menu items:", error);
            return [];
        }
    }, [routesConfig, messages]);

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
            defaultOpenKeys={[defaultOpenKeys]}
            defaultSelectedKeys={[selectedKeys[selectedKeys.length - 1]]}
            items={menuItems as any} // Using type assertion as a temporary solution
            mode="inline"
            onOpenChange={onOpenChange}
            openKeys={openKeys}
            // selectedKeys={selectedKeys.split("/")}
            selectedKeys={[selectedKeys[selectedKeys.length - 1]]}
            theme={themeMode === ThemeMode.DARK ? ThemeMode.DARK : ThemeMode.LIGHT}
        />
    );
};

export default AppVerticalNav;
