"use client";

import { initialUrl } from "@lib/constants/AppConst";
import { Button, Result } from "antd";
import Link from "next/link";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: ${({ theme }) => theme.palette.background.paper};
    color: ${({ theme }) => theme.palette.text.primary};
`;

export default function Forbidden() {
    return (
        <Container>
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={
                    <Link href={initialUrl} passHref>
                        <Button type="primary">Back Home</Button>
                    </Link>
                }
            />
        </Container>
    );
}
