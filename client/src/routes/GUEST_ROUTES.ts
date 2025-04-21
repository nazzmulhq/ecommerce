import { PERMISSIONS } from "./permissions";
import { IRoutes } from "./type";

// Define your public routes here and not need to authenticate

const GUEST_ROUTES: IRoutes[] = [
    {
        type: "guest",
        path: "/",
        children: [],
        parentId: null,
        name: "Login",
        isComponent: false,
        permissions: [PERMISSIONS.GLOBAL],
    },
    {
        type: "guest",
        path: "/permissions",
        children: [],
        parentId: null,
        name: "Login",
        isComponent: false,
        permissions: [PERMISSIONS.GLOBAL],
    },
    {
        type: "guest",
        path: "/roles",
        children: [],
        parentId: null,
        name: "Login",
        isComponent: false,
        permissions: [PERMISSIONS.GLOBAL],
    },
    {
        type: "guest",
        path: "/login",
        children: [],
        parentId: null,
        name: "Login",
        isComponent: false,
        permissions: [PERMISSIONS.GLOBAL],
    },
    {
        type: "guest",
        path: "/routes",
        children: [],
        parentId: null,
        name: "Login",
        isComponent: false,
        permissions: [PERMISSIONS.GLOBAL],
    },
];

export default GUEST_ROUTES;
