// routes.ts
export interface IRoutes {
    id?: string;
    type: "guest" | "shared" | "protected" | "devOnly";
    children: string[];
    parentId: string | null;
    name: string;
    path: string;
    isComponent: boolean;
    permissions?: string[];
}
