// BackButton.tsx (Client Component)
"use client";

import AppIcons from "@components/common/AppIcons";
import { Button, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

export const BackButton: React.FC = () => {
    const router = useRouter();

    return (
        <Tooltip title="Back">
            <Button danger icon={<AppIcons name="AiOutlineArrowLeft" />} onClick={() => router.back()}>
                Back
            </Button>
        </Tooltip>
    );
};
