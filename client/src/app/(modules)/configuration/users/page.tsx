import Link from "next/link";
import { FC } from "react";

export interface IPage {}

const Page: FC<IPage> = () => {
    return (
        <section>
            <Link href="/configuration/users/1">
                <button className="btn btn-primary">Create User</button>
            </Link>
            <Link href="/configuration/users/1/profile">
                <button className="btn btn-secondary">Edit User</button>
            </Link>
        </section>
    );
};

export default Page;
