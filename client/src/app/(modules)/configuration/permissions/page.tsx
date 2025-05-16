import Permissions from "@components/modules/configuration/permission";
import { getMetaData } from "@lib/actions";
import { Metadata } from "next";
import { FC } from "react";

// Fetch metadata from API
export async function generateMetadata(): Promise<Metadata> {
    return await getMetaData("permissions", {
        title: "Permissions",
        description: "Permissions",
    });
}

export interface IPage {}

const Page: FC<IPage> = async () => {
    return <Permissions />;
};

export default Page;
