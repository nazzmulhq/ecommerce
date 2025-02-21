export interface ISubMenuItem {
    name: string;
    link: string;
}

export interface IMenuItem {
    name: string;
    link: string;
    subMenuItems?: ISubMenuItem[];
}
