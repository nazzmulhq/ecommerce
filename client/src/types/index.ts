export interface ISubMenuItem {
    name: string;
    link: string;
}

export interface IMenuItem {
    name: string;
    link: string;
    subMenuItems?: ISubMenuItem[];
}

export interface Permission {
    id: number;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    createBy: number;
    updateBy: number;
    status: number;
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
    permissions: Permission[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    isSuperAdmin: number;
    roles: Role[];
}

export interface Route {
    id: number;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    createBy: number;
    updateBy: number;
    status: number;
}

export interface IUserInfo {
    routes: Route[];
    permissions: Permission[];
    user: User;
}
