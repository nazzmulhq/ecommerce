# QuickUI - Complete Props & Configuration Documentation

## Table of Contents

1. [Core Props](#core-props)
2. [Type Definitions](#type-definitions)
3. [Form Schema Configuration](#form-schema-configuration)
4. [Table Configuration](#table-configuration)
5. [Permission System](#permission-system)
6. [Route Configuration](#route-configuration)
7. [Action Configuration](#action-configuration)
8. [UI Customization](#ui-customization)
9. [Event Handlers](#event-handlers)
10. [Advanced Examples](#advanced-examples)

## Core Props

### Essential Props

| Prop          | Type         | Required | Default   | Description                                                  |
| ------------- | ------------ | -------- | --------- | ------------------------------------------------------------ |
| `title`       | `string`     | ✅       | -         | Display title for the CRUD interface                         |
| `formSchema`  | `FormSchema` | ✅       | -         | Schema defining form structure and table columns             |
| `crudType`    | `CrudType`   | ❌       | `"modal"` | UI pattern: `"modal"` \| `"drawer"` \| `"page"` \| `"route"` |
| `initialData` | `any[]`      | ❌       | `[]`      | Initial dataset for the table                                |
| `icon`        | `TIconName`  | ❌       | -         | Icon to display in title                                     |

```tsx
// Basic usage
<QuickUI title="User Management" formSchema={userSchema} crudType="modal" initialData={users} icon="UserOutlined" />
```

### Data Management Props

| Prop             | Type                                                                     | Description                  |
| ---------------- | ------------------------------------------------------------------------ | ---------------------------- |
| `onDataChange`   | `(data: any[]) => void`                                                  | Called when data changes     |
| `onRecordView`   | `(record: any) => void`                                                  | Called when viewing a record |
| `onRecordCreate` | `(record: any) => Promise<any> \| void`                                  | Handle record creation       |
| `onRecordUpdate` | `(record: any) => Promise<any> \| void`                                  | Handle record updates        |
| `onRecordDelete` | `(record: any) => Promise<any> \| void`                                  | Handle record deletion       |
| `onFilter`       | `(data: any[], filters: Record<string, any>) => Promise<any[]> \| any[]` | Custom filtering logic       |

```tsx
// Data management example
<QuickUI
    title="Products"
    formSchema={productSchema}
    initialData={products}
    // Local state management
    onDataChange={data => {
        console.log("Data changed:", data);
        setProducts(data);
    }}
    // API integration
    onRecordCreate={async product => {
        const response = await fetch("/api/products", {
            method: "POST",
            body: JSON.stringify(product),
        });
        const newProduct = await response.json();
        setProducts(prev => [...prev, newProduct]);
        return newProduct;
    }}
    onRecordUpdate={async product => {
        const response = await fetch(`/api/products/${product.id}`, {
            method: "PUT",
            body: JSON.stringify(product),
        });
        const updatedProduct = await response.json();
        setProducts(prev => prev.map(p => (p.id === product.id ? updatedProduct : p)));
        return updatedProduct;
    }}
    onRecordDelete={async product => {
        await fetch(`/api/products/${product.id}`, { method: "DELETE" });
        setProducts(prev => prev.filter(p => p.id !== product.id));
    }}
    // Server-side filtering with pagination
    onFilter={async (data, filters) => {
        const params = new URLSearchParams({
            ...filters,
            page: filters._pagination?.page || 1,
            pageSize: filters._pagination?.pageSize || 10,
        });

        const response = await fetch(`/api/products?${params}`);
        const result = await response.json();

        // Return paginated response
        return {
            data: result.products,
            total: result.total,
            current: result.page,
            pageSize: result.pageSize,
        };
    }}
/>
```

### UI Customization Props

| Prop                 | Type                | Description                           |
| -------------------- | ------------------- | ------------------------------------- |
| `tableColumns`       | `ColumnType<any>[]` | Override auto-generated table columns |
| `tableProps`         | `TableProps<any>`   | Additional Ant Design Table props     |
| `formProps`          | `any`               | Additional AppForm component props    |
| `emptyText`          | `string`            | Text to display when no data          |
| `showToggleCrudType` | `boolean`           | Show CRUD type toggle buttons         |
| `showFilter`         | `boolean`           | Show filter form                      |

```tsx
// Custom table columns
const customColumns = [
    {
        title: "Product Name",
        dataIndex: "name",
        key: "name",
        sorter: true,
        render: (text, record) => (
            <div>
                <strong>{text}</strong>
                <br />
                <small style={{ color: "#666" }}>{record.sku}</small>
            </div>
        ),
    },
    {
        title: "Price",
        dataIndex: "price",
        key: "price",
        sorter: true,
        align: "right",
    },
    {
        title: "Status",
        dataIndex: "active",
        key: "active",
        filters: [
            { text: "Active", value: true },
            { text: "Inactive", value: false },
        ],
        render: active => <Tag color={active ? "green" : "red"}>{active ? "Active" : "Inactive"}</Tag>,
    },
];

<QuickUI
    title="Products"
    formSchema={productSchema}
    tableColumns={customColumns}
    tableProps={{
        scroll: { x: 1200 },
        size: "small",
        bordered: true,
        pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["10", "20", "50", "100"],
        },
    }}
    formProps={{
        layout: "horizontal",
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    }}
    emptyText="No products found. Click 'Add Product' to get started."
    showToggleCrudType={true}
    showFilter={true}
/>;
```

## Type Definitions

### FormSchema Interface

```typescript
interface FormSchema {
    layout?: "horizontal" | "vertical" | "inline";
    fields?: FormField[];
    sections?: FormSection[];
    tabs?: FormTab[];
    steps?: FormStep[];
}

interface FormField {
    // Basic properties
    name: string;
    label: string;
    type: FieldType;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    defaultValue?: any;

    // Table configuration
    hideInTable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    render?: (value: any, record: any) => ReactNode;

    // Layout
    grid?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        xxl?: number;
    };

    // Validation
    rules?: ValidationRule[];
    dependencies?: FieldDependency[];

    // Field-specific options
    options?: Option[];
    props?: any;
}

type FieldType =
    | "text"
    | "number"
    | "email"
    | "password"
    | "url"
    | "tel"
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
    | "month"
    | "week"
    | "year"
    | "textarea"
    | "richtext"
    | "markdown"
    | "upload"
    | "image"
    | "file"
    | "cascader"
    | "treeselect"
    | "transfer"
    | "color"
    | "slider"
    | "rate"
    | "progress"
    | "json"
    | "code"
    | "formula"
    | "location"
    | "map"
    | "coordinates"
    | "custom";

interface ValidationRule {
    required?: boolean;
    message?: string;
    min?: number;
    max?: number;
    len?: number;
    pattern?: RegExp;
    validator?: (rule: any, value: any) => Promise<void>;
    type?:
        | "string"
        | "number"
        | "boolean"
        | "method"
        | "regexp"
        | "integer"
        | "float"
        | "array"
        | "object"
        | "enum"
        | "date"
        | "url"
        | "hex"
        | "email";
}

interface FieldDependency {
    type: "show_if" | "hide_if" | "enable_if" | "disable_if" | "calculate" | "validate";
    conditions: DependencyCondition[];
    callback?: (form: any, values: any) => any;
}

interface DependencyCondition {
    field: string;
    operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "is_empty" | "is_not_empty";
    value?: any;
}
```

### Permission Types

```typescript
type Permission = string | string[];

interface PermissionConfig {
    view?: Permission;
    create?: Permission;
    edit?: Permission;
    delete?: Permission;
    filter?: Permission;
    export?: Permission;
    [key: string]: Permission | undefined;
}

type PermissionChecker = (permission: Permission) => boolean;

// Advanced permission with context
type ContextualPermission = (record?: any, context?: any) => Permission;

interface AdvancedPermissionConfig {
    view?: Permission | ContextualPermission;
    create?: Permission | ContextualPermission;
    edit?: Permission | ContextualPermission;
    delete?: Permission | ContextualPermission;
    filter?: Permission | ContextualPermission;
    export?: Permission | ContextualPermission;
}
```

### Route Configuration

```typescript
interface RouteConfig {
    basePath: string;
    createPath?: string;
    editPath?: string;
    viewPath?: string;
    listPath?: string;
    paramName?: string;
    queryParams?: Record<string, string>;
}

// Example route configurations
const routeConfigs = {
    // Simple REST pattern
    simple: {
        basePath: "/users",
        createPath: "/users/create",
        editPath: "/users/[id]/edit",
        viewPath: "/users/[id]",
        listPath: "/users",
    },

    // Nested resource
    nested: {
        basePath: "/projects/[projectId]/tasks",
        createPath: "/projects/[projectId]/tasks/create",
        editPath: "/projects/[projectId]/tasks/[id]/edit",
        viewPath: "/projects/[projectId]/tasks/[id]",
        listPath: "/projects/[projectId]/tasks",
    },

    // Custom paths
    custom: {
        basePath: "/dashboard/user-management",
        createPath: "/dashboard/user-management/new-user",
        editPath: "/dashboard/user-management/edit/[userId]",
        viewPath: "/dashboard/user-management/profile/[userId]",
        listPath: "/dashboard/user-management",
        paramName: "userId",
    },
};
```

## Form Schema Configuration

### Basic Field Types

```typescript
// Text inputs
const textFields: FormField[] = [
    {
        name: "firstName",
        label: "First Name",
        type: "text",
        required: true,
        placeholder: "Enter first name",
        rules: [
            { required: true, message: "First name is required" },
            { min: 2, message: "First name must be at least 2 characters" },
            { max: 50, message: "First name cannot exceed 50 characters" },
        ],
    },
    {
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
        rules: [
            { required: true, message: "Email is required" },
            { type: "email", message: "Please enter a valid email address" },
        ],
    },
    {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        placeholder: "+1 (555) 123-4567",
        rules: [{ pattern: /^\+?[\d\s\-\(\)]+$/, message: "Please enter a valid phone number" }],
    },
    {
        name: "website",
        label: "Website",
        type: "url",
        placeholder: "https://example.com",
        rules: [{ type: "url", message: "Please enter a valid URL" }],
    },
];

// Number inputs
const numberFields: FormField[] = [
    {
        name: "age",
        label: "Age",
        type: "number",
        props: {
            min: 0,
            max: 120,
            step: 1,
        },
        rules: [{ type: "number", min: 0, max: 120, message: "Age must be between 0 and 120" }],
    },
    {
        name: "price",
        label: "Price",
        type: "number",
        props: {
            precision: 2,
            formatter: value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            parser: value => value.replace(/\$\s?|(,*)/g, ""),
            min: 0,
        },
        rules: [
            { required: true, message: "Price is required" },
            { type: "number", min: 0, message: "Price must be positive" },
        ],
    },
];

// Selection fields
const selectionFields: FormField[] = [
    {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        filterable: true,
        options: [
            { value: "electronics", label: "Electronics" },
            { value: "clothing", label: "Clothing" },
            { value: "books", label: "Books" },
            { value: "home", label: "Home & Garden" },
        ],
        props: {
            showSearch: true,
            allowClear: true,
            placeholder: "Select a category",
        },
    },
    {
        name: "tags",
        label: "Tags",
        type: "multiselect",
        options: [
            { value: "new", label: "New" },
            { value: "sale", label: "On Sale" },
            { value: "featured", label: "Featured" },
            { value: "popular", label: "Popular" },
        ],
        props: {
            mode: "tags",
            placeholder: "Select or create tags",
        },
    },
    {
        name: "priority",
        label: "Priority",
        type: "radio",
        options: [
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
            { value: "urgent", label: "Urgent" },
        ],
        defaultValue: "medium",
    },
];

// Date and time fields
const dateTimeFields: FormField[] = [
    {
        name: "birthDate",
        label: "Birth Date",
        type: "date",
        props: {
            format: "YYYY-MM-DD",
            disabledDate: current => current && current > moment().endOf("day"),
        },
    },
    {
        name: "eventDateRange",
        label: "Event Duration",
        type: "daterange",
        props: {
            format: "YYYY-MM-DD HH:mm",
            showTime: true,
        },
    },
    {
        name: "workingHours",
        label: "Working Hours",
        type: "time",
        props: {
            format: "HH:mm",
            minuteStep: 15,
        },
    },
];

// File upload fields
const uploadFields: FormField[] = [
    {
        name: "avatar",
        label: "Profile Picture",
        type: "image",
        props: {
            listType: "picture-card",
            maxCount: 1,
            accept: "image/*",
            beforeUpload: file => {
                const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
                if (!isJpgOrPng) {
                    message.error("You can only upload JPG/PNG files!");
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    message.error("Image must smaller than 2MB!");
                }
                return isJpgOrPng && isLt2M;
            },
        },
    },
    {
        name: "documents",
        label: "Documents",
        type: "upload",
        props: {
            multiple: true,
            accept: ".pdf,.doc,.docx,.xls,.xlsx",
            action: "/api/upload",
            onChange: info => {
                if (info.file.status === "done") {
                    message.success(`${info.file.name} uploaded successfully`);
                } else if (info.file.status === "error") {
                    message.error(`${info.file.name} upload failed`);
                }
            },
        },
    },
];
```

### Complex Field Configurations

```typescript
// Conditional fields
const conditionalFields: FormField[] = [
    {
        name: "hasShipping",
        label: "Requires Shipping",
        type: "switch",
        defaultValue: false
    },
    {
        name: "shippingWeight",
        label: "Shipping Weight (kg)",
        type: "number",
        dependencies: [
            {
                type: "show_if",
                conditions: [
                    { field: "hasShipping", operator: "equals", value: true }
                ]
            }
        ],
        rules: [
            { required: true, message: "Shipping weight is required when shipping is enabled" }
        ]
    },
    {
        name: "shippingDimensions",
        label: "Dimensions",
        type: "custom",
        dependencies: [
            {
                type: "show_if",
                conditions: [
                    { field: "hasShipping", operator: "equals", value: true }
                ]
            }
        ],
        render: (value, record, form) => (
            <Row gutter={8}>
                <Col span={8}>
                    <InputNumber
                        placeholder="Length"
                        value={value?.length}
                        onChange={(val) =>
                            form.setFieldValue('shippingDimensions', {
                                ...value,
                                length: val
                            })
                        }
                    />
                </Col>
                <Col span={8}>
                    <InputNumber
                        placeholder="Width"
                        value={value?.width}
                        onChange={(val) =>
                            form.setFieldValue('shippingDimensions', {
                                ...value,
                                width: val
                            })
                        }
                    />
                </Col>
                <Col span={8}>
                    <InputNumber
                        placeholder="Height"
                        value={value?.height}
                        onChange={(val) =>
                            form.setFieldValue('shippingDimensions', {
                                ...value,
                                height: val
                            })
                        }
                    />
                </Col>
            </Row>
        )
    }
];

// Calculated fields
const calculatedFields: FormField[] = [
    {
        name: "quantity",
        label: "Quantity",
        type: "number",
        required: true,
        defaultValue: 1
    },
    {
        name: "unitPrice",
        label: "Unit Price",
        type: "number",
        required: true,
        props: { precision: 2 }
    },
    {
        name: "totalPrice",
        label: "Total Price",
        type: "number",
        disabled: true,
        props: { precision: 2 },
        dependencies: [
            {
                type: "calculate",
                conditions: [
                    { field: "quantity", operator: "is_not_empty" },
                    { field: "unitPrice", operator: "is_not_empty" }
                ],
                callback: (form, values) => {
                    const total = (values.quantity || 0) * (values.unitPrice || 0);
                    return Number(total.toFixed(2));
                }
            }
        ]
    }
];

// Dynamic option fields
const dynamicFields: FormField[] = [
    {
        name: "country",
        label: "Country",
        type: "select",
        required: true,
        options: countries, // Loaded from API
        props: {
            showSearch: true,
            placeholder: "Select country"
        }
    },
    {
        name: "state",
        label: "State/Province",
        type: "select",
        dependencies: [
            {
                type: "show_if",
                conditions: [
                    { field: "country", operator: "is_not_empty" }
                ]
            }
        ],
        options: [], // Will be populated based on country selection
        props: {
            showSearch: true,
            placeholder: "Select state"
        }
    },
    {
        name: "city",
        label: "City",
        type: "select",
        dependencies: [
            {
                type: "show_if",
                conditions: [
                    { field: "state", operator: "is_not_empty" }
                ]
            }
        ],
        options: [], // Will be populated based on state selection
        props: {
            showSearch: true,
            placeholder: "Select city"
        }
    }
];
```

### Schema Organization Patterns

```typescript
// Simple field list
const simpleSchema: FormSchema = {
    layout: "vertical",
    fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "active", label: "Active", type: "switch", defaultValue: true },
    ],
};

// Grouped sections
const sectionedSchema: FormSchema = {
    layout: "vertical",
    sections: [
        {
            title: "Personal Information",
            description: "Basic personal details",
            fields: [
                { name: "firstName", label: "First Name", type: "text", required: true },
                { name: "lastName", label: "Last Name", type: "text", required: true },
                { name: "email", label: "Email", type: "email", required: true },
            ],
        },
        {
            title: "Account Settings",
            description: "Account configuration and permissions",
            fields: [
                { name: "role", label: "Role", type: "select", options: roleOptions },
                { name: "active", label: "Active", type: "switch", defaultValue: true },
                { name: "permissions", label: "Permissions", type: "multiselect", options: permissionOptions },
            ],
        },
    ],
};

// Tabbed interface
const tabbedSchema: FormSchema = {
    layout: "vertical",
    tabs: [
        {
            key: "basic",
            title: "Basic Info",
            icon: "UserOutlined",
            fields: [
                { name: "name", label: "Product Name", type: "text", required: true },
                { name: "description", label: "Description", type: "textarea" },
                { name: "category", label: "Category", type: "select", options: categoryOptions },
            ],
        },
        {
            key: "pricing",
            title: "Pricing",
            icon: "DollarOutlined",
            fields: [
                { name: "basePrice", label: "Base Price", type: "number", required: true },
                { name: "salePrice", label: "Sale Price", type: "number" },
                { name: "costPrice", label: "Cost", type: "number" },
            ],
        },
        {
            key: "inventory",
            title: "Inventory",
            icon: "InboxOutlined",
            fields: [
                { name: "sku", label: "SKU", type: "text", required: true },
                { name: "stock", label: "Stock Quantity", type: "number" },
                { name: "active", label: "Active", type: "switch", defaultValue: true },
            ],
        },
    ],
};

// Multi-step wizard
const wizardSchema: FormSchema = {
    layout: "vertical",
    steps: [
        {
            title: "Basic Information",
            description: "Enter basic product details",
            fields: [
                { name: "name", label: "Product Name", type: "text", required: true },
                { name: "category", label: "Category", type: "select", required: true, options: categoryOptions },
            ],
        },
        {
            title: "Pricing & Inventory",
            description: "Set pricing and inventory details",
            fields: [
                { name: "price", label: "Price", type: "number", required: true },
                { name: "stock", label: "Stock", type: "number", required: true },
            ],
        },
        {
            title: "Media & Description",
            description: "Add images and detailed description",
            fields: [
                { name: "images", label: "Product Images", type: "image" },
                { name: "description", label: "Detailed Description", type: "richtext" },
            ],
        },
        {
            title: "Review & Submit",
            description: "Review all details before submitting",
            fields: [], // Review step with summary
            isReview: true,
        },
    ],
};
```

## Action Configuration

```typescript
interface ActionConfig {
    view?: boolean;
    edit?: boolean;
    delete?: boolean;
    extraActions?: (record: any, permissions?: { [key: string]: boolean }) => ReactNode[];
}

// Basic actions
const basicActions: ActionConfig = {
    view: true,
    edit: true,
    delete: true
};

// Custom extra actions
const advancedActions: ActionConfig = {
    view: true,
    edit: true,
    delete: true,
    extraActions: (record, permissions) => {
        const actions = [];

        // Conditional actions based on record state
        if (record.status === 'draft' && permissions?.canEdit) {
            actions.push(
                <Button
                    key="publish"
                    size="small"
                    type="primary"
                    onClick={() => publishRecord(record)}
                >
                    Publish
                </Button>
            );
        }

        if (record.status === 'published' && permissions?.canEdit) {
            actions.push(
                <Button
                    key="unpublish"
                    size="small"
                    onClick={() => unpublishRecord(record)}
                >
                    Unpublish
                </Button>
            );
        }

        // Clone action
        if (permissions?.canCreate) {
            actions.push(
                <Button
                    key="duplicate"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => duplicateRecord(record)}
                >
                    Duplicate
                </Button>
            );
        }

        // Archive action (instead of delete for some records)
        if (record.canArchive && permissions?.canDelete) {
            actions.push(
                <Popconfirm
                    key="archive"
                    title="Archive this record?"
                    onConfirm={() => archiveRecord(record)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button size="small" danger icon={<ArchiveOutlined />}>
                        Archive
                    </Button>
                </Popconfirm>
            );
        }

        // Dropdown for many actions
        if (actions.length > 2) {
            const menuItems = actions.slice(2).map((action, index) => ({
                key: index,
                label: action
            }));

            return [
                ...actions.slice(0, 2),
                <Dropdown
                    key="more"
                    menu={{ items: menuItems }}
                    trigger={['click']}
                >
                    <Button size="small" icon={<MoreOutlined />} />
                </Dropdown>
            ];
        }

        return actions;
    }
};

// Role-based actions
const roleBasedActions: ActionConfig = {
    view: true,
    edit: true,
    delete: false, // Handled by extraActions
    extraActions: (record, permissions) => {
        const actions = [];
        const userRole = getCurrentUserRole();

        // Owners can always edit their records
        if (record.ownerId === getCurrentUserId()) {
            actions.push(
                <Button
                    key="edit-own"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => editRecord(record)}
                >
                    Edit
                </Button>
            );
        }

        // Managers can approve/reject
        if (userRole === 'manager' && record.status === 'pending') {
            actions.push(
                <Button
                    key="approve"
                    size="small"
                    type="primary"
                    onClick={() => approveRecord(record)}
                >
                    Approve
                </Button>,
                <Button
                    key="reject"
                    size="small"
                    danger
                    onClick={() => rejectRecord(record)}
                >
                    Reject
                </Button>
            );
        }

        // Admins can delete
        if (userRole === 'admin') {
            actions.push(
                <Popconfirm
                    key="delete"
                    title="Are you sure you want to delete this record?"
                    onConfirm={() => deleteRecord(record)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button size="small" danger icon={<DeleteOutlined />}>
                        Delete
                    </Button>
                </Popconfirm>
            );
        }

        return actions;
    }
};
```

## Batch Actions Configuration

```typescript
// Simple batch actions
const simpleBatchActions = (selectedKeys: any[], selectedRows: any[], permissions?: any) => (
    <Space>
        {permissions?.canEdit && (
            <Button
                type="primary"
                onClick={() => bulkEdit(selectedKeys)}
                disabled={selectedKeys.length === 0}
            >
                Edit Selected ({selectedKeys.length})
            </Button>
        )}
        {permissions?.canDelete && (
            <Popconfirm
                title={`Are you sure you want to delete ${selectedKeys.length} items?`}
                onConfirm={() => bulkDelete(selectedKeys)}
                disabled={selectedKeys.length === 0}
            >
                <Button danger disabled={selectedKeys.length === 0}>
                    Delete Selected ({selectedKeys.length})
                </Button>
            </Popconfirm>
        )}
        <Button
            icon={<ExportOutlined />}
            onClick={() => exportSelected(selectedRows)}
            disabled={selectedKeys.length === 0}
        >
            Export Selected
        </Button>
    </Space>
);

// Advanced batch actions with status management
const advancedBatchActions = (selectedKeys: any[], selectedRows: any[], permissions?: any) => {
    const canActivate = selectedRows.some(row => !row.active);
    const canDeactivate = selectedRows.some(row => row.active);
    const hasDrafts = selectedRows.some(row => row.status === 'draft');
    const hasPublished = selectedRows.some(row => row.status === 'published');

    return (
        <Space wrap>
            {/* Status actions */}
            {permissions?.canEdit && (
                <Space>
                    {canActivate && (
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={() => bulkUpdateStatus(selectedKeys, 'active', true)}
                        >
                            Activate ({selectedKeys.length})
                        </Button>
                    )}
                    {canDeactivate && (
                        <Button
                            icon={<StopOutlined />}
                            onClick={() => bulkUpdateStatus(selectedKeys, 'active', false)}
                        >
                            Deactivate ({selectedKeys.length})
                        </Button>
                    )}
                    {hasDrafts && (
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={() => bulkUpdateStatus(selectedKeys, 'status', 'published')}
                        >
                            Publish Drafts
                        </Button>
                    )}
                    {hasPublished && (
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => bulkUpdateStatus(selectedKeys, 'status', 'draft')}
                        >
                            Unpublish
                        </Button>
                    )}
                </Space>
            )}

            {/* Category/Tag actions */}
            {permissions?.canEdit && (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'category',
                                label: 'Change Category',
                                icon: <TagOutlined />,
                                onClick: () => showBulkCategoryModal(selectedKeys)
                            },
                            {
                                key: 'tags',
                                label: 'Add Tags',
                                icon: <TagsOutlined />,
                                onClick: () => showBulkTagModal(selectedKeys)
                            },
                            {
                                key: 'assign',
                                label: 'Assign To',
                                icon: <UserOutlined />,
                                onClick: () => showBulkAssignModal(selectedKeys)
                            }
                        ]
                    }}
                    trigger={['click']}
                >
                    <Button icon={<MoreOutlined />}>
                        Bulk Edit <DownOutlined />
                    </Button>
                </Dropdown>
            )}

            {/* Export actions */}
            <Dropdown
                menu={{
                    items: [
                        {
                            key: 'csv',
                            label: 'Export as CSV',
                            icon: <FileExcelOutlined />,
                            onClick: () => exportSelected(selectedRows, 'csv')
                        },
                        {
                            key: 'pdf',
                            label: 'Export as PDF',
                            icon: <FilePdfOutlined />,
                            onClick: () => exportSelected(selectedRows, 'pdf')
                        },
                        {
                            key: 'json',
                            label: 'Export as JSON',
                            icon: <FileTextOutlined />,
                            onClick: () => exportSelected(selectedRows, 'json')
                        }
                    ]
                }}
                trigger={['click']}
            >
                <Button icon={<ExportOutlined />}>
                    Export <DownOutlined />
                </Button>
            </Dropdown>

            {/* Delete action */}
            {permissions?.canDelete && (
                <Popconfirm
                    title={`Are you sure you want to delete ${selectedKeys.length} items?`}
                    description="This action cannot be undone."
                    onConfirm={() => bulkDelete(selectedKeys)}
                    okText="Yes, Delete"
                    cancelText="Cancel"
                >
                    <Button danger icon={<DeleteOutlined />}>
                        Delete ({selectedKeys.length})
                    </Button>
                </Popconfirm>
            )}
        </Space>
    );
};

// Context-aware batch actions
const contextAwareBatchActions = (selectedKeys: any[], selectedRows: any[], permissions?: any) => {
    // Different actions based on selection
    if (selectedKeys.length === 1) {
        // Single item selected
        const record = selectedRows[0];
        return (
            <Space>
                <Button type="primary" onClick={() => editRecord(record)}>
                    Edit "{record.name}"
                </Button>
                <Button onClick={() => duplicateRecord(record)}>
                    Duplicate
                </Button>
                {record.status === 'published' && (
                    <Button onClick={() => createVariant(record)}>
                        Create Variant
                    </Button>
                )}
            </Space>
        );
    }

    // Multiple items selected
    return (
        <Space>
            <Button
                type="primary"
                onClick={() => showBulkEditModal(selectedKeys)}
            >
                Bulk Edit ({selectedKeys.length} items)
            </Button>
            <Button onClick={() => compareItems(selectedRows)}>
                Compare Selected
            </Button>
            <Button
                onClick={() => createBundle(selectedRows)}
                disabled={selectedKeys.length < 2}
            >
                Create Bundle
            </Button>
        </Space>
    );
};
```

## Statistics Configuration

```typescript
// Simple statistics
const simpleStats = (data: any[]): StatItem[] => [
    {
        key: 'total',
        label: 'Total Items',
        value: data.length,
        color: '#1890ff',
        icon: <DatabaseOutlined />
    },
    {
        key: 'active',
        label: 'Active Items',
        value: data.filter(item => item.active).length,
        color: '#52c41a',
        icon: <CheckCircleOutlined />
    }
];

// Advanced statistics with calculations
const advancedStats = (data: any[]): StatItem[] => {
    const total = data.length;
    const active = data.filter(item => item.active).length;
    const totalValue = data.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
    const avgValue = total > 0 ? totalValue / total : 0;

    return [
        {
            key: 'total',
            label: 'Total Products',
            value: total.toLocaleString(),
            color: '#1890ff',
            icon: <ShopOutlined />
        },
        {
            key: 'active',
            label: 'Active Products',
            value: `${active} (${total > 0 ? Math.round((active / total) * 100) : 0}%)`,
            color: '#52c41a',
            icon: <CheckCircleOutlined />
        },
        {
            key: 'value',
            label: 'Total Inventory Value',
            value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            color: '#722ed1',
            icon: <DollarOutlined />
        },
        {
            key: 'average',
            label: 'Average Value',
            value: `$${avgValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            color: '#fa8c16',
            icon: <BarChartOutlined />
        }
    ];
};

// Dynamic statistics with trends
const trendStats = (data: any[]): StatItem[] => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const recentItems = data.filter(item => new Date(item.createdAt) > lastMonth);
    const percentageGrowth = data.length > 0 ? (recentItems.length / data.length) * 100 : 0;

    const lowStock = data.filter(item => item.stock < item.minStock).length;
    const outOfStock = data.filter(item => item.stock === 0).length;

    return [
        {
            key: 'total',
            label: 'Total Products',
            value: (
                <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {data.length.toLocaleString()}
                    </div>
                    {percentageGrowth > 0 && (
                        <div style={{ color: '#52c41a', fontSize: '12px' }}>
                            <ArrowUpOutlined /> {percentageGrowth.toFixed(1)}% this month
                        </div>
                    )}
                </div>
            ),
            color: '#1890ff',
            icon: <ShopOutlined />
        },
        {
            key: 'alerts',
            label: 'Stock Alerts',
            value: (
                <div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: lowStock > 0 ? '#fa541c' : '#52c41a' }}>
                        {lowStock}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        {outOfStock} out of stock
                    </div>
                </div>
            ),
            color: lowStock > 0 ? '#fa541c' : '#52c41a',
            icon: <AlertOutlined />
        }
    ];
};

// Interactive statistics
const interactiveStats = (data: any[], onStatClick?: (key: string) => void): StatItem[] => [
    {
        key: 'total',
        label: 'Total Items',
        value: (
            <Button
                type="link"
                size="large"
                onClick={() => onStatClick?.('total')}
                style={{ padding: 0, height: 'auto', fontSize: '24px', fontWeight: 'bold' }}
            >
                {data.length}
            </Button>
        ),
        color: '#1890ff',
        icon: <DatabaseOutlined />
    },
    {
        key: 'active',
        label: 'Active Items',
        value: (
            <Button
                type="link"
                size="large"
                onClick={() => onStatClick?.('active')}
                style={{ padding: 0, height: 'auto', fontSize: '24px', fontWeight: 'bold' }}
            >
                {data.filter(item => item.active).length}
            </Button>
        ),
        color: '#52c41a',
        icon: <CheckCircleOutlined />
    }
];
```

## Advanced Examples

### Complete E-commerce Product Management

```tsx
const EcommerceProductCRUD = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Complex product schema
    const productSchema: FormSchema = {
        layout: "vertical",
        tabs: [
            {
                key: "basic",
                title: "Basic Information",
                icon: "InfoCircleOutlined",
                fields: [
                    {
                        name: "name",
                        label: "Product Name",
                        type: "text",
                        required: true,
                        filterable: true,
                        grid: { xs: 24, md: 12 },
                        rules: [
                            { required: true, message: "Product name is required" },
                            { min: 3, message: "Product name must be at least 3 characters" },
                        ],
                    },
                    {
                        name: "sku",
                        label: "SKU",
                        type: "text",
                        required: true,
                        grid: { xs: 24, md: 12 },
                        props: {
                            placeholder: "e.g., PRD-001",
                            style: { textTransform: "uppercase" },
                        },
                    },
                    {
                        name: "category",
                        label: "Category",
                        type: "cascader",
                        required: true,
                        filterable: true,
                        options: categories,
                        grid: { xs: 24, md: 12 },
                        props: {
                            showSearch: true,
                            placeholder: "Select category",
                        },
                    },
                    {
                        name: "brand",
                        label: "Brand",
                        type: "select",
                        filterable: true,
                        options: brands,
                        grid: { xs: 24, md: 12 },
                        props: {
                            showSearch: true,
                            allowClear: true,
                        },
                    },
                    {
                        name: "description",
                        label: "Description",
                        type: "richtext",
                        grid: { xs: 24 },
                        props: {
                            placeholder: "Enter detailed product description...",
                        },
                    },
                    {
                        name: "tags",
                        label: "Tags",
                        type: "multiselect",
                        options: productTags,
                        grid: { xs: 24 },
                        props: {
                            mode: "tags",
                            placeholder: "Add tags for better searchability",
                        },
                    },
                ],
            },
            {
                key: "pricing",
                title: "Pricing & Inventory",
                icon: "DollarOutlined",
                fields: [
                    {
                        name: "price",
                        label: "Regular Price",
                        type: "number",
                        required: true,
                        grid: { xs: 24, md: 8 },
                        props: {
                            precision: 2,
                            min: 0,
                            formatter: value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            parser: value => value.replace(/\$\s?|(,*)/g, ""),
                        },
                    },
                    {
                        name: "salePrice",
                        label: "Sale Price",
                        type: "number",
                        grid: { xs: 24, md: 8 },
                        props: {
                            precision: 2,
                            min: 0,
                            formatter: value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                            parser: value => value.replace(/\$\s?|(,*)/g, ""),
                        },
                        dependencies: [
                            {
                                type: "validate",
                                conditions: [{ field: "price", operator: "is_not_empty" }],
                                callback: (form, values) => {
                                    if (values.salePrice && values.salePrice >= values.price) {
                                        throw new Error("Sale price must be less than regular price");
                                    }
                                },
                            },
                        ],
                    },
                    {
                        name: "costPrice",
                        label: "Cost Price",
                        type: "number",
                        grid: { xs: 24, md: 8 },
                        props: {
                            precision: 2,
                            min: 0,
                        },
                    },
                    {
                        name: "trackInventory",
                        label: "Track Inventory",
                        type: "switch",
                        defaultValue: true,
                        grid: { xs: 24, md: 12 },
                    },
                    {
                        name: "stock",
                        label: "Stock Quantity",
                        type: "number",
                        grid: { xs: 24, md: 12 },
                        dependencies: [
                            {
                                type: "show_if",
                                conditions: [{ field: "trackInventory", operator: "equals", value: true }],
                            },
                        ],
                        props: {
                            min: 0,
                            step: 1,
                        },
                    },
                    {
                        name: "minStock",
                        label: "Minimum Stock Alert",
                        type: "number",
                        grid: { xs: 24, md: 12 },
                        dependencies: [
                            {
                                type: "show_if",
                                conditions: [{ field: "trackInventory", operator: "equals", value: true }],
                            },
                        ],
                        props: {
                            min: 0,
                            step: 1,
                        },
                    },
                ],
            },
            {
                key: "media",
                title: "Media & Assets",
                icon: "PictureOutlined",
                fields: [
                    {
                        name: "images",
                        label: "Product Images",
                        type: "image",
                        props: {
                            listType: "picture-card",
                            multiple: true,
                            maxCount: 10,
                            accept: "image/*",
                        },
                    },
                    {
                        name: "video",
                        label: "Product Video",
                        type: "upload",
                        props: {
                            accept: "video/*",
                            maxCount: 1,
                        },
                    },
                    {
                        name: "documents",
                        label: "Product Documents",
                        type: "upload",
                        props: {
                            accept: ".pdf,.doc,.docx",
                            multiple: true,
                        },
                    },
                ],
            },
        ],
    };

    // Custom table columns
    const columns = [
        {
            title: "Product",
            dataIndex: "name",
            key: "name",
            sorter: true,
            render: (text, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {record.images?.[0] && <Avatar src={record.images[0].url} size={40} shape="square" />}
                    <div>
                        <div style={{ fontWeight: "bold" }}>{text}</div>
                        <div style={{ fontSize: "12px", color: "#666" }}>SKU: {record.sku}</div>
                    </div>
                </div>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            filters: categories.map(cat => ({ text: cat.label, value: cat.value })),
            render: category => category?.join(" > "),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            sorter: true,
            align: "right",
            render: (price, record) => (
                <div>
                    {record.salePrice ? (
                        <>
                            <div style={{ textDecoration: "line-through", color: "#999" }}>${price?.toFixed(2)}</div>
                            <div style={{ color: "#f50", fontWeight: "bold" }}>${record.salePrice?.toFixed(2)}</div>
                        </>
                    ) : (
                        <div>${price?.toFixed(2)}</div>
                    )}
                </div>
            ),
        },
        {
            title: "Stock",
            dataIndex: "stock",
            key: "stock",
            align: "center",
            render: (stock, record) => {
                if (!record.trackInventory) {
                    return <Tag color="blue">Not Tracked</Tag>;
                }

                let color = "green";
                if (stock === 0) color = "red";
                else if (stock <= record.minStock) color = "orange";

                return <Tag color={color}>{stock}</Tag>;
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            filters: [
                { text: "Active", value: "active" },
                { text: "Draft", value: "draft" },
                { text: "Archived", value: "archived" },
            ],
            render: status => {
                const config = {
                    active: { color: "green", text: "Active" },
                    draft: { color: "orange", text: "Draft" },
                    archived: { color: "red", text: "Archived" },
                };
                const { color, text } = config[status] || config.draft;
                return <Tag color={color}>{text}</Tag>;
            },
        },
    ];

    return (
        <QuickUI
            title="Product Management"
            formSchema={productSchema}
            initialData={products}
            tableColumns={columns}
            crudType="drawer"
            // Statistics
            statistics={data => [
                {
                    key: "total",
                    label: "Total Products",
                    value: data.length,
                    color: "#1890ff",
                    icon: <ShopOutlined />,
                },
                {
                    key: "active",
                    label: "Active Products",
                    value: data.filter(p => p.status === "active").length,
                    color: "#52c41a",
                    icon: <CheckCircleOutlined />,
                },
                {
                    key: "lowStock",
                    label: "Low Stock Alerts",
                    value: data.filter(p => p.trackInventory && p.stock <= p.minStock).length,
                    color: "#fa541c",
                    icon: <AlertOutlined />,
                },
                {
                    key: "value",
                    label: "Total Value",
                    value: `$${data.reduce((sum, p) => sum + (p.price * p.stock || 0), 0).toFixed(2)}`,
                    color: "#722ed1",
                    icon: <DollarOutlined />,
                },
            ]}
            // Row selection and batch actions
            rowSelection={true}
            batchActions={(keys, rows, permissions) => (
                <Space wrap>
                    <Button
                        type="primary"
                        onClick={() => bulkUpdateStatus(keys, "active")}
                        disabled={!permissions?.canEdit}
                    >
                        Activate Selected ({keys.length})
                    </Button>
                    <Button onClick={() => bulkUpdateStatus(keys, "archived")} disabled={!permissions?.canEdit}>
                        Archive Selected
                    </Button>
                    <Button onClick={() => bulkPriceUpdate(keys)} disabled={!permissions?.canEdit}>
                        Bulk Price Update
                    </Button>
                    <Button icon={<ExportOutlined />} onClick={() => exportProducts(rows, "csv")}>
                        Export CSV
                    </Button>
                </Space>
            )}
            // Actions
            actions={{
                view: true,
                edit: true,
                delete: true,
                extraActions: (record, permissions) =>
                    [
                        <Button
                            key="duplicate"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => duplicateProduct(record)}
                            disabled={!permissions?.canCreate}
                        >
                            Duplicate
                        </Button>,
                        record.status === "draft" && (
                            <Button
                                key="publish"
                                size="small"
                                type="primary"
                                onClick={() => publishProduct(record)}
                                disabled={!permissions?.canEdit}
                            >
                                Publish
                            </Button>
                        ),
                    ].filter(Boolean),
            }}
            // CRUD handlers
            onRecordCreate={async productData => {
                setLoading(true);
                try {
                    const response = await api.products.create(productData);
                    setProducts(prev => [...prev, response.data]);
                    message.success("Product created successfully");
                    return response.data;
                } catch (error) {
                    message.error("Failed to create product");
                    throw error;
                } finally {
                    setLoading(false);
                }
            }}
            onRecordUpdate={async productData => {
                setLoading(true);
                try {
                    const response = await api.products.update(productData.id, productData);
                    setProducts(prev => prev.map(p => (p.id === productData.id ? response.data : p)));
                    message.success("Product updated successfully");
                    return response.data;
                } catch (error) {
                    message.error("Failed to update product");
                    throw error;
                } finally {
                    setLoading(false);
                }
            }}
            onRecordDelete={async product => {
                setLoading(true);
                try {
                    await api.products.delete(product.id);
                    setProducts(prev => prev.filter(p => p.id !== product.id));
                    message.success("Product deleted successfully");
                } catch (error) {
                    message.error("Failed to delete product");
                    throw error;
                } finally {
                    setLoading(false);
                }
            }}
            // Advanced filtering
            onFilter={async (data, filters) => {
                // Server-side filtering and pagination
                const params = {
                    ...filters,
                    page: filters._pagination?.page || 1,
                    pageSize: filters._pagination?.pageSize || 10,
                };

                const response = await api.products.search(params);
                return {
                    data: response.data.products,
                    total: response.data.total,
                    current: response.data.page,
                    pageSize: response.data.pageSize,
                };
            }}
            // Permissions
            permissions={{
                view: "products.view",
                create: "products.create",
                edit: "products.edit",
                delete: "products.delete",
                export: "products.export",
            }}
            checkPermission={checkUserPermission}
            // Table customization
            tableProps={{
                loading,
                scroll: { x: 1200 },
                pagination: {
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSizeOptions: ["10", "25", "50", "100"],
                },
            }}
        />
    );
};
```

This comprehensive documentation covers all aspects of the QuickUI component configuration, from basic usage to advanced scenarios with complex forms, permissions, and batch operations.
