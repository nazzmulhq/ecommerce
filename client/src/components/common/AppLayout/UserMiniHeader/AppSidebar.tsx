import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import collapseMotion from "antd/lib/_util/motion";
import clsx from "clsx";
import AppVerticalMenu from "../components/AppVerticalNav";
import { StyledAppScrollBarMini, StyledUserMiniSidebar } from "./index.styled";

type Props = {
    routesConfig: RouterConfigData[];
};

const AppSidebar = ({ routesConfig }: Props) => {
    const { allowSidebarBgImage } = useSidebarContext();

    return (
        <StyledUserMiniSidebar
            breakpoint="lg"
            className={clsx({
                "userMiniHeader-sidebar-img-background": allowSidebarBgImage,
            })}
            collapsed={collapseMotion}
        >
            <StyledAppScrollBarMini scrollToTop={false}>
                <AppVerticalMenu />
            </StyledAppScrollBarMini>
        </StyledUserMiniSidebar>
    );
};

export default AppSidebar;
