// BackButton.tsx (Client Component)
"use client";

import AppIcons from "@components/common/AppIcons";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

export const BackButton: React.FC = () => {
    const router = useRouter();

    return (
        <Button icon={<AppIcons name="AiOutlineArrowLeft" />} onClick={() => router.back()}>
            Back
        </Button>
    );
};
