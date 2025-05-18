import { RouterConfigData } from "@src/types/Apps";
import { Menu } from "antd";
import { usePathname } from "next/navigation";
import { getRouteHorMenus } from "./HorizontalMenuUtils";

type AppHorizontalNavProps = {
    className?: string;
    routesConfig?: RouterConfigData[];
};
const AppHorizontalNav = ({ className, routesConfig }: AppHorizontalNavProps) => {
    const pathname = usePathname();

    const defaultOpenKeys = pathname.split("/")[0];
    return routesConfig ? (
        <Menu
            className={className}
            defaultOpenKeys={[defaultOpenKeys]}
            mode="horizontal"
            selectedKeys={[pathname.split("/").join(":")]}
            items={getRouteHorMenus(routesConfig) as any}
        />
    ) : (
        <></>
    );
};

export default AppHorizontalNav;
