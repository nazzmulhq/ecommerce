import Role from "@components/modules/configuration/role";
import { getMetaData } from "@lib/actions";
import { Metadata } from "next";
import { FC } from "react";

export async function generateMetadata(): Promise<Metadata> {
    return await getMetaData("roles", {});
}

export interface IPage {}

const Page: FC<IPage> = () => {
    return (
        <section>
            <Role />
        </section>
    );
};

export default Page;
