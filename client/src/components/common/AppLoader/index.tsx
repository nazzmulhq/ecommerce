"use client";
import { Spin } from "antd";
import styled from "styled-components";

const StyledAppLoader = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
`;

const AppLoader = () => {
    return (
        <StyledAppLoader>
            <Spin />
        </StyledAppLoader>
    );
};

export default AppLoader;

export const StyledLayoutLoadingSkeleton = styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.palette.background.default};

    .header {
        height: 64px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        background-color: ${({ theme }) => theme.palette.background.paper};
        border-bottom: 1px solid ${({ theme }) => theme.palette.borderColor};

        .logo,
        .avatar,
        .search {
            background: ${({ theme }) => theme.palette.background.default};
            animation: shimmer 1.6s infinite;
            border-radius: 4px;
        }

        .logo {
            width: 120px;
            height: 32px;
        }

        .avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }

        .search {
            margin-left: auto;
            width: 140px;
            height: 36px;

            @media screen and (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
                width: 165px;
            }
        }

        .group {
            display: flex;
            align-items: center;
            width: 100%;
            gap: 10px;

            .logo,
            .avatar,
            .search {
                background: ${({ theme }) => theme.palette.background.default};
                animation: shimmer 1.6s infinite;
                border-radius: 4px;
            }

            .logo {
                width: 120px;
                height: 32px;
            }

            .avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
            }

            .search {
                margin-left: auto;
                width: 140px;
                height: 36px;

                @media screen and (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
                    width: 165px;
                }
            }
        }
    }

    .content {
        flex: 1;
        display: flex;

        .sidebar {
            display: none;
            width: 280px;
            padding: 20px;
            flex-shrink: 0;
            background-color: ${({ theme }) => theme.palette.background.paper};
            border-right: 1px solid ${({ theme }) => theme.palette.borderColor};

            @media screen and (min-width: ${({ theme }) => theme.breakpoints.xl}px) {
                display: block;
            }

            .sidebar-item {
                height: 24px;
                margin-bottom: 15px;
                border-radius: 6px;
                background: linear-gradient(
                    90deg,
                    ${({ theme }) => theme.palette.background.default} 25%,
                    ${({ theme }) => theme.palette.background.paper} 50%,
                    ${({ theme }) => theme.palette.background.default} 75%
                );
                background-size: 200% 100%;
                animation: shimmer 1.6s infinite;
            }
        }

        .main {
            flex: 1;
            margin: 20px;
            height: calc(100vh - 96px);
            background-color: ${({ theme }) => theme.palette.background.paper};
            border-radius: 8px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
            background: linear-gradient(
                90deg,
                ${({ theme }) => theme.palette.background.default} 25%,
                ${({ theme }) => theme.palette.background.paper} 50%,
                ${({ theme }) => theme.palette.background.default} 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.6s infinite;

            .content-block {
                height: 120px;
                border-radius: 8px;
                background: linear-gradient(
                    90deg,
                    ${({ theme }) => theme.palette.background.default} 25%,
                    ${({ theme }) => theme.palette.background.paper} 50%,
                    ${({ theme }) => theme.palette.background.default} 75%
                );
                background-size: 200% 100%;
                animation: shimmer 1.6s infinite;
            }
        }
    }

    @keyframes shimmer {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
`;
