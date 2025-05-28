"use client";
import AppContainer from "@components/common/AppContainer";
import DataEntry from "@components/common/AppForm/DataEntry";
import { DataEntryFieldTypes, DependencyType, FormConfig } from "@components/common/AppForm/DataEntry/types";
import { FC } from "react";

export interface IPermissions {}

const Permissions: FC<IPermissions> = () => {
    const formConfig: FormConfig = {
        fields: [
            {
                name: "userType",
                label: "User Type",
                type: DataEntryFieldTypes.RADIO_GROUP,
                options: [
                    { label: "Individual", value: "individual" },
                    { label: "Business", value: "business" },
                ],
                defaultValue: "individual",
            },
            {
                name: "businessName",
                label: "Business Name",
                type: DataEntryFieldTypes.INPUT,
                dependencies: [
                    {
                        type: DependencyType.SHOW,
                        name: "userType",
                        cb: values => values.userType === "business",
                    },
                ],
                rules: [{ required: true, message: "Please enter business name" }],
            },
            {
                name: "phoneVerified",
                label: "Phone Verified",
                type: DataEntryFieldTypes.SWITCH,
                defaultValue: false,
            },
            {
                name: "phoneNumber",
                label: "Phone Number",
                type: DataEntryFieldTypes.INPUT,
                dependencies: [
                    {
                        type: DependencyType.DISABLE,
                        name: "phoneVerified",
                        cb: values => values.phoneVerified === true,
                    },
                    {
                        type: DependencyType.RULES,
                        name: "userType",
                        cb: values => {
                            return values.userType === "business"
                                ? [{ required: true, message: "Business phone is required" }]
                                : [];
                        },
                    },
                ],
            },
            // Field group example
            {
                key: "addressGroup",
                title: "Address Information",
                collapsible: true,
                fields: [
                    {
                        name: "address",
                        label: "Street Address",
                        type: DataEntryFieldTypes.INPUT,
                    },
                    {
                        name: "city",
                        label: "City",
                        type: DataEntryFieldTypes.INPUT,
                    },
                ],
            },
        ],
        layout: "vertical",
        initialValues: {
            userType: "individual",
            phoneVerified: false,
        },
        onFinish: values => {
            console.log("Success:", values);
        },
    };

    return (
        <AppContainer
            title="Permissions Management"
            extra={[
                {
                    key: 1,
                    position: 1,
                    children: "View",
                },
            ]}
        >
            <DataEntry config={formConfig} />
        </AppContainer>
    );
};

export default Permissions;
