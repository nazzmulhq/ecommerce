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
    background-color: #f5f5f5;
`;

export default function NotFound() {
    return (
        <Container>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Link href={initialUrl} passHref>
                        <Button type="primary">Back Home</Button>
                    </Link>
                }
            />
        </Container>
    );
}
