"use client";

import HomePage from "@components/modules/home";
import { FC } from "react";

export interface IComponent {}

const Page: FC<IComponent> = () => {
    return <HomePage />;
};

export default Page;
