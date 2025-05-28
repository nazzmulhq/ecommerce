"use client";

import AppIcons from "@components/common/AppIcons";
import { selectIsOpenFilterOption, toggleFilterOption } from "@lib/redux/config/projectConfig";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { Button, Tooltip } from "antd";
import { FC } from "react";
import { useIntl } from "react-intl";

export interface IFilterButton {}

const FilterButton: FC<IFilterButton> = () => {
    const isOpenFilterOption = useAppSelector(selectIsOpenFilterOption);
    const dispatch = useAppDispatch();
    const message = useIntl();
    const filter = message.formatMessage({ id: "common.filter" });
    return (
        <Tooltip title={filter}>
            <Button
                icon={<AppIcons name="AiFillFilter" />}
                onClick={() => dispatch(toggleFilterOption())}
                type={isOpenFilterOption ? "primary" : "default"}
            />
        </Tooltip>
    );
};

export default FilterButton;
