import { LayoutDirection } from "@lib/constants/AppEnums";
import { useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import AppVerticalNav from "../components/AppVerticalNav";
import UserInfo from "../components/UserInfo";
import { StyledAppHeaderDrawerFixed, StyledAppHorHeaderFixedSidebar, StyledAppHorScrollbar } from "./index.styled";

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
        <StyledAppHeaderDrawerFixed
            closable={false}
            onClose={onClose}
            open={visible}
            placement={direction === LayoutDirection.LTR ? "left" : "right"}
        >
            <StyledAppHorHeaderFixedSidebar
                className={clsx({
                    "hor-header-fixed-sidebar-img-background": allowSidebarBgImage,
                })}
                collapsible
            >
                <UserInfo />
                <StyledAppHorScrollbar scrollToTop={false}>
                    <AppVerticalNav />
                </StyledAppHorScrollbar>
            </StyledAppHorHeaderFixedSidebar>
        </StyledAppHeaderDrawerFixed>
    );
};

export default AppSidebar;
