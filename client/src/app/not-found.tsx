"use client";

import { initialUrl } from "@lib/constants/AppConst";
import { Button, Result } from "antd";
import { ExceptionStatusType, ResultStatusType } from "antd/es/result";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: ${({ theme }) => theme.palette.background.paper};
    color: ${({ theme }) => theme.palette.text.primary};
`;

export default function NotFound() {
    // get status code from url
    const pathname = usePathname();

    const path = initialUrl;
    const statusCode = pathname.split("/").pop();
    const result: Record<
        ExceptionStatusType,
        {
            status: string;
            title: string;
            subTitle: string;
            redirectUrl: string;
        }
    > = {
        403: {
            status: "403",
            title: "403",
            subTitle: "Sorry, you are not authorized to access this page.",
            redirectUrl: path,
        },
        404: {
            status: "404",
            title: "404",
            subTitle: "Sorry, the page you visited does not exist.",
            redirectUrl: path,
        },
        500: {
            status: "500",
            title: "500",
            subTitle: "Sorry, something went wrong.",
            redirectUrl: path,
        },
    };

    const props = result[statusCode as keyof typeof result];

    if (!props) {
        return (
            <Container>
                <Result
                    status={result[404].status as ResultStatusType}
                    title={result[404].title}
                    subTitle={result[404].subTitle}
                    extra={
                        <Link href={result[404].redirectUrl} passHref>
                            <Button type="primary">Back Home</Button>
                        </Link>
                    }
                />
            </Container>
        );
    }

    return (
        <Container>
            <Result
                status={props.status as ResultStatusType}
                title={props.title}
                subTitle={props.subTitle}
                extra={
                    <Link href={props.redirectUrl} passHref>
                        <Button type="primary">Back Home</Button>
                    </Link>
                }
            />
        </Container>
    );
}
