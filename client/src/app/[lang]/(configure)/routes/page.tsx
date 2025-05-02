import Tree from "@ui/settings/routes";
import { cookies } from "next/headers";
import { FC } from "react";

export interface IVisualizeReactApp {}

const VisualizeReactApp: FC<IVisualizeReactApp> = async () => {
    console.log((await cookies()).get("token")?.value);
    return (
        <main>
            <Tree />
        </main>
    );
};

export default VisualizeReactApp;
