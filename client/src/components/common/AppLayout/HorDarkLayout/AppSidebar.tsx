import clsx from "clsx";
import { usePathname } from "next/navigation";

import { LayoutDirection } from "@lib/constants/AppEnums";
import { useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import { useEffect } from "react";
import AppVerticalMenu from "../components/AppVerticalNav";
import UserInfo from "../components/UserInfo";
import { StyledAppHorDarkDrawer, StyledAppMainHorDarkSidebar, StyledAppScrollbar } from "./index.styled";

type Props = {
    visible: boolean;
    onClose: () => void;
    routesConfig: RouterConfigData[];
};

const AppSidebar = ({ visible, onClose, routesConfig }: Props) => {
    const { allowSidebarBgImage } = useSidebarContext();
    const { direction } = useLayoutContext();
    const pathname = usePathname();

    useEffect(() => {
        onClose();
    }, [pathname]);

    return (
        <StyledAppHorDarkDrawer
            closable={false}
            onClose={onClose}
            open={visible}
            placement={direction === LayoutDirection.LTR ? "left" : "right"}
        >
            <StyledAppMainHorDarkSidebar
                className={clsx({
                    "hor-dark-sidebar-img-background": allowSidebarBgImage,
                })}
                collapsible
            >
                <UserInfo />
                <StyledAppScrollbar scrollToTop={false}>
                    <AppVerticalMenu routesConfig={routesConfig} />
                </StyledAppScrollbar>
            </StyledAppMainHorDarkSidebar>
        </StyledAppHorDarkDrawer>
    );
};

export default AppSidebar;
