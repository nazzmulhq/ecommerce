import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import clsx from "clsx";
import AppVerticalMenu from "../components/AppVerticalNav";
import { StyledUserHeaderSidebar, StyledUserSidebarScrollbar } from "./index.styled";

type AppSidebarProps = {
    isCollapsed: boolean;
    routesConfig: RouterConfigData[];
};

const AppSidebar = ({ isCollapsed, routesConfig }: AppSidebarProps) => {
    const { allowSidebarBgImage } = useSidebarContext();

    return (
        <StyledUserHeaderSidebar
            breakpoint="xl"
            className={clsx({
                "userHeader-sidebar-img-background": allowSidebarBgImage,
            })}
            collapsed={isCollapsed}
            collapsible
        >
            <StyledUserSidebarScrollbar scrollToTop={false}>
                <AppVerticalMenu />
            </StyledUserSidebarScrollbar>
        </StyledUserHeaderSidebar>
    );
};

export default AppSidebar;
