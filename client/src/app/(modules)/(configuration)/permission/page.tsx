import Permissions from "@components/modules/configuration/permission";
import { getPermissions } from "@lib/actions/permission/permissionActions";
import { FC } from "react";

export interface IPage {
    searchParams?: {
        page?: string;
        pageSize?: string;
        search?: string;
        status?: string;
    };
}

const Page: FC<IPage> = async ({ searchParams }) => {
    // Get page parameters with defaults
    const page = Number(searchParams?.page || 1);
    const pageSize = Number(searchParams?.pageSize || 10);
    const search = searchParams?.search || "";
    const status = searchParams?.status || "";

    // Fetch data server-side
    const { data, total } = await getPermissions({ page, pageSize, search, status });

    return <Permissions initialData={data} initialFilters={{ page, pageSize, search, status }} totalItems={total} />;
};

export default Page;
