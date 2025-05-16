import { Cache as NestCache } from '@nestjs/cache-manager';
import { Role } from 'modules/auth/role/entities/role.entity';
export interface IUser {
    id: number;
    name: string;
    email: string;
    isSuperAdmin: number;
    roles: Role[];
}

export interface UserAndRequest extends Request {
    user: IUser;
}

export interface ExtendedCache extends NestCache {
    set<T>(key: string, value: T, options?: any): Promise<T>;
}

export interface IMetaData {
    title:
        | {
              default: string;
              template?: string;
              absolute?: string;
          }
        | string;
    description?: string;
    applicationName?: string;
    authors?: { name: string; url?: string }[];
    generator?: string;
    keywords?: string[];
    referrer?: string;
    themeColor?: { media: string; color: string }[];
    colorScheme?: string;
    creator?: string;
    publisher?: string;
    formatDetection?: {
        email?: boolean;
        address?: boolean;
        telephone?: boolean;
    };
    robots?: {
        index?: boolean;
        follow?: boolean;
        nocache?: boolean;
        googleBot?: {
            index?: boolean;
            follow?: boolean;
            noimageindex?: boolean;
        };
    };
    manifest?: string;
    metadataBase?: URL;
    icons?: {
        icon?: ({ url: string } | URL)[];
        shortcut?: string[];
        apple?: { url: string; sizes?: string; type?: string }[];
        other?: { rel: string; url: string }[];
    };
    openGraph?: {
        title?: string;
        description?: string;
        url?: string;
        siteName?: string;
        images?: {
            url: string;
            width?: number;
            height?: number;
            alt?: string;
            type?: string;
        }[];
        locale?: string;
        type?: string;
        publishedTime?: string;
        authors?: string[];
    };
    twitter?: {
        card?: string;
        title?: string;
        description?: string;
        siteId?: string;
        creator?: string;
        creatorId?: string;
        images?: string[];
    };
    alternates?: {
        canonical?: string;
        languages?: Record<string, string>;
        media?: Record<string, string>;
        types?: Record<string, string>;
    };
    verification?: {
        google?: string;
        yandex?: string;
        me?: string;
    };
    appLinks?: {
        web?: { url: string; should_fallback?: boolean };
        ios?: { url: string; app_store_id?: string };
        android?: { url: string; package?: string };
    };
    archives?: string[];
    assets?: string[];
    bookmarks?: string[];
    category?: string;
    appleWebApp?: {
        capable?: boolean;
        title?: string;
        statusBarStyle?: string;
    };
    itunes?: {
        appId?: string;
        appArgument?: string;
    };
    abstract?: string;
    classification?: string;
}
