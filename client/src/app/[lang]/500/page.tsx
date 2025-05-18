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

export default async function InternalServerError() {
    const { lang } = useParams();

    const path = lang ? `/${lang}${initialUrl}` : "";

    return (
        <Container>
            <Result
                status="500"
                title="500"
                subTitle="Sorry, something went wrong on our end."
                extra={
                    <Link href={path} passHref>
                        <Button type="primary">Back Home</Button>
                    </Link>
                }
            />
        </Container>
    );
}
