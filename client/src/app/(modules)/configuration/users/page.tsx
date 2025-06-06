import UserCRUD from "@components/modules/user";
import { FC } from "react";

export interface IPage {}

const Page: FC<IPage> = () => {
    return (
        <section>
            <UserCRUD />
        </section>
    );
};

export default Page;
