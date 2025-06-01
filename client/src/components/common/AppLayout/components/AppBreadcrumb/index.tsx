"use client";
import AppIcons from "@components/common/AppIcons";
import { getCookie } from "@lib/actions";
import { getRoutes } from "@lib/actions/modules/route";
import { Breadcrumb, Flex, Space } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BackButton } from "./BackButton";
import FormattedMessage from "./FormattedMessage";
import { StyledCard } from "./index.styled";

export interface IAppBreadcrumb {}

interface Route {
    path: string;
    message_id: string;
}

const AppBreadcrumb: React.FC<IAppBreadcrumb> = () => {
    const pathname = usePathname();
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                // Get token from cookies (client-side)
                const token = await getCookie("token");
                const fetchedRoutes = await getRoutes(token, "plain", "client");
                setRoutes(fetchedRoutes);
            } catch (error) {
                console.error("Error fetching routes:", error);
                setRoutes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutes();
    }, []);

    const items = pathname
        .split("/")
        .map((path, index, list) => {
            if (path === "") {
                return {
                    key: index,
                    title: (
                        <Link href="/" passHref>
                            <AppIcons name="AiFillHome" />
                        </Link>
                    ),
                };
            } else {
                const route = routes.find((r: Route) => r?.path?.includes(path));
                if (!route) return null; // Skip if no route found for the path

                if (list.length - 1 === index) {
                    return {
                        key: index,
                        title: <FormattedMessage message_id={route?.message_id} />,
                    };
                }

                return {
                    key: index,
                    title: (
                        <Link href={route?.path} passHref>
                            <FormattedMessage message_id={route?.message_id} />
                        </Link>
                    ),
                };
            }
        })
        .filter(Boolean) as Partial<any>[];

    if (loading) {
        return (
            <StyledCard>
                <Flex justify="space-between" align="center">
                    <Breadcrumb
                        items={[
                            {
                                key: 1,
                                title: (
                                    <Link href="/" passHref>
                                        <AppIcons name="AiFillHome" />
                                    </Link>
                                ),
                            },
                        ]}
                    />
                    <BackButton />
                </Flex>
            </StyledCard>
        );
    }

    return (
        <StyledCard>
            <Flex justify="space-between" align="center">
                <Breadcrumb items={items} />
                <Space>
                    {/* <FilterButton /> */}
                    <BackButton />
                </Space>
            </Flex>
        </StyledCard>
    );
};

export default AppBreadcrumb;
