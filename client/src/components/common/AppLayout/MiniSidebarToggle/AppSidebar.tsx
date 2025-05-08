import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import clsx from "clsx";
import AppVerticalMenu from "../components/AppVerticalNav";
import UserInfo from "../components/UserInfo";
import { StyledMiniSidebarScrollbar, StyledMiniSidebarToggle } from "./index.styled";

type AppSidebarProps = {
    isCollapsed: boolean;
    routesConfig: RouterConfigData[];
};

const AppSidebar = ({ isCollapsed, routesConfig }: AppSidebarProps) => {
    const { allowSidebarBgImage } = useSidebarContext();

    return (
        <StyledMiniSidebarToggle
            breakpoint="xl"
            className={clsx({
                "mini-sidebar-toggle-img-background": allowSidebarBgImage,
            })}
            collapsed={isCollapsed}
            collapsedWidth="0"
            collapsible
        >
            <UserInfo hasColor />
            <StyledMiniSidebarScrollbar scrollToTop={false}>
                <AppVerticalMenu routesConfig={routesConfig} />
            </StyledMiniSidebarScrollbar>
        </StyledMiniSidebarToggle>
    );
};

export default AppSidebar;
