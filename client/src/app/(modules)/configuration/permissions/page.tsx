import Permissions from "@components/modules/configuration/permission";
import { getMetaData } from "@lib/actions";
import { Metadata } from "next";
import { FC } from "react";

// Fetch metadata from API
export async function generateMetadata(): Promise<Metadata> {
    return await getMetaData("permissions", {});
}

export interface IPage {
    params?: { [key: string]: string | string[] };
    searchParams?: Promise<{ [key: string]: string | string[] }>;
}

const Page: FC<IPage> = async () => {
    return (
        <>
            <Permissions />
        </>
    );
};

export default Page;
