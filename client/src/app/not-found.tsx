"use client";

import { initialUrl } from "@lib/constants/AppConst";
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

export default function NotFound() {
    const router = useRouter();

    return (
        <Container>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Button type="primary" onClick={() => router.push(initialUrl)}>
                        Back Home
                    </Button>
                }
            />
        </Container>
    );
}
