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
    // Resolve searchParams and normalize them
    const resolvedSearchParams = await searchParams;
    const normalizedSearchParams: Record<string, string> = {};

    // Convert searchParams to a normalized format
    if (resolvedSearchParams) {
        Object.entries(resolvedSearchParams).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                normalizedSearchParams[key] = value[0]; // Take first value if array
            } else if (value) {
                normalizedSearchParams[key] = value;
            }
        });
    }

    // Set default pagination if not provided
    if (!normalizedSearchParams.page) {
        normalizedSearchParams.page = "1";
    }
    if (!normalizedSearchParams.pageSize && !normalizedSearchParams.limit) {
        normalizedSearchParams.pageSize = "10";
    }

    // Fetch initial data with search parameters
    const data = await fetchPermissions(normalizedSearchParams);

    console.log("Permissions data:", data);
    console.log("Search params:", normalizedSearchParams);

    return (
        <AppSuspense>
            <Permissions data={data} searchParams={normalizedSearchParams} />
        </AppSuspense>
    );
};

export default Page;
