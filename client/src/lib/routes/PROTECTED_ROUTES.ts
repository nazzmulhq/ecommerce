import { PERMISSIONS } from "./permissions";
import { IRoutes } from "./type";

// Define your protected routes and required PERMISSION
export const PROTECTED_ROUTES: IRoutes[] = [
    {
        type: "protected",
        children: [],
        parentId: null,
        name: "Home",
        path: "/",
        isComponent: false,
        permissions: [PERMISSIONS.HOME.INDEX],
    },
];
