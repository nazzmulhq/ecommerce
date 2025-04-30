"use client";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Breadcrumb, Button, GetProp, Layout, Menu, MenuProps, Select, theme, Typography } from "antd";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { IRoute } from "../../types";

const { Header, Content, Footer, Sider } = Layout;

const siderStyle: React.CSSProperties = {
    overflow: "auto",
    height: "100vh",
    position: "sticky",
    insetInlineStart: 0,
    top: 65,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
};

const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    position: "sticky",
    insetInlineStart: 0,
    top: 0,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    zIndex: 10,
    width: "100%",
    padding: "0 24px",
    height: 64,
};

interface ILayoutsProps {
    children: React.ReactNode;
    token: string | undefined;
}
type MenuItem = GetProp<MenuProps, "items">[number];

const Layouts: React.FC<ILayoutsProps> = ({ children, token }) => {
    const [routes, setRoutes] = React.useState<IRoute[]>([]);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const pathname = usePathname();
    const param = useParams();
    const router = useRouter();
    const { lang } = param;

    console.log("token", token);

    // Fetch routes
    const fetchRoutes = async (token: string | undefined) => {
        const rest = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/route/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
        const data = await rest.json();
        setRoutes(data || []);
    };

    useEffect(() => {
        fetchRoutes(token);
    }, [token]);

    // Remove the language code from the pathname
    let pathSnippets = pathname.split("/");
    pathSnippets = pathSnippets.filter(path => path !== lang);

    // without layout routes
    const withoutLayoutRoutes = ["login", "register"];
    const isWithoutLayoutRoute = withoutLayoutRoutes.some(route => pathname.includes(route));
    if (isWithoutLayoutRoute) {
        return <>{children}</>;
    }
    // breadcrumb items
    const breadcrumbItems = pathSnippets.map((path, index, total) => {
        const url = `${pathSnippets.slice(0, index + 1).join("/")}`;
        let title: string | React.ReactNode = path;
        if (index === 0) {
            title = (
                <Link className="capitalize" href="/">
                    Home
                </Link>
            );
        } else if (index === total.length - 1) {
            title = path.replace(/-/g, " ");
        } else {
            title = (
                <Link className="capitalize" href={url}>
                    {path}
                </Link>
            );
        }
        return {
            key: String(index + 1),
            title: title,
        };
    });

    const mapRoutes: MenuItem[] = [];
    routes.forEach(route => {
        if (route.type === "protected") {
            mapRoutes.push({
                key: route.id.toString(),
                label: (
                    <Link className="capitalize" href={`/${lang}${route.path}`}>
                        {route.name}
                    </Link>
                ),
            });
        }
    });

    return (
        <Layout>
            <Header style={headerStyle}>
                <Typography.Title level={3} style={{ color: "black", margin: 0 }}>
                    <Link href={`/${lang}/`}>Logo</Link>
                </Typography.Title>
                <Menu
                    defaultSelectedKeys={["2"]}
                    items={[
                        {
                            key: "4",
                            label: <Link href={`/${lang}/routes`}>Routes</Link>,
                        },
                        {
                            key: "3",
                            label: <Link href={`/${lang}/i18n`}>i18n</Link>,
                        },
                        {
                            key: "2",
                            label: (
                                <Select
                                    defaultValue={lang}
                                    onChange={value => {
                                        const url = pathname.replace(`/${lang}`, `/${value}`);
                                        router.push(url);
                                        router.refresh();
                                    }}
                                    options={[
                                        { value: "en", label: "English" },
                                        { value: "bn", label: "Bangla" },
                                    ]}
                                    style={{ width: 90 }}
                                    value={lang}
                                />
                            ),
                        },

                        {
                            key: "1",
                            label: (
                                <Link href={`/${lang}/`}>
                                    <Avatar icon={<UserOutlined />} />
                                </Link>
                            ),
                        },
                    ]}
                    mode="horizontal"
                    theme="light"
                />
            </Header>
            <Layout hasSider>
                <Sider style={siderStyle}>
                    <Menu defaultSelectedKeys={["4"]} items={mapRoutes} mode="inline" theme="dark" />
                </Sider>
                <Layout>
                    <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
                        <div className="flex justify-between items-center mb-5">
                            <Breadcrumb items={breadcrumbItems} />
                            <Button icon={<ArrowLeftOutlined />} type="default">
                                back
                            </Button>
                        </div>

                        <main
                            style={{
                                padding: 24,
                                textAlign: "center",
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                                minHeight: "100%",
                            }}
                        >
                            {children}
                        </main>
                    </Content>
                    <Footer style={{ textAlign: "center" }}>
                        Ant Design ©{new Date().getFullYear()} Created by Ant UED
                    </Footer>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default Layouts;
