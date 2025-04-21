import Tree from "@ui/settings/routes";
import { FC } from "react";

export interface IVisualizeReactApp {}

const VisualizeReactApp: FC<IVisualizeReactApp> = () => {
    return (
        <main>
            <Tree />
        </main>
    );
};

export default VisualizeReactApp;
