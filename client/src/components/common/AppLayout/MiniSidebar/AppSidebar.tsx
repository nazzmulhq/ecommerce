import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import collapseMotion from "antd/lib/_util/motion";
import clsx from "clsx";
import AppVerticalMenu from "../components/AppVerticalNav";
import UserInfo from "../components/UserInfo";
import { StyledAppSidebarMiniScrollbar, StyledMiniSidebar } from "./index.styled";

type AppSidebarProps = {
    routesConfig: RouterConfigData[];
};

const AppSidebar = ({ routesConfig }: AppSidebarProps) => {
    const { allowSidebarBgImage } = useSidebarContext();

    return (
        <StyledMiniSidebar
            breakpoint="lg"
            className={clsx({
                "mini-sidebar-img-background": allowSidebarBgImage,
            })}
            collapsed={collapseMotion}
        >
            <UserInfo hasColor />
            <StyledAppSidebarMiniScrollbar scrollToTop={false}>
                <AppVerticalMenu routesConfig={routesConfig} />
            </StyledAppSidebarMiniScrollbar>
        </StyledMiniSidebar>
    );
};

export default AppSidebar;
