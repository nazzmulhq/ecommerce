import Tree from "@components/modules/configuration/routes";
import { FC } from "react";

export interface IVisualizeReactApp {}

const VisualizeReactApp: FC<IVisualizeReactApp> = async () => {
    return (
        <main>
            <Tree />
        </main>
    );
};

export default VisualizeReactApp;
