"use client";

import { initialUrl } from "@lib/constants/AppConst";
import { Button, Result } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: ${({ theme }) => theme.palette.background.paper};
    color: ${({ theme }) => theme.palette.text.primary};
`;

export default async function Forbidden() {
    const { lang } = useParams();

    const path = lang ? `/${lang}${initialUrl}` : "";

    return (
        <Container>
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={
                    <Link href={path} passHref>
                        <Button type="primary">Back Home</Button>
                    </Link>
                }
            />
        </Container>
    );
}
