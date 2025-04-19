import { PERMISSIONS } from "./permissions";
import { IRoutes } from "./type";

// Define your shared routes here and authenticate or non-authenticated user can access those routes
const SHARED_ROUTES: IRoutes[] = [
    {
        type: "shared",
        path: "/profile",
        children: [],
        parentId: null,
        name: "Profile",
        isComponent: false,
        permissions: [PERMISSIONS.GLOBAL],
    },
];

export default SHARED_ROUTES;
