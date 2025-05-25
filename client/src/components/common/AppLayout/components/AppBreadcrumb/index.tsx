import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { StyledBreadcrumb } from "./index.styled";

export interface IAppBreadcrumb {}

const breadcrumbNameMap: Record<string, string> = {
    "": "Home",
    dashboard: "Dashboard",
    configuration: "Configuration",
    users: "Users",
    roles: "Roles",
    permissions: "Permissions",
    i18n: "I18n",
    // Add more mappings as needed
};

const AppBreadcrumb: React.FC<IAppBreadcrumb> = () => {
    const pathname = usePathname();
    const pathSnippets = pathname.split("/").filter(i => i);

    const items = [
        {
            href: "/",
            title: <HomeOutlined />,
        },
        ...pathSnippets.map((snippet, idx) => {
            const url = "/" + pathSnippets.slice(0, idx + 1).join("/");
            const isLast = idx === pathSnippets.length - 1;
            return {
                href: isLast ? undefined : url,
                title: breadcrumbNameMap[snippet] || snippet.charAt(0).toUpperCase() + snippet.slice(1),
            };
        }),
    ];

    return (
        <StyledBreadcrumb
            items={items.map(item =>
                item.href ? { ...item, title: <Link href={item.href}>{item.title}</Link> } : item,
            )}
        />
    );
};

export default AppBreadcrumb;
