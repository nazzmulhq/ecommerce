import { TIconName } from "@src/types/iconName";
import { TableColumnType, TableProps } from "antd";
import { ReactNode } from "react";
import { FormSchema } from "../AppForm/form.type";

export interface LoadingStates {
    initialLoad: boolean;
    dataLoad: boolean;
    componentReady: boolean;
    stylesReady: boolean;
}

// Permission types and route config
export type Permission = string | string[];
export interface PermissionConfig {
    view?: Permission;
    create?: Permission;
    edit?: Permission;
    delete?: Permission;
    filter?: Permission;
    export?: Permission;
    [key: string]: Permission | undefined;
}
export type PermissionChecker = (permission: Permission) => boolean;
export type CrudType = "modal" | "drawer" | "page" | "route";
export interface RouteConfig {
    basePath: string;
    createPath?: string;
    editPath?: string;
    viewPath?: string;
    listPath?: string;
    paramName?: string;
    queryParams?: Record<string, string>;
}

// Statistics item type
export type StatItem = {
    key: string;
    label: string;
    value: number | string;
    color?: string;
    icon?: ReactNode;
};

// CRUD props combining AppForm and DynamicCrud capabilities
export interface QuickUIProps {
    // Basic configuration
    title: string;
    formSchema: FormSchema;
    crudType?: CrudType;
    icon?: TIconName;

    // Action handlers - onRecordFilter is now required
    onDataChange?: (data: any[]) => void;
    onRecordView?: (record: any) => void;
    onRecordCreate?: (record: any) => Promise<any> | void;
    onRecordUpdate?: (record: any) => Promise<any> | void;
    onRecordDelete?: (record: any) => Promise<any> | void;
    onRecordFilter: (data: any[], filter: Record<string, any>) => Promise<any>; // Required prop

    // UI customization
    tableColumns?: TableColumnType<any>[];
    tableProps?: TableProps<any>;
    formProps?: any;
    actions?: {
        view?: boolean;
        edit?: boolean;
        delete?: boolean;
        extraActions?: (record: any, permissions?: { [key: string]: boolean }) => ReactNode[];
    };

    // Filtering and searching
    showFilter?: boolean;
    filterFields?: any[];

    // Messages and confirmations
    confirmTexts?: {
        delete?: string;
        create?: string;
        update?: string;
    };
    successMessages?: {
        create?: string;
        update?: string;
        delete?: string;
    };

    // Additional features
    statistics?: StatItem[] | ((data: any[]) => StatItem[]);
    rowSelection?: boolean;
    batchActions?: (selectedRowKeys: any[], selectedRows: any[], permissions?: { [key: string]: boolean }) => ReactNode;
    showToggleCrudType?: boolean;

    // Advanced form configuration
    validateOnMount?: boolean;
    preserveFormData?: boolean;
    beforeFormSubmit?: (values: any) => any | Promise<any>;
    afterFormSubmit?: (values: any, result: any) => void;
    renderExtraFormActions?: (
        form: any,
        editingRecord: any | null,
        permissions?: { [key: string]: boolean },
    ) => ReactNode;

    // Permissions
    permissions?: PermissionConfig;
    checkPermission?: PermissionChecker;
    routeConfig?: RouteConfig;
    currentAction?: string;
    currentRecordId?: string;
    onNavigate?: (path: string, params?: Record<string, any>) => void;
}
