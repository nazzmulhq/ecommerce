"use client";

import { Button, Result } from "antd";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
`;

export default function ForbiddenPage() {
    const router = useRouter();

    return (
        <Container>
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={
                    <Button type="primary" onClick={() => router.push("/")}>
                        Back Home
                    </Button>
                }
            />
        </Container>
    );
}
