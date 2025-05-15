import I18n from "@components/modules/configuration/i18n";
import { FC } from "react";

export interface IPage {}

const Page: FC<IPage> = () => {
    return (
        <main>
            <I18n />
        </main>
    );
};

export default Page;
