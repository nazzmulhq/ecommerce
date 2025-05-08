import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import clsx from "clsx";
import AppVerticalMenu from "../components/AppVerticalNav";
import UserInfo from "../components/UserInfo";
import { StyledAppStandardScrollbar, StyledStandardSidebar } from "./index.styled";

type AppSidebarProps = {
    isCollapsed: boolean;
    routesConfig: RouterConfigData[];
};
const AppSidebar = ({ isCollapsed, routesConfig }: AppSidebarProps) => {
    const { allowSidebarBgImage } = useSidebarContext();

    return (
        <StyledStandardSidebar
            breakpoint="xl"
            className={clsx({
                "standard-sidebar-img-background": allowSidebarBgImage,
            })}
            collapsed={isCollapsed}
            collapsible
        >
            <UserInfo hasColor />
            <StyledAppStandardScrollbar scrollToTop={false}>
                <AppVerticalMenu routesConfig={routesConfig} />
            </StyledAppStandardScrollbar>
        </StyledStandardSidebar>
    );
};

export default AppSidebar;
