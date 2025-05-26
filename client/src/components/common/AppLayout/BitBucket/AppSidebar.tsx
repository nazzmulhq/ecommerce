import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import { LayoutDirection } from "@lib/constants/AppEnums";
import { useLayoutContext } from "@lib/context/AppContextProvider/LayoutContextProvider";
import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { RouterConfigData } from "@src/types/Apps";
import AppVerticalNav from "../components/AppVerticalNav";
import UserInfo from "../components/UserInfo";
import BucketMinibar from "./BucketMinibar";
import {
    StyledAppBitbucketDrawer,
    StyledAppBitbucketScrollbar,
    StyledAppBitbucketSidebar,
    StyledAppBitbucketSidebarWrapper,
    StyledBitbucketBtn,
} from "./index.styled";

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

    const [isSidebarClosed, setSidebarClosed] = useState(false);

    const onSidebarClosed = () => {
        setSidebarClosed(!isSidebarClosed);
    };

    const sideBarComponent = () => {
        return (
            <StyledAppBitbucketSidebar
                className={clsx("app-BitBucket-sidebar", {
                    "bitBucket-sidebar-img-background": allowSidebarBgImage,
                })}
                collapsible
            >
                <UserInfo hasColor />
                <StyledAppBitbucketScrollbar scrollToTop={false}>
                    <AppVerticalNav />
                </StyledAppBitbucketScrollbar>
            </StyledAppBitbucketSidebar>
        );
    };

    return (
        <>
            <StyledAppBitbucketDrawer
                closable={false}
                onClose={onClose}
                open={visible}
                placement={direction === LayoutDirection.LTR ? "left" : "right"}
            >
                <StyledAppBitbucketSidebarWrapper className="app-BitBucket-sidebar-wrapper">
                    <BucketMinibar />
                    {sideBarComponent()}
                </StyledAppBitbucketSidebarWrapper>
            </StyledAppBitbucketDrawer>
            <StyledAppBitbucketSidebarWrapper
                className={clsx("app-BitBucket-sidebar-wrapper", {
                    "app-BitBucket-sidebar-wrapper-close": isSidebarClosed,
                })}
            >
                <BucketMinibar />
                {sideBarComponent()}
                <StyledBitbucketBtn onClick={onSidebarClosed}>
                    {isSidebarClosed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
                </StyledBitbucketBtn>
            </StyledAppBitbucketSidebarWrapper>
        </>
    );
};

export default AppSidebar;
