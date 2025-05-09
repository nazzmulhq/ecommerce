import { useSidebarContext } from "@lib/context/AppContextProvider/SidebarContextProvider";
import { useThemeContext } from "@lib/context/AppContextProvider/ThemeContextProvider";
import { Dropdown } from "antd";
import clsx from "clsx";

import { deleteCookie } from "@lib/actions";
import { useRouter } from "next/navigation";
import React from "react";
import { FaChevronDown } from "react-icons/fa";
import {
    StyledCrUserDesignation,
    StyledCrUserInfo,
    StyledCrUserInfoAvatar,
    StyledCrUserInfoContent,
    StyledCrUserInfoInner,
    StyledUserArrow,
    StyledUsername,
    StyledUsernameInfo,
} from "./index.styled";

type UserInfoProps = {
    hasColor?: boolean;
};
const UserInfo: React.FC<UserInfoProps> = ({ hasColor }) => {
    const { themeMode } = useThemeContext();
    const user = {
        displayName: "John Doe",
        email: "john.doe@example.com",
        photoURL: "https://example.com/photo.jpg",
    };

    const router = useRouter();
    const { sidebarColorSet } = useSidebarContext();
    const { allowSidebarBgImage } = useSidebarContext();

    const getUserAvatar = () => {
        if (user.displayName) {
            return user.displayName.charAt(0).toUpperCase();
        }
        if (user.email) {
            return user.email.charAt(0).toUpperCase();
        }
    };

    const logout = async () => {
        deleteCookie("user");
        deleteCookie("token");
        deleteCookie("routes");
        deleteCookie("permissions");
        router.push("/login");
    };

    const items = [
        {
            key: 1,
            label: <div onClick={() => router.push("/my-profile")}>My Profile</div>,
        },
        {
            key: 2,
            label: (
                <div role="button" onClick={logout}>
                    Logout
                </div>
            ),
        },
    ];

    return (
        <>
            {hasColor ? (
                <StyledCrUserInfo
                    className={clsx("cr-user-info", {
                        light: themeMode === "light",
                    })}
                    style={{
                        backgroundColor: allowSidebarBgImage ? "" : sidebarColorSet.sidebarHeaderColor,
                        color: sidebarColorSet.sidebarTextColor,
                    }}
                >
                    <Dropdown
                        menu={{ items }}
                        overlayStyle={{
                            zIndex: 1052,
                            minWidth: 150,
                        }}
                        placement="bottomRight"
                        trigger={["click"]}
                    >
                        <StyledCrUserInfoInner className="ant-dropdown-link">
                            {user.photoURL ? (
                                <StyledCrUserInfoAvatar src={user.photoURL} />
                            ) : (
                                <StyledCrUserInfoAvatar>{getUserAvatar()}</StyledCrUserInfoAvatar>
                            )}
                            <StyledCrUserInfoContent className="cr-user-info-content">
                                <StyledUsernameInfo>
                                    <StyledUsername
                                        className={clsx("text-truncate", {
                                            light: themeMode === "light",
                                        })}
                                    >
                                        {user.displayName ? user.displayName : "admin user "}
                                    </StyledUsername>
                                    <StyledUserArrow className="cr-user-arrow">
                                        <FaChevronDown />
                                    </StyledUserArrow>
                                </StyledUsernameInfo>
                                <StyledCrUserDesignation className="text-truncate">
                                    System Manager
                                </StyledCrUserDesignation>
                            </StyledCrUserInfoContent>
                        </StyledCrUserInfoInner>
                    </Dropdown>
                </StyledCrUserInfo>
            ) : (
                <StyledCrUserInfo
                    className={clsx("cr-user-info", {
                        light: themeMode === "light",
                    })}
                >
                    <Dropdown
                        menu={{ items }}
                        overlayStyle={{
                            zIndex: 1052,
                            minWidth: 150,
                        }}
                        placement="bottomRight"
                        trigger={["click"]}
                    >
                        <StyledCrUserInfoInner className="ant-dropdown-link">
                            {user.photoURL ? (
                                <StyledCrUserInfoAvatar src={user.photoURL} />
                            ) : (
                                <StyledCrUserInfoAvatar>{getUserAvatar()}</StyledCrUserInfoAvatar>
                            )}
                            <StyledCrUserInfoContent className="cr-user-info-content">
                                <StyledUsernameInfo>
                                    <StyledUsername
                                        className={clsx("text-truncate", {
                                            light: themeMode === "light",
                                        })}
                                    >
                                        {user.displayName ? user.displayName : "admin user "}
                                    </StyledUsername>
                                    <StyledUserArrow className="cr-user-arrow">
                                        <FaChevronDown />
                                    </StyledUserArrow>
                                </StyledUsernameInfo>
                                <StyledCrUserDesignation className="text-truncate cr-user-designation">
                                    System Manager
                                </StyledCrUserDesignation>
                            </StyledCrUserInfoContent>
                        </StyledCrUserInfoInner>
                    </Dropdown>
                </StyledCrUserInfo>
            )}
        </>
    );
};

export default UserInfo;
