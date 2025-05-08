import Permissions from "@components/modules/configuration/permission";
import { FC } from "react";

export interface IPage {}

const Page: FC<IPage> = async () => {
    return <Permissions />;
};

export default Page;
