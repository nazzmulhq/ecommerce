export type TLanguage = {
    languageId: string;
    locale: string;
    name: string;
};

export interface ISubMenuItem {
    name: string;
    link: string;
}

export interface IMenuItem {
    name: string;
    link: string;
    subMenuItems?: ISubMenuItem[];
}

export interface IPermission {
    id: number;
    name: string;
    slug: string;
}

export interface Role {
    id: number;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    createBy: number;
    updateBy: number;
    status: number;
    permissions: IPermission[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    isSuperAdmin: number;
    roles: Role[];
}

/**
 * Interface for route objects used in application
 */
export interface IRoute {
    /**
     * Unique identifier for the route
     */
    id: string;

    /**
     * Display name of the route
     */
    name: string;

    /**
     * URL path for the route
     */
    path: string;

    /**
     * Icon name or identifier
     */
    icon?: string;

    /**
     * Parent route ID if this is a child route
     */
    parentId?: string;

    /**
     * List of child route IDs
     */
    children?: string[];

    /**
     * Route permission requirements
     */
    permissions?: string[];

    /**
     * Whether this route is a component (not a page)
     */
    isComponent?: boolean;
}
