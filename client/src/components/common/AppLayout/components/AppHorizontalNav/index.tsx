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

    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split("/")[0];
    return routesConfig ? (
        <Menu
            className={className}
            defaultOpenKeys={[defaultOpenKeys]}
            mode="horizontal"
            selectedKeys={[selectedKeys.split("/").join(":")]}
        >
            {getRouteHorMenus(routesConfig)}
        </Menu>
    ) : (
        <></>
    );
};

export default AppHorizontalNav;
