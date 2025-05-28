// BackButton.tsx (Client Component)
"use client";

import AppIcons from "@components/common/AppIcons";
import { Button, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import { useIntl } from "react-intl";

export const BackButton: React.FC = () => {
    const router = useRouter();
    const message = useIntl();

    const back = message.formatMessage({ id: "common.back" });

    return (
        <Tooltip title={back}>
            <Button danger icon={<AppIcons name="AiOutlineArrowLeft" />} onClick={() => router.back()}>
                {back}
            </Button>
        </Tooltip>
    );
};
