import { promises as fs } from "fs";
import path from "path";

interface INode {
    id: string;
    children: string[];
    parentId: string | null;
    name: string;
    path: string;
    isComponent: boolean;
}

class PathUtils {
    static toTitleCase(input: string): string {
        return input
            .split(" ") // Split the string into an array of words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
            .join(""); // Join the words back into a string
    }

    static removeSquareBrackets(input: string): {
        routeId: string;
        isGroupRoute: boolean;
        isDynamicRoutes: boolean;
    } {
        const path = input.split("/");
        const last = path[path.length - 1];

        if (last.startsWith("[[...") && last.endsWith("]]")) {
            return {
                routeId: last.substring(5, last.length - 2),
                isGroupRoute: false,
                isDynamicRoutes: true,
            };
        } else if (last.startsWith("[...") && last.endsWith("]")) {
            return {
                routeId: last.substring(4, last.length - 1),
                isGroupRoute: false,
                isDynamicRoutes: true,
            };
        } else if (last.startsWith("[") && last.endsWith("]")) {
            return {
                routeId: last.substring(1, last.length - 1),
                isGroupRoute: false,
                isDynamicRoutes: true,
            };
        } else if (last.startsWith("(") && last.endsWith(")")) {
            return {
                routeId: last,
                isGroupRoute: true,
                isDynamicRoutes: false,
            };
        }
        return {
            routeId: last,
            isGroupRoute: false,
            isDynamicRoutes: false,
        };
    }

    static getBasePath(inputPath: string): string {
        const segments = inputPath.split("/");
        const basePathSegments = [];

        for (const segment of segments) {
            // Remove parentheses from segments
            const cleanedSegment = segment.replace(/\(|\)/g, "");

            // Skip dynamic segments enclosed in square brackets
            if (!cleanedSegment.startsWith("[") && !cleanedSegment.endsWith("]")) {
                basePathSegments.push(cleanedSegment);
            }
        }

        return basePathSegments.join("/") + "/";
    }
}

class FileCreator {
    private basePath: string;

    private nodes: INode[];

    constructor(basePath: string, nodes: INode[]) {
        this.basePath = basePath;
        this.nodes = nodes;
    }

    private createPageFile(
        pageName: string,
        isDynamicRoutes: boolean,
        routeId: string,
        folderPath: string,
        isComponent: boolean,
    ): string {
        const query = isDynamicRoutes ? `${routeId}: string;` : "";
        let component = "";
        if (isComponent || isDynamicRoutes) {
            component = `<${pageName} ${routeId}={${routeId}} />`;
        } else {
            component = `<${pageName} />`;
        }

        return `
import { FC } from "react";
import ${pageName} from "@ui${folderPath}";
    
export interface I${pageName} {
    params: {
        ${query}
        searchParams: Record<string, string>;
    };
}
    
const ${pageName}Page: FC<I${pageName}> = (props) => {
${
    isDynamicRoutes
        ? `
    const { params: { ${routeId} }, } = props;`
        : `
    console.log(props);`
}
    return <>${component}</>;
};
    
export default ${pageName}Page;`;
    }

    async createPages() {
        for (let i = 0; i < this.nodes.length; i++) {
            const folderName = this.nodes[i].path;
            const importComponentPath = PathUtils.getBasePath(this.nodes[i].path);
            const folderPath = path.join(process.cwd(), this.basePath, folderName);

            // Check if the folder already exists
            const folderExists = await fs.stat(folderPath).catch(() => null);

            if (!folderExists && this.nodes[i].parentId !== null) {
                if (!this.nodes[i].isComponent) {
                    await fs.mkdir(folderPath, { recursive: true });
                }

                const pageName = PathUtils.toTitleCase(this.nodes[i].name);
                const { routeId, isGroupRoute, isDynamicRoutes } = PathUtils.removeSquareBrackets(this.nodes[i].path);

                if (!isGroupRoute) {
                    const pageComponent = this.createPageFile(
                        pageName,
                        isDynamicRoutes,
                        routeId,
                        importComponentPath,
                        this.nodes[i].isComponent,
                    );
                    if (!this.nodes[i].isComponent) {
                        await fs.writeFile(path.join(folderPath, "page.tsx"), pageComponent, { encoding: "utf-8" });
                    }
                }
            }
        }
    }

    async createComponents() {
        for (let i = 0; i < this.nodes.length; i++) {
            const { routeId, isDynamicRoutes } = PathUtils.removeSquareBrackets(this.nodes[i].path);
            const folderName = PathUtils.getBasePath(this.nodes[i].path);
            const folderPath = path.join(process.cwd(), this.basePath, folderName);

            // Check if the folder already exists
            const folderExists = await fs.stat(folderPath).catch(() => null);

            if (!folderExists && this.nodes[i].parentId !== null) {
                await fs.mkdir(folderPath, { recursive: true });

                const componentName = PathUtils.toTitleCase(this.nodes[i].name);
                const data = `
import { FC } from "react";

export interface I${componentName} {
   ${isDynamicRoutes ? `${routeId}: string;` : ""}
}

const ${componentName}: FC<I${componentName}> = (${isDynamicRoutes ? `{${routeId}}` : ""}) => {
    return <div>Component ${isDynamicRoutes ? `{${routeId}}` : ""}</div>;
};

export default ${componentName};
                `;

                await fs.writeFile(path.join(folderPath, "index.tsx"), data, {
                    encoding: "utf-8",
                });
            }
        }
    }
}

export { FileCreator, PathUtils };
