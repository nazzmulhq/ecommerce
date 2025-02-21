import { PERMISSIONS } from "./permissions";
import { IRoutes } from "./type";

// List of routes that should be accessible without authentication in development mode
const DEV_ONLY_ROUTES: IRoutes[] = [
    {
        type: "devOnly",
        path: "/routes",
        children: [],
        parentId: null,
        name: "Routes",
        isComponent: false,
        permissions: [PERMISSIONS.GLOBAL],
    },
    {
        type: "devOnly",
        path: "/i18n",
        children: [],
        parentId: null,
        name: "i18n",
        isComponent: false,
        permissions: [PERMISSIONS.GLOBAL],
    },
];

export default DEV_ONLY_ROUTES;
