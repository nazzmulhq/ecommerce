import { getCookie } from "@lib/actions";
import { getRoutes } from "@lib/actions/route";
import { RouterConfigData } from "@src/types/Apps";
import { Menu } from "antd";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getMenuItems, getRouteHorMenus, TMenuItem } from "./HorizontalMenuUtils";

type AppHorizontalNavProps = {
    className?: string;
    routesConfig?: RouterConfigData[];
};
const AppHorizontalNav = ({ className, routesConfig }: AppHorizontalNavProps) => {
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

    const defaultOpenKeys = pathname.split("/")[0];
    return routesConfig ? (
        <Menu
            className={className}
            defaultOpenKeys={[pathname]}
            defaultSelectedKeys={[pathname]}
            mode="horizontal"
            items={getRouteHorMenus(routesConfig) as any}
            onOpenChange={onOpenChange}
            openKeys={openKeys}
            selectedKeys={pathname.split("/")}
        />
    ) : (
        <></>
    );
};

export default AppHorizontalNav;
