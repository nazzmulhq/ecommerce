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

export interface IRoute {
    parent_id: number | null;
    id: number;
    type: "guest" | "shared" | "protected" | "devOnly";
    name: string;
    slug: string;
    path: string;
    permissions: IPermission[];
}
