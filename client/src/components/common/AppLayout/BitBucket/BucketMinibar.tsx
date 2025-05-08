import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { useThemeContext } from "@lib/context/AppContextProvider/ThemeContextProvider";
import clsx from "clsx";
import Image from "next/image";
import { AiOutlineSearch } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoChatboxOutline } from "react-icons/io5";

import AppLanguageSwitcher from "@components/common/AppLanguageSwitcher";
import {
    StyledAppMinibarMain,
    StyledAppMiniScrollbar,
    StyledBucketMinibar,
    StyledBucketMinibarInner,
    StyledBucketMinibarLink,
    StyledBucketMinibarLogo,
    StyledBucketMinibarSetting,
} from "./index.styled";

const BucketMinibar = () => {
    const { sidebarColorSet } = useSidebarContext();
    const { themeMode } = useThemeContext();
    return (
        <StyledBucketMinibar
            className={clsx({
                dark: themeMode === "dark",
            })}
            style={{
                backgroundColor: sidebarColorSet.sidebarBgColor,
                color: sidebarColorSet.sidebarTextColor,
            }}
        >
            <StyledBucketMinibarInner>
                <StyledBucketMinibarLogo onClick={e => e.preventDefault()}>
                    <Image
                        alt="crema-logo"
                        height={40}
                        src={`${
                            sidebarColorSet.mode === "dark"
                                ? "/assets/images/logo-white.png"
                                : "/assets/images/logo.png"
                        }`}
                        width={31}
                    />
                </StyledBucketMinibarLogo>

                <StyledAppMiniScrollbar scrollToTop={false}>
                    <StyledAppMinibarMain>
                        <StyledBucketMinibarLink onClick={e => e.preventDefault()}>
                            <AiOutlineSearch />
                        </StyledBucketMinibarLink>

                        <AppLanguageSwitcher />

                        <StyledBucketMinibarLink onClick={e => e.preventDefault()}>
                            <IoChatboxOutline />
                        </StyledBucketMinibarLink>
                        <StyledBucketMinibarLink onClick={e => e.preventDefault()}>
                            <IoIosNotificationsOutline />
                        </StyledBucketMinibarLink>
                    </StyledAppMinibarMain>
                    <StyledBucketMinibarSetting>
                        <a onClick={e => e.preventDefault()}>
                            <FiSettings />
                        </a>
                    </StyledBucketMinibarSetting>
                </StyledAppMiniScrollbar>
            </StyledBucketMinibarInner>
        </StyledBucketMinibar>
    );
};

export default BucketMinibar;
