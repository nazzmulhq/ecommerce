import Link from "next/link";
import { FC } from "react";

export interface IPage {}

const Page: FC<IPage> = () => {
    return (
        <main>
            <Link href="/configuration/users/">
                <button className="btn btn-primary">Users</button>
            </Link>
        </main>
    );
};

export default Page;
