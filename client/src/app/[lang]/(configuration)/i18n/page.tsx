import I18n from "@components/settings/i18n";
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
