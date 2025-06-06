# QuickUI - Complete Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Installation & Setup](#installation--setup)
3. [Core Concepts](#core-concepts)
4. [Props Reference](#props-reference)
5. [Type Definitions](#type-definitions)
6. [Basic Usage Examples](#basic-usage-examples)
7. [Advanced Examples](#advanced-examples)
8. [Route-based CRUD with Next.js 15](#route-based-crud-with-nextjs-15)
9. [Permission System](#permission-system)
10. [Customization Guide](#customization-guide)
11. [Performance Optimization](#performance-optimization)
12. [Troubleshooting](#troubleshooting)
13. [Best Practices](#best-practices)
14. [Migration Guide](#migration-guide)

## Introduction

QuickUI is a powerful, flexible React component that provides a complete CRUD (Create, Read, Update, Delete) interface with Redux Toolkit state management. It automatically generates tables, forms, modal dialogs, and handles all CRUD operations with minimal configuration.

### Key Features

- 🚀 **Zero-config CRUD** - Works out of the box with minimal setup
- 📱 **Multiple UI modes** - Modal, drawer, page-based, and route-based CRUD
- 🔐 **Built-in permissions** - Comprehensive role-based access control
- 🎨 **Highly customizable** - Override any component or behavior
- 📊 **Advanced filtering** - Auto-generated and custom filters
- 📈 **Statistics dashboard** - Built-in data visualization
- 🔄 **Real-time updates** - WebSocket and SSE support
- 🌐 **Internationalization** - Full i18n support
- ♿ **Accessibility** - WCAG 2.1 compliant
- 📱 **Mobile responsive** - Works on all device sizes

### Browser Support

- Chrome (>= 88)
- Firefox (>= 85)
- Safari (>= 14)
- Edge (>= 88)

## Installation & Setup

### 1. Install Dependencies

```bash
# Using npm
npm install @reduxjs/toolkit react-redux antd

# Using yarn
yarn add @reduxjs/toolkit react-redux antd

# Using pnpm
pnpm add @reduxjs/toolkit react-redux antd
```

### 2. Configure Redux Store

```typescript
// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import quickUIReducer from "./quickUISlice";

export const store = configureStore({
    reducer: {
        quickUI: quickUIReducer,
        // Add other reducers here
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST"],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 3. Setup Redux Provider

```tsx
// App.tsx or layout.tsx (Next.js 13+)
import { Provider } from "react-redux";
import { store } from "./store";

function App() {
    return (
        <Provider store={store}>
            <YourAppContent />
        </Provider>
    );
}
```

### 4. CSS Imports (if needed)

```tsx
// Import Ant Design CSS
import "antd/dist/reset.css"; // Ant Design 5.x
// or
import "antd/dist/antd.css"; // Ant Design 4.x
```

## Core Concepts

### Form Schema Architecture

The form schema is the heart of QuickUI. It defines:

- Field types and validation
- Table column generation
- Filter configuration
- Form layout and structure

```typescript
interface FormSchema {
    layout?: "horizontal" | "vertical" | "inline";
    fields?: FormField[]; // Simple field list
    sections?: FormSection[]; // Grouped sections
    tabs?: FormTab[]; // Tabbed interface
    steps?: FormStep[]; // Multi-step wizard
}
```

### CRUD Type Patterns

| Type   | Use Case                  | Navigation      | Best For          |
| ------ | ------------------------- | --------------- | ----------------- |
| Modal  | Quick edits, simple forms | Overlay         | Simple data entry |
| Drawer | Detailed forms            | Side panel      | Complex forms     |
| Page   | Full-screen editing       | Same page       | Rich content      |
| Route  | SEO-friendly URLs         | Browser history | Public interfaces |

### Permission Model

```typescript
interface PermissionConfig {
    view?: Permission; // Who can view records
    create?: Permission; // Who can create records
    edit?: Permission; // Who can edit records
    delete?: Permission; // Who can delete records
    filter?: Permission; // Who can use filters
    export?: Permission; // Who can export data
    [key: string]: Permission | undefined; // Custom permissions
}
```

## Props Reference

### Essential Props

| Prop         | Type         | Required | Description                          |
| ------------ | ------------ | -------- | ------------------------------------ |
| `title`      | `string`     | ✅       | Display title for the interface      |
| `formSchema` | `FormSchema` | ✅       | Schema defining form structure       |
| `crudType`   | `CrudType`   | ❌       | UI pattern (modal/drawer/page/route) |

### Data Management

| Prop             | Type                                   | Description              |
| ---------------- | -------------------------------------- | ------------------------ |
| `initialData`    | `any[]`                                | Initial dataset          |
| `onDataChange`   | `(data: any[]) => void`                | Called when data changes |
| `onRecordCreate` | `(record: any) => Promise<any>`        | Handle record creation   |
| `onRecordUpdate` | `(record: any) => Promise<any>`        | Handle record updates    |
| `onRecordDelete` | `(record: any) => Promise<any>`        | Handle record deletion   |
| `onFilter`       | `(data: any[], filters: any) => any[]` | Custom filtering logic   |

### UI Customization

| Prop           | Type                                 | Description             |
| -------------- | ------------------------------------ | ----------------------- |
| `tableColumns` | `ColumnType<any>[]`                  | Custom table columns    |
| `tableProps`   | `TableProps<any>`                    | Ant Design Table props  |
| `formProps`    | `any`                                | AppForm component props |
| `actions`      | `ActionConfig`                       | Configure row actions   |
| `statistics`   | `StatItem[] \| (data) => StatItem[]` | Dashboard statistics    |
| `batchActions` | `(keys, rows, perms) => ReactNode`   | Bulk operation buttons  |

### Permission System

| Prop              | Type                | Description                   |
| ----------------- | ------------------- | ----------------------------- |
| `permissions`     | `PermissionConfig`  | Define required permissions   |
| `checkPermission` | `PermissionChecker` | Function to check permissions |

### Route Configuration (Next.js 15)

| Prop              | Type          | Description                        |
| ----------------- | ------------- | ---------------------------------- |
| `routeConfig`     | `RouteConfig` | Route patterns for CRUD operations |
| `currentAction`   | `string`      | Current route action context       |
| `currentRecordId` | `string`      | Current record ID from URL         |
| `onNavigate`      | `function`    | Custom navigation handler          |

## Type Definitions

### FormField Interface

```typescript
interface FormField {
    name: string; // Field identifier
    label: string; // Display label
    type: FieldType; // Input type
    required?: boolean; // Validation requirement
    defaultValue?: any; // Default field value
    placeholder?: string; // Input placeholder
    disabled?: boolean; // Disable field

    // Table configuration
    hideInTable?: boolean; // Hide in generated table
    sortable?: boolean; // Enable sorting
    filterable?: boolean; // Include in filters
    render?: (value: any, record: any) => ReactNode; // Custom renderer

    // Layout
    grid?: ResponsiveGrid; // Grid layout

    // Validation
    rules?: ValidationRule[]; // Form validation rules
    dependencies?: FieldDependency[]; // Field dependencies

    // Field-specific props
    options?: Option[]; // Select/Radio options
    props?: any; // Component-specific props
}

type FieldType =
    | "text"
    | "number"
    | "email"
    | "password"
    | "select"
    | "multiselect"
    | "radio"
    | "checkbox"
    | "switch"
    | "boolean"
    | "date"
    | "daterange"
    | "time"
    | "datetime"
    | "textarea"
    | "richtext"
    | "upload"
    | "image"
    | "cascader"
    | "treeselect"
    | "color"
    | "slider"
    | "rate"
    | "custom";
```

### Advanced Field Types

```typescript
// Custom field with full control
{
    name: "customField",
    type: "custom",
    render: (value, record, form) => (
        <CustomComponent
            value={value}
            onChange={(val) => form.setFieldValue('customField', val)}
        />
    )
}

// Conditional field
{
    name: "conditionalField",
    type: "text",
    dependencies: [{
        type: "show_if",
        conditions: [{ field: "type", operator: "equals", value: "premium" }]
    }],
    rules: [{ required: true, message: "This field is required" }]
}

// Calculated field
{
    name: "totalPrice",
    type: "number",
    disabled: true,
    dependencies: [{
        type: "calculate",
        conditions: [
            { field: "quantity", operator: "is_not_empty" },
            { field: "unitPrice", operator: "is_not_empty" }
        ],
        callback: (form, values) => {
            return (values.quantity || 0) * (values.unitPrice || 0);
        }
    }]
}
```

## Basic Usage Examples

### 1. Simple User Management

```tsx
import QuickUI from "@components/common/AppCRUDOperation";

const SimpleUserManagement = () => {
    const userSchema = {
        layout: "vertical",
        fields: [
            {
                name: "name",
                label: "Full Name",
                type: "text",
                required: true,
                filterable: true,
                grid: { xs: 24, md: 12 },
            },
            {
                name: "email",
                label: "Email Address",
                type: "email",
                required: true,
                filterable: true,
                grid: { xs: 24, md: 12 },
            },
            {
                name: "role",
                label: "User Role",
                type: "select",
                options: [
                    { value: "user", label: "Regular User" },
                    { value: "admin", label: "Administrator" },
                    { value: "moderator", label: "Moderator" },
                ],
                filterable: true,
                defaultValue: "user",
            },
            {
                name: "active",
                label: "Account Active",
                type: "switch",
                defaultValue: true,
                filterable: true,
            },
        ],
    };

    const users = [
        { id: "1", name: "John Doe", email: "john@example.com", role: "admin", active: true },
        { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user", active: true },
    ];

    return (
        <QuickUI
            title="User Management"
            formSchema={userSchema}
            initialData={users}
            crudType="modal"
            showFilter={true}
            rowSelection={true}
        />
    );
};
```

### 2. Product Catalog with Statistics

```tsx
const ProductCatalog = () => {
    const [products, setProducts] = useState([]);

    const productSchema = {
        layout: "vertical",
        sections: [
            {
                title: "Basic Information",
                fields: [
                    { name: "name", label: "Product Name", type: "text", required: true },
                    { name: "sku", label: "SKU", type: "text", required: true },
                    {
                        name: "category",
                        label: "Category",
                        type: "select",
                        options: [
                            { value: "electronics", label: "Electronics" },
                            { value: "clothing", label: "Clothing" },
                            { value: "books", label: "Books" },
                        ],
                        filterable: true,
                    },
                ],
            },
            {
                title: "Pricing & Inventory",
                fields: [
                    { name: "price", label: "Price", type: "number", required: true, prefix: "$" },
                    { name: "stock", label: "Stock Quantity", type: "number" },
                    { name: "active", label: "Active", type: "switch", defaultValue: true },
                ],
            },
        ],
    };

    const productStats = data => [
        {
            key: "total",
            label: "Total Products",
            value: data.length,
            color: "#1890ff",
            icon: <ShoppingOutlined />,
        },
        {
            key: "revenue",
            label: "Total Value",
            value: `$${data.reduce((sum, p) => sum + p.price * p.stock, 0).toLocaleString()}`,
            color: "#52c41a",
            icon: <DollarOutlined />,
        },
    ];

    return (
        <QuickUI
            title="Product Catalog"
            formSchema={productSchema}
            initialData={products}
            statistics={productStats}
            crudType="drawer"
            onRecordCreate={async product => {
                const response = await api.products.create(product);
                setProducts(prev => [...prev, response]);
                return response;
            }}
            onRecordUpdate={async product => {
                const response = await api.products.update(product.id, product);
                setProducts(prev => prev.map(p => (p.id === product.id ? response : p)));
                return response;
            }}
            onRecordDelete={async product => {
                await api.products.delete(product.id);
                setProducts(prev => prev.filter(p => p.id !== product.id));
            }}
        />
    );
};
```

## Advanced Examples

### 1. Multi-entity E-commerce Dashboard

```tsx
const EcommerceDashboard = () => {
    const [activeTab, setActiveTab] = useState("products");

    // Complex product schema with variants
    const productSchema = {
        layout: "vertical",
        tabs: [
            {
                key: "basic",
                title: "Basic Info",
                fields: [
                    { name: "name", label: "Product Name", type: "text", required: true },
                    { name: "description", label: "Description", type: "richtext" },
                    { name: "category", label: "Category", type: "cascader", options: categoryTree, filterable: true },
                ],
            },
            {
                key: "pricing",
                title: "Pricing",
                fields: [
                    { name: "basePrice", label: "Base Price", type: "number", required: true, prefix: "$" },
                    { name: "salePrice", label: "Sale Price", type: "number", prefix: "$" },
                    { name: "costPrice", label: "Cost", type: "number", prefix: "$" },
                ],
            },
            {
                key: "variants",
                title: "Variants",
                fields: [
                    {
                        name: "hasVariants",
                        label: "This product has variants",
                        type: "switch",
                        defaultValue: false,
                    },
                    {
                        name: "variants",
                        label: "Product Variants",
                        type: "form.list",
                        dependencies: [
                            {
                                type: "show_if",
                                conditions: [{ field: "hasVariants", operator: "equals", value: true }],
                            },
                        ],
                        formList: {
                            template: [
                                { name: "name", label: "Variant Name", type: "text", required: true },
                                { name: "sku", label: "SKU", type: "text", required: true },
                                { name: "price", label: "Price", type: "number", prefix: "$" },
                                { name: "stock", label: "Stock", type: "number" },
                            ],
                        },
                    },
                ],
            },
        ],
    };

    const orderSchema = {
        layout: "vertical",
        fields: [
            { name: "customerName", label: "Customer", type: "text", required: true },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                    { value: "pending", label: "Pending" },
                    { value: "processing", label: "Processing" },
                    { value: "shipped", label: "Shipped" },
                    { value: "delivered", label: "Delivered" },
                ],
                filterable: true,
            },
            { name: "total", label: "Total Amount", type: "number", prefix: "$" },
            { name: "orderDate", label: "Order Date", type: "date", filterable: true },
        ],
    };

    return (
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <Tabs.TabPane tab="Products" key="products">
                <QuickUI
                    title="Products"
                    formSchema={productSchema}
                    initialData={products}
                    crudType="drawer"
                    statistics={productStats}
                    batchActions={(keys, rows, perms) => (
                        <Space>
                            {perms?.canEdit && (
                                <Button onClick={() => bulkUpdateStatus(keys, "active")}>Activate Selected</Button>
                            )}
                            <Button onClick={() => exportProducts(rows)}>Export Selected</Button>
                        </Space>
                    )}
                    actions={{
                        view: true,
                        edit: true,
                        delete: true,
                        extraActions: (record, perms) => [
                            <Button key="duplicate" size="small" onClick={() => duplicateProduct(record)}>
                                Duplicate
                            </Button>,
                        ],
                    }}
                />
            </Tabs.TabPane>

            <Tabs.TabPane tab="Orders" key="orders">
                <QuickUI
                    title="Orders"
                    formSchema={orderSchema}
                    initialData={orders}
                    crudType="modal"
                    tableColumns={customOrderColumns}
                    onFilter={advancedOrderFilter}
                />
            </Tabs.TabPane>
        </Tabs>
    );
};
```

### 2. Real-time Data with WebSocket

```tsx
const RealTimeOrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState("disconnected");
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // WebSocket connection
        const ws = new WebSocket("ws://localhost:8080/orders");
        wsRef.current = ws;

        ws.onopen = () => setConnectionStatus("connected");
        ws.onclose = () => setConnectionStatus("disconnected");
        ws.onerror = () => setConnectionStatus("error");

        ws.onmessage = event => {
            const update = JSON.parse(event.data);

            switch (update.type) {
                case "ORDER_CREATED":
                    setOrders(prev => [...prev, update.data]);
                    message.success(`New order #${update.data.id} received`);
                    break;
                case "ORDER_UPDATED":
                    setOrders(prev => prev.map(order => (order.id === update.data.id ? update.data : order)));
                    break;
                case "ORDER_DELETED":
                    setOrders(prev => prev.filter(order => order.id !== update.data.id));
                    break;
            }
        };

        return () => ws.close();
    }, []);

    const connectionIndicator = (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: connectionStatus === "connected" ? "#52c41a" : "#ff4d4f",
                    animation: connectionStatus === "connected" ? "pulse 2s infinite" : "none",
                }}
            />
            <span style={{ fontSize: 12, color: "#666" }}>{connectionStatus === "connected" ? "Live" : "Offline"}</span>
        </div>
    );

    return (
        <QuickUI
            title="Real-time Orders"
            formSchema={orderSchema}
            initialData={orders}
            tableProps={{
                title: () => (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Orders</span>
                        {connectionIndicator}
                    </div>
                ),
            }}
            // Real-time updates disable local CRUD
            onRecordCreate={() => {
                message.info("Orders are managed in real-time");
                return Promise.reject("Real-time mode");
            }}
        />
    );
};
```

## Route-based CRUD with Next.js 15

### File Structure

```
app/
├── dashboard/
│   └── users/
│       ├── page.tsx              # List view
│       ├── create/
│       │   └── page.tsx          # Create form
│       └── [id]/
│           ├── page.tsx          # View details
│           └── edit/
│               └── page.tsx      # Edit form
```

### Implementation

```tsx
// app/dashboard/users/UserCRUD.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import QuickUI from '@components/common/AppCRUDOperation';

const UserCRUD = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [users, setUsers] = useState([]);

    // Parse current route
    const pathSegments = pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    const secondLastSegment = pathSegments[pathSegments.length - 2];

    let currentAction: 'list' | 'create' | 'edit' | 'view' = 'list';
    let currentRecordId: string | undefined;

    if (lastSegment === 'create') {
        currentAction = 'create';
    } else if (lastSegment === 'edit') {
        currentAction = 'edit';
        currentRecordId = secondLastSegment;
    } else if (lastSegment !== 'users' && lastSegment !== 'create') {
        currentAction = 'view';
        currentRecordId = lastSegment;
    }

    // Permission system
    const checkPermission = (permission: string | string[]): boolean => {
        const userPerms = getUserPermissions(); // Your auth logic
        if (Array.isArray(permission)) {
            return permission.some(p => userPerms.includes(p));
        }
        return userPerms.includes(permission);
    };

    // Form schema
    const userSchema = {
        layout: "vertical",
        sections: [
            {
                title: "Personal Information",
                fields: [
                    { name: "firstName", label: "First Name", type: "text", required: true },
                    { name: "lastName", label: "Last Name", type: "text", required: true },
                    { name: "email", label: "Email", type: "email", required: true, filterable: true },
                    { name: "phone", label: "Phone", type: "text" }
                ]
            },
            {
                title: "Account Settings",
                fields: [
                    { name: "role", label: "Role", type: "select",
                      options: [
                          { value: "user", label: "User" },
                          { value: "admin", label: "Administrator" },
                          { value: "moderator", label: "Moderator" }
                      ], filterable: true },
                    { name: "active", label: "Active", type: "switch", defaultValue: true },
                    { name: "department", label: "Department", type: "select",
                      options: departments, filterable: true }
                ]
            }
        ]
    };

    return (
        <QuickUI
            title="User Management"
            formSchema={userSchema}
            crudType="route"
            initialData={users}

            // Route configuration
            routeConfig={{
                basePath: "/dashboard/users",
                createPath: "/dashboard/users/create",
                editPath: "/dashboard/users/[id]/edit",
                viewPath: "/dashboard/users/[id]",
                listPath: "/dashboard/users",
                paramName: "id"
            }}

            currentAction={currentAction}
            currentRecordId={currentRecordId}

            // Permissions
            permissions={{
                view: 'users.view',
                create: 'users.create',
                edit: ['users.edit', 'users.admin'],
                delete: 'users.delete',
                filter: 'users.filter'
            }}
            checkPermission={checkPermission}

            // Navigation
            onNavigate={(path) => router.push(path)}

            // CRUD handlers
            onRecordCreate={async (userData) => {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                const newUser = await response.json();
                setUsers(prev => [...prev, newUser]);
                return newUser;
            }}

            onRecordUpdate={async (userData) => {
                const response = await fetch(`/api/users/${userData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                const updatedUser = await response.json();
                setUsers(prev => prev.map(u => u.id === userData.id ? updatedUser : u));
                return updatedUser;
            }}
        );
};

export default UserCRUD;
```

### Page Components

```tsx
// app/dashboard/users/page.tsx
import UserCRUD from "./UserCRUD";

export default function UsersListPage() {
    return <UserCRUD />;
}

export const metadata = {
    title: "Users | Dashboard",
    description: "Manage system users and permissions",
};

// app/dashboard/users/create/page.tsx
import UserCRUD from "../UserCRUD";

export default function CreateUserPage() {
    return <UserCRUD />;
}

// app/dashboard/users/[id]/page.tsx
import UserCRUD from "../UserCRUD";

interface Props {
    params: { id: string };
}

export default function ViewUserPage({ params }: Props) {
    return <UserCRUD />;
}

// app/dashboard/users/[id]/edit/page.tsx
import UserCRUD from "../../UserCRUD";

interface Props {
    params: { id: string };
}

export default function EditUserPage({ params }: Props) {
    return <UserCRUD />;
}
```

## Permission System

### Basic Permission Setup

```tsx
// contexts/PermissionContext.tsx
import { createContext, useContext } from "react";

interface PermissionContextType {
    user: User;
    permissions: string[];
    roles: string[];
    checkPermission: (permission: string | string[]) => boolean;
}

const PermissionContext = createContext<PermissionContextType | null>(null);

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth(); // Your auth hook

    const checkPermission = (permission: string | string[]): boolean => {
        if (!user) return false;

        if (Array.isArray(permission)) {
            return permission.some(p => hasPermission(p, user));
        }

        return hasPermission(permission, user);
    };

    return (
        <PermissionContext.Provider
            value={{
                user,
                permissions: user.permissions || [],
                roles: user.roles || [],
                checkPermission,
            }}
        >
            {children}
        </PermissionContext.Provider>
    );
};

export const usePermissions = () => {
    const context = useContext(PermissionContext);
    if (!context) throw new Error("usePermissions must be used within PermissionProvider");
    return context;
};
```

### Advanced Permission Patterns

```tsx
// Complex permission checking
const AdvancedPermissionExample = () => {
    const { checkPermission } = usePermissions();

    return (
        <QuickUI
            title="Advanced Permissions"
            formSchema={schema}
            permissions={{
                // Multiple permission options (OR logic)
                view: ["documents.view", "documents.admin", "admin"],

                // Single permission
                create: "documents.create",

                // Conditional permissions
                edit: record => {
                    // Users can edit their own records
                    if (record.ownerId === getCurrentUser().id) {
                        return ["documents.edit.own"];
                    }
                    // Managers can edit all
                    return ["documents.edit.all", "manager"];
                },

                // Time-based permissions
                delete: record => {
                    const isRecent = Date.now() - new Date(record.createdAt).getTime() < 24 * 60 * 60 * 1000;
                    return isRecent ? ["documents.delete.recent"] : ["documents.delete.all"];
                },
            }}
            checkPermission={checkPermission}
            // Permission-aware actions
            actions={{
                view: true,
                edit: true,
                delete: true,
                extraActions: (record, permissions) =>
                    [
                        permissions?.canEdit && record.status === "draft" && (
                            <Button key="publish" onClick={() => publishDocument(record)}>
                                Publish
                            </Button>
                        ),
                        permissions?.canDelete && (
                            <Button key="archive" onClick={() => archiveDocument(record)}>
                                Archive
                            </Button>
                        ),
                    ].filter(Boolean),
            }}
        />
    );
};
```

## Performance Optimization

### 1. Large Dataset Handling

```tsx
// Virtual scrolling for large datasets
const LargeDatasetExample = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 50, total: 0 });

    const fetchData = useCallback(async (page = 1, pageSize = 50, filters = {}) => {
        setLoading(true);
        try {
            const response = await api.getData({
                page,
                pageSize,
                filters,
            });
            setData(response.data);
            setPagination({
                current: page,
                pageSize,
                total: response.total,
            });
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <QuickUI
            title="Large Dataset"
            formSchema={schema}
            initialData={data}
            tableProps={{
                loading,
                pagination: {
                    ...pagination,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    onChange: (page, pageSize) => {
                        fetchData(page, pageSize);
                    },
                },
                scroll: { y: 400 },
            }}
            onFilter={async (_, filters) => {
                await fetchData(1, pagination.pageSize, filters);
                return data; // Return current data since we handle filtering server-side
            }}
        />
    );
};
```

### 2. Memoization and Optimization

```tsx
const OptimizedCRUD = memo(() => {
    // Memoize expensive calculations
    const statistics = useMemo(() => calculateStatistics(data), [data]);

    // Memoize callbacks
    const handleCreate = useCallback(async record => {
        return await api.create(record);
    }, []);

    const handleUpdate = useCallback(async record => {
        return await api.update(record.id, record);
    }, []);

    // Debounced filter
    const debouncedFilter = useMemo(
        () =>
            debounce(async (data, filters) => {
                return await api.filter(filters);
            }, 300),
        [],
    );

    return (
        <QuickUI
            title="Optimized CRUD"
            formSchema={memoizedSchema}
            initialData={data}
            statistics={statistics}
            onRecordCreate={handleCreate}
            onRecordUpdate={handleUpdate}
            onFilter={debouncedFilter}
        />
    );
});
```

## Troubleshooting

### Common Issues

#### 1. Redux State Not Updating

**Problem**: Changes don't reflect in the UI

**Solution**:

```tsx
// Ensure Redux store is properly configured
const store = configureStore({
    reducer: {
        quickUI: quickUIReducer, // Make sure this is included
    },
});

// Check that the Provider wraps your app
<Provider store={store}>
    <App />
</Provider>;
```

#### 2. Form Validation Not Working

**Problem**: Form submits without validation

**Solution**:

```tsx
// Ensure validation rules are properly defined
const schema = {
    fields: [
        {
            name: "email",
            type: "email",
            required: true,
            rules: [
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter a valid email" },
            ],
        },
    ],
};
```

#### 3. Route Navigation Issues

**Problem**: Navigation doesn't work in route-based CRUD

**Solution**:

```tsx
// Ensure routeConfig is properly set
const routeConfig = {
    basePath: "/users",
    createPath: "/users/create",     // Must match your file structure
    editPath: "/users/[id]/edit",    // Use [id] for dynamic segments
    viewPath: "/users/[id]",
    listPath: "/users"
};

// Make sure onNavigate is implemented if using custom navigation
onNavigate={(path) => router.push(path)}
```

#### 4. Permissions Not Working

**Problem**: Permission checks always return true/false

**Solution**:

```tsx
// Ensure checkPermission function is implemented correctly
const checkPermission = (permission: string | string[]): boolean => {
    const userPermissions = getCurrentUserPermissions();

    if (Array.isArray(permission)) {
        return permission.some(p => userPermissions.includes(p));
    }

    return userPermissions.includes(permission);
};
```

### Debug Mode

Enable debug mode to see internal state:

```tsx
<QuickUI
    title="Debug Mode"
    formSchema={schema}
    // Add this to see internal state in console
    onDataChange={data => console.log("Data changed:", data)}
    tableProps={{
        // Show loading states
        loading: loading,
    }}
/>
```

## Best Practices

### 1. Schema Design

```tsx
// ✅ Good: Organized, typed, well-documented
const userSchema: FormSchema = {
    layout: "vertical",
    sections: [
        {
            title: "Personal Information",
            fields: [
                {
                    name: "firstName",
                    label: "First Name",
                    type: "text",
                    required: true,
                    grid: { xs: 24, md: 12 },
                    rules: [
                        { required: true, message: "First name is required" },
                        { min: 2, message: "First name must be at least 2 characters" },
                    ],
                },
            ],
        },
    ],
};

// ❌ Bad: Unorganized, no validation
const badSchema = {
    fields: [
        { name: "name", type: "text" },
        { name: "email", type: "text" },
    ],
};
```

### 2. Error Handling

```tsx
// ✅ Good: Comprehensive error handling
const handleCreate = async (record: any) => {
    try {
        const response = await api.users.create(record);
        message.success("User created successfully");
        return response;
    } catch (error) {
        if (error.status === 409) {
            message.error("User with this email already exists");
        } else if (error.status === 422) {
            message.error("Please check your input data");
        } else {
            message.error("An unexpected error occurred");
        }
        throw error; // Re-throw to prevent form from closing
    }
};
```

### 3. Performance

```tsx
// ✅ Good: Memoized and optimized
const MyComponent = memo(() => {
    const memoizedSchema = useMemo(() => generateSchema(), []);
    const memoizedStats = useMemo(() => calculateStats(data), [data]);

    return <QuickUI formSchema={memoizedSchema} statistics={memoizedStats} />;
});

// ❌ Bad: Creates new objects on every render
const BadComponent = () => (
    <QuickUI
        formSchema={{
            fields: [{ name: "test", type: "text" }], // New object every render
        }}
    />
);
```

### 4. Type Safety

```tsx
// ✅ Good: Strongly typed
interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "user" | "admin" | "moderator";
    active: boolean;
}

const TypedUserCRUD = () => {
    const [users, setUsers] = useState<User[]>([]);

    const handleCreate = async (userData: Omit<User, "id">): Promise<User> => {
        const response = await api.users.create(userData);
        return response as User;
    };

    return <QuickUI title="Users" formSchema={userSchema} initialData={users} onRecordCreate={handleCreate} />;
};
```

## Migration Guide

### From Version 1.x to 2.x

#### Breaking Changes

1. **Permission system overhaul**

```tsx
// v1.x
<QuickUI canEdit={true} canDelete={false} />

// v2.x
<QuickUI
    permissions={{
        edit: 'users.edit',
        delete: 'users.delete'
    }}
    checkPermission={checkPermission}
/>
```

2. **Route configuration**

```tsx
// v1.x
<QuickUI routeMode="hash" />

// v2.x
<QuickUI
    crudType="route"
    routeConfig={{
        basePath: "/users",
        createPath: "/users/create"
    }}
/>
```

#### Migration Steps

1. Update permission props
2. Replace route configuration
3. Update form schema if using deprecated fields
4. Test all CRUD operations

### Upgrading Dependencies

```bash
# Update to latest versions
npm update @reduxjs/toolkit react-redux antd

# Check for breaking changes
npm ls @reduxjs/toolkit
```

---

## Support and Contributing

### Getting Help

- 📚 [Documentation](https://your-docs-url.com)
- 💬 [Discord Community](https://discord.gg/your-server)
- 🐛 [GitHub Issues](https://github.com/your-repo/issues)
- 📧 [Email Support](mailto:support@yourcompany.com)

### Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### License

MIT License - see [LICENSE](LICENSE) file for details.
