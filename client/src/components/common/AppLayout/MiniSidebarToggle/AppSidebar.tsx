"use client";
import { selectIsMenuCollapsed } from "@lib/redux/config/projectConfig";
import { useAppSelector } from "@lib/redux/store";
import AppVerticalMenu from "../components/AppVerticalNav";
import UserInfo from "../components/UserInfo";
import { StyledMiniSidebarScrollbar, StyledMiniSidebarToggle } from "./index.styled";

type AppSidebarProps = {};

const AppSidebar = () => {
    const isMenuCollapsed = useAppSelector(selectIsMenuCollapsed);
    // const { allowSidebarBgImage } = useSidebarContext();

    return (
        <StyledMiniSidebarToggle
            breakpoint="xl"
            // className={clsx({
            //     "mini-sidebar-toggle-img-background": allowSidebarBgImage,
            // })}
            collapsed={isMenuCollapsed}
            collapsedWidth="0"
            collapsible
        >
            <UserInfo hasColor />
            <StyledMiniSidebarScrollbar scrollToTop={false}>
                <AppVerticalMenu />
            </StyledMiniSidebarScrollbar>
        </StyledMiniSidebarToggle>
    );
};

export default AppSidebar;
