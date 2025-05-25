import AppIcons from "@components/common/AppIcons";
import { getCookie } from "@lib/actions";
import { getRoutes } from "@lib/actions/route";
import { Breadcrumb, Flex } from "antd";
import { headers } from "next/headers";
import Link from "next/link";
import React from "react";
import { BackButton } from "./BackButton";
import FormattedMessage from "./FormattedMessage";
import { StyledCard } from "./index.styled";

export interface IAppBreadcrumb {}

const AppBreadcrumb: React.FC<IAppBreadcrumb> = async () => {
    const header = headers();
    const pathname = (await header).get("x-pathname") || "";
    const token = (await getCookie("token")) || "";
    const routes = await getRoutes(token, "plain", "server");
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
                const route = routes.find((r: any) => r?.path?.includes(path));
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
        .filter(Boolean) as Partial<any>[]; // <-- Add type assertion here
    return (
        <StyledCard>
            <Flex justify="space-between" align="center">
                <Breadcrumb items={items} />
                <BackButton />
            </Flex>
        </StyledCard>
    );
};

export default AppBreadcrumb;
