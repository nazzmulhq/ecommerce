import { RoutePermittedRole } from "@lib/constants/AppEnums";
import { ReactNode } from "react";
export type CountryType = {
    label: string;
    code: string;
    phone: string;
    suggested?: boolean;
};

export type LanguageProps = {
    languageId: string;
    locale: string;
    name: string;
};
export type UserList = {
    id: number;
    name: string;
    image: string;
    skills: string[];
    information: string;
    email: string;
    phone: string;
    website: string;
    charge: number;
    readTime: string;
    shares: string;
    retweets: string;
    topic: string;
};

export type RouterConfigData = {
    id: string;
    title: string;
    messageId: string;
    icon?: string | ReactNode;
    type: "item" | "group" | "collapse" | "divider";
    children?: RouterConfigData[];
    permittedRole?: RoutePermittedRole;
    color?: string;
    path?: string;
    exact?: boolean;
    count?: number;
};
