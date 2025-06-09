import AppSuspense from "@components/common/AppSuspense";
import Permissions from "@components/modules/configuration/permission";
import { getMetaData } from "@lib/actions";
import { fetchPermissions } from "@lib/actions/modules/permission/permissionActions";
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

const Page: FC<IPage> = async ({ searchParams }) => {
    const data = await fetchPermissions(await searchParams);

    console.log("Permissions data:", data);

    return (
        <AppSuspense>
            <Permissions data={data} />
        </AppSuspense>
    );
};

export default Page;
