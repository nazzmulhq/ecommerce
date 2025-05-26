import clsx from "clsx";
import { usePathname } from "next/navigation";

import { LayoutDirection } from "@lib/constants/AppEnums";
import { useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import { useEffect } from "react";
import AppVerticalMenu from "../components/AppVerticalNav";
import UserInfo from "../components/UserInfo";
import { StyledAppHorDrawer, StyledAppSidebarHorScrollbar, StyledHorMainSidebar } from "./index.styled";

type AppSidebarProps = {
    visible: boolean;
    onClose: () => void;
    routesConfig: RouterConfigData[];
};

const AppSidebar = ({ visible, onClose, routesConfig }: AppSidebarProps) => {
    const { allowSidebarBgImage } = useSidebarContext();
    const { direction } = useLayoutContext();
    const pathname = usePathname();

    useEffect(() => {
        onClose();
    }, [pathname]);

    return (
        <StyledAppHorDrawer
            closable={false}
            onClose={onClose}
            open={visible}
            placement={direction === LayoutDirection.LTR ? "left" : "right"}
        >
            <StyledHorMainSidebar
                className={clsx({
                    "hor-sidebar-img-background": allowSidebarBgImage,
                })}
                collapsible
            >
                <UserInfo />
                <StyledAppSidebarHorScrollbar scrollToTop={false}>
                    <AppVerticalMenu />
                </StyledAppSidebarHorScrollbar>
            </StyledHorMainSidebar>
        </StyledAppHorDrawer>
    );
};

export default AppSidebar;
