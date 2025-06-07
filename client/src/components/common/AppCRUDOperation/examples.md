# QuickUI - Complete Examples & Use Cases

## Table of Contents

1. [All Props Explanation](#all-props-explanation)
2. [CRUD Type Examples](#crud-type-examples)
3. [Form Schema Patterns](#form-schema-patterns)
4. [Permission Systems](#permission-systems)
5. [Advanced Features](#advanced-features)
6. [Real-World Examples](#real-world-examples)

## All Props Explanation

### Essential Props (Required/Core)

#### `title: string` ✅ Required

**Purpose**: Display title for the CRUD interface
**Usage**: Shows in page headers, modal titles, breadcrumbs

```tsx
title = "User Management";
title = "Product Catalog";
title = "Order Processing";
```

#### `formSchema: FormSchema` ✅ Required

**Purpose**: Defines form structure and auto-generates table columns
**Usage**: Controls form fields, validation, table display

```tsx
formSchema={{
    layout: "vertical",
    fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true }
    ]
}}
```

### UI Configuration Props

#### `crudType: CrudType` (Default: "modal")

**Purpose**: Defines how forms are displayed
**Options**: "modal" | "drawer" | "page" | "route"
**Why Use Each**:

- **modal**: Quick edits, simple forms (recommended for most cases)
- **drawer**: Medium complexity forms, side-by-side viewing
- **page**: Complex forms, multi-step processes
- **route**: Full navigation control, bookmarkable URLs

```tsx
// Modal Example (Quick edits)
<QuickUI crudType="modal" title="Tags" formSchema={simpleTagSchema} />

// Drawer Example (Medium complexity)
<QuickUI crudType="drawer" title="Products" formSchema={productSchema} />

// Page Example (Complex forms)
<QuickUI crudType="page" title="User Onboarding" formSchema={complexUserSchema} />

// Route Example (Full navigation)
<QuickUI
    crudType="route"
    title="Projects"
    formSchema={projectSchema}
    routeConfig={{
        basePath: "/projects",
        createPath: "/projects/new",
        editPath: "/projects/[id]/edit"
    }}
/>
```

#### `initialData: any[]` (Default: [])

**Purpose**: Initial dataset for the table
**When to Use**: Static data, initial load, demo purposes

```tsx
// Static data
initialData={[
    { id: "1", name: "John", email: "john@example.com" },
    { id: "2", name: "Jane", email: "jane@example.com" }
]}

// Empty for API-driven data
initialData={[]}
```

#### `icon: TIconName`

**Purpose**: Visual identifier in headers and breadcrumbs
**Impact**: Better UX, visual consistency

```tsx
icon = "UserOutlined"; // For user management
icon = "ShopOutlined"; // For products
icon = "SettingOutlined"; // For configuration
```

### Data Management Props

#### `onDataChange: (data: any[]) => void`

**Purpose**: React to data changes for state synchronization
**When to Use**: Update parent component state, analytics, caching

```tsx
onDataChange={(data) => {
    // Update parent state
    setUsers(data);

    // Analytics
    analytics.track('data_changed', { count: data.length });

    // Cache
    localStorage.setItem('users', JSON.stringify(data));
}}
```

#### `onRecordView: (record: any) => void`

**Purpose**: Handle record viewing events
**When to Use**: Analytics, audit logging, custom actions

```tsx
onRecordView={(record) => {
    // Audit log
    auditLog.log('user_viewed', { userId: record.id });

    // Analytics
    analytics.track('record_viewed', { type: 'user', id: record.id });

    // Custom logic
    if (record.status === 'pending') {
        showPendingWarning();
    }
}}
```

#### `onRecordCreate: (record: any) => Promise<any> | void`

**Purpose**: Handle record creation
**Return**: New record with server-generated data (ID, timestamps, etc.)

```tsx
// API Integration
onRecordCreate={async (record) => {
    const response = await api.users.create(record);
    return response.data; // Must include ID for table updates
}}

// Local state only
onRecordCreate={(record) => {
    const newRecord = { ...record, id: generateId() };
    setUsers(prev => [...prev, newRecord]);
    return newRecord;
}}

// With validation
onRecordCreate={async (record) => {
    // Pre-validation
    if (await isDuplicateEmail(record.email)) {
        throw new Error('Email already exists');
    }

    const response = await api.users.create(record);

    // Post-creation actions
    await sendWelcomeEmail(response.data.email);

    return response.data;
}}
```

#### `onRecordUpdate: (record: any) => Promise<any> | void`

**Purpose**: Handle record updates
**Return**: Updated record with new data

```tsx
onRecordUpdate={async (record) => {
    // Optimistic update
    setUsers(prev => prev.map(u => u.id === record.id ? record : u));

    try {
        const response = await api.users.update(record.id, record);
        return response.data;
    } catch (error) {
        // Revert on error
        setUsers(prev => prev.map(u => u.id === record.id ? originalRecord : u));
        throw error;
    }
}}
```

#### `onRecordDelete: (record: any) => Promise<any> | void`

**Purpose**: Handle record deletion
**Why Async**: API calls, confirmation, cleanup

```tsx
onRecordDelete={async (record) => {
    // Soft delete
    await api.users.softDelete(record.id);

    // Cleanup related data
    await api.userSessions.deleteAll(record.id);

    // Update local state
    setUsers(prev => prev.filter(u => u.id !== record.id));

    return record;
}}
```

#### `onFilter: (data: any[], filters: Record<string, any>) => Promise<any[]> | any[]`

**Purpose**: Custom filtering logic (client-side or server-side)
**Return**: Filtered data array OR paginated response object

```tsx
// Client-side filtering
onFilter={(data, filters) => {
    return data.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            return item[key]?.toString().toLowerCase().includes(value.toLowerCase());
        });
    });
}}

// Server-side filtering with pagination
onFilter={async (data, filters) => {
    const params = new URLSearchParams({
        ...filters,
        page: filters._pagination?.page || 1,
        pageSize: filters._pagination?.pageSize || 10
    });

    const response = await api.users.search(params);

    // Return paginated response
    return {
        data: response.data.users,
        total: response.data.total,
        current: response.data.page,
        pageSize: response.data.pageSize
    };
}}
```

### UI Customization Props

#### `tableColumns: ColumnType<any>[]`

**Purpose**: Override auto-generated table columns
**When to Use**: Custom rendering, complex data display, actions

```tsx
tableColumns={[
    {
        title: 'User Profile',
        dataIndex: 'name',
        render: (name, record) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={record.avatar} />
                <div style={{ marginLeft: 8 }}>
                    <div style={{ fontWeight: 'bold' }}>{name}</div>
                    <div style={{ color: '#666' }}>{record.email}</div>
                </div>
            </div>
        )
    },
    {
        title: 'Status',
        dataIndex: 'status',
        filters: [
            { text: 'Active', value: 'active' },
            { text: 'Inactive', value: 'inactive' }
        ],
        render: (status) => (
            <Tag color={status === 'active' ? 'green' : 'red'}>
                {status.toUpperCase()}
            </Tag>
        )
    }
]}
```

#### `tableProps: any`

**Purpose**: Pass additional props to Ant Design Table component
**Common Uses**: Pagination, sizing, scrolling, selection

```tsx
tableProps={{
    // Pagination
    pagination: {
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    },

    // Appearance
    size: "small",
    bordered: true,

    // Scrolling
    scroll: { x: 1200, y: 400 },

    // Loading
    loading: isLoading,

    // Row styling
    rowClassName: (record) => record.status === 'inactive' ? 'inactive-row' : '',

    // Expand
    expandable: {
        expandedRowRender: (record) => <UserDetails user={record} />
    }
}}
```

#### `formProps: any`

**Purpose**: Pass additional props to AppForm component
**Common Uses**: Layout, styling, validation

```tsx
formProps={{
    layout: "horizontal",
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    size: "large",
    colon: false,
    validateTrigger: "onBlur"
}}
```

### Action Configuration Props

#### `actions: ActionConfig`

**Purpose**: Control which built-in actions are available
**Customization**: Add extra actions per record

```tsx
actions={{
    view: true,
    edit: true,
    delete: false, // Disable delete for this table
    extraActions: (record, permissions) => {
        const actions = [];

        // Conditional actions based on record state
        if (record.status === 'pending' && permissions?.canApprove) {
            actions.push(
                <Button key="approve" size="small" type="primary"
                    onClick={() => approveUser(record)}>
                    Approve
                </Button>
            );
        }

        // Always available actions
        actions.push(
            <Button key="export" size="small"
                onClick={() => exportUserData(record)}>
                Export
            </Button>
        );

        return actions;
    }
}}
```

### Filtering Props

#### `showFilter: boolean` (Default: true)

**Purpose**: Control filter form visibility
**When to Disable**: Simple lists, space constraints

```tsx
showFilter={false} // Disable filtering completely
```

#### `filterFields: any[]`

**Purpose**: Override auto-generated filter fields
**When to Use**: Custom filter options, limited filter fields

```tsx
filterFields={[
    { name: "name", label: "Name", type: "text" },
    { name: "status", label: "Status", type: "select", options: statusOptions },
    { name: "department", label: "Department", type: "select", options: departmentOptions },
    { name: "dateRange", label: "Created Date", type: "daterange" }
]}
```

### Statistics Props

#### `statistics: StatItem[] | ((data: any[]) => StatItem[])`

**Purpose**: Display summary statistics above the table
**Dynamic**: Function receives current data and returns stats

```tsx
// Static statistics
statistics={[
    { key: 'total', label: 'Total Users', value: 150, color: '#1890ff' },
    { key: 'active', label: 'Active Users', value: 120, color: '#52c41a' }
]}

// Dynamic statistics
statistics={(data) => [
    {
        key: 'total',
        label: 'Total Users',
        value: data.length,
        color: '#1890ff',
        icon: <UserOutlined />
    },
    {
        key: 'active',
        label: 'Active Users',
        value: data.filter(user => user.status === 'active').length,
        color: '#52c41a',
        icon: <CheckCircleOutlined />
    },
    {
        key: 'revenue',
        label: 'Total Revenue',
        value: `$${data.reduce((sum, user) => sum + (user.revenue || 0), 0).toLocaleString()}`,
        color: '#722ed1',
        icon: <DollarOutlined />
    }
]}
```

### Batch Operations Props

#### `rowSelection: boolean` (Default: false)

**Purpose**: Enable row selection for batch operations

#### `batchActions: (selectedRowKeys, selectedRows, permissions) => ReactNode`

**Purpose**: Define actions for selected rows
**Context-Aware**: Different actions based on selection

```tsx
batchActions={(selectedKeys, selectedRows, permissions) => {
    // No selection
    if (selectedKeys.length === 0) return null;

    // Single selection
    if (selectedKeys.length === 1) {
        return (
            <Space>
                <Button type="primary">Edit Selected</Button>
                <Button>Duplicate</Button>
            </Space>
        );
    }

    // Multiple selection
    const hasActive = selectedRows.some(row => row.status === 'active');
    const hasInactive = selectedRows.some(row => row.status === 'inactive');

    return (
        <Space wrap>
            {hasInactive && (
                <Button type="primary"
                    onClick={() => bulkActivate(selectedKeys)}>
                    Activate ({selectedKeys.length})
                </Button>
            )}

            {hasActive && (
                <Button onClick={() => bulkDeactivate(selectedKeys)}>
                    Deactivate ({selectedKeys.length})
                </Button>
            )}

            <Button onClick={() => bulkExport(selectedRows)}>
                Export Selected
            </Button>

            {permissions?.canDelete && (
                <Button danger onClick={() => bulkDelete(selectedKeys)}>
                    Delete ({selectedKeys.length})
                </Button>
            )}
        </Space>
    );
}}
```

### Message Configuration Props

#### `confirmTexts: object`

**Purpose**: Customize confirmation messages

```tsx
confirmTexts={{
    delete: "Are you sure you want to permanently delete this user? This action cannot be undone.",
    create: "Create New User",
    update: "Save Changes"
}}
```

#### `successMessages: object`

**Purpose**: Customize success messages

```tsx
successMessages={{
    create: "User account created successfully! Welcome email has been sent.",
    update: "User information updated successfully!",
    delete: "User account has been deleted permanently."
}}
```

### Advanced Form Configuration Props

#### `validateOnMount: boolean` (Default: false)

**Purpose**: Validate form immediately when opened
**When to Use**: Edit forms with existing data, strict validation requirements

#### `preserveFormData: boolean` (Default: false)

**Purpose**: Keep form data when modal/drawer is closed
**When to Use**: Long forms, auto-save scenarios

#### `beforeFormSubmit: (values: any) => any | Promise<any>`

**Purpose**: Transform/validate data before submission

```tsx
beforeFormSubmit={async (values) => {
    // Data transformation
    const transformed = {
        ...values,
        email: values.email.toLowerCase(),
        phone: values.phone.replace(/\D/g, ''), // Remove non-digits
        slug: values.name.toLowerCase().replace(/\s+/g, '-')
    };

    // Additional validation
    if (await isDuplicateEmail(transformed.email)) {
        throw new Error('Email already exists');
    }

    return transformed;
}}
```

#### `afterFormSubmit: (values: any, result: any) => void`

**Purpose**: Post-submission actions

```tsx
afterFormSubmit={(values, result) => {
    // Analytics
    analytics.track('user_created', { userId: result.id });

    // Notifications
    if (values.sendWelcomeEmail) {
        sendWelcomeEmail(result.email);
    }

    // Redirect
    if (values.createAnother) {
        // Keep form open for another entry
        return;
    }

    // Additional actions
    refreshUserStats();
}}
```

#### `renderExtraFormActions: (form, editingRecord, permissions) => ReactNode`

**Purpose**: Add custom buttons to form footer

```tsx
renderExtraFormActions={(form, editingRecord, permissions) => (
    <Space>
        {editingRecord && (
            <Button onClick={() => viewAuditLog(editingRecord.id)}>
                View History
            </Button>
        )}

        {permissions?.canDuplicate && editingRecord && (
            <Button onClick={() => duplicateRecord(editingRecord)}>
                Save & Duplicate
            </Button>
        )}

        {!editingRecord && (
            <Button onClick={() => {
                form.submit();
                form.resetFields(); // Create another
            }}>
                Save & Create Another
            </Button>
        )}
    </Space>
)}
```

### Permission System Props

#### `permissions: PermissionConfig`

**Purpose**: Define required permissions for different actions

```tsx
permissions={{
    view: "users.view",                    // Single permission
    create: ["users.create", "admin"],     // Multiple permissions (OR)
    edit: "users.edit",
    delete: ["users.delete", "admin"],
    filter: "users.filter",
    export: "users.export"
}}
```

#### `checkPermission: PermissionChecker`

**Purpose**: Function to check if user has required permissions

```tsx
checkPermission={(permission) => {
    if (Array.isArray(permission)) {
        // User needs at least one of the permissions
        return permission.some(p => userPermissions.includes(p));
    }

    // Single permission check
    return userPermissions.includes(permission);
}}
```

### Route Configuration Props (for crudType="route")

#### `routeConfig: RouteConfig`

**Purpose**: Define URL patterns for route-based CRUD

```tsx
routeConfig={{
    basePath: "/admin/users",
    createPath: "/admin/users/create",
    editPath: "/admin/users/[id]/edit",
    viewPath: "/admin/users/[id]",
    listPath: "/admin/users",
    paramName: "id"
}}
```

#### `currentAction: string`

**Purpose**: Current route action for route-based CRUD
**Values**: "list" | "create" | "edit" | "view"

#### `currentRecordId: string`

**Purpose**: Current record ID for edit/view actions

#### `onNavigate: (path: string, params?: Record<string, any>) => void`

**Purpose**: Custom navigation handler

```tsx
onNavigate={(path, params) => {
    // Custom navigation logic
    if (hasUnsavedChanges) {
        confirmNavigation().then(() => {
            router.push(path);
        });
    } else {
        router.push(path);
    }
}}
```

## CRUD Type Examples

### 1. Modal CRUD (Default)

**Best For**: Quick edits, simple forms, popup interactions
**Pros**: Non-intrusive, good for quick actions
**Cons**: Limited space, not good for complex forms

```tsx
<QuickUI
    title="Tags Management"
    crudType="modal"
    formSchema={{
        layout: "vertical",
        fields: [
            { name: "name", label: "Tag Name", type: "text", required: true },
            { name: "color", label: "Color", type: "color" },
            { name: "description", label: "Description", type: "textarea" },
        ],
    }}
    tableProps={{ size: "small", pagination: { pageSize: 20 } }}
/>
```

### 2. Drawer CRUD

**Best For**: Medium complexity forms, side-by-side viewing
**Pros**: More space than modal, maintains context
**Cons**: Takes up screen space

```tsx
<QuickUI
    title="Product Management"
    crudType="drawer"
    formSchema={{
        layout: "vertical",
        tabs: [
            {
                key: "basic",
                title: "Basic Info",
                fields: [
                    { name: "name", label: "Product Name", type: "text", required: true },
                    { name: "category", label: "Category", type: "select", options: categories },
                    { name: "price", label: "Price", type: "number" },
                ],
            },
            {
                key: "details",
                title: "Details",
                fields: [
                    { name: "description", label: "Description", type: "richtext" },
                    { name: "images", label: "Images", type: "upload" },
                ],
            },
        ],
    }}
/>
```

### 3. Page CRUD

**Best For**: Complex forms, multi-step processes, detailed editing
**Pros**: Full screen space, no modal limitations
**Cons**: Navigation overhead, context loss

```tsx
<QuickUI
    title="Employee Onboarding"
    crudType="page"
    formSchema={{
        layout: "vertical",
        steps: [
            {
                title: "Personal Information",
                fields: [
                    { name: "firstName", label: "First Name", type: "text", required: true },
                    { name: "lastName", label: "Last Name", type: "text", required: true },
                    { name: "email", label: "Email", type: "email", required: true },
                ],
            },
            {
                title: "Employment Details",
                fields: [
                    { name: "department", label: "Department", type: "select", options: departments },
                    { name: "position", label: "Position", type: "text", required: true },
                    { name: "startDate", label: "Start Date", type: "date", required: true },
                ],
            },
            {
                title: "Documents",
                fields: [
                    { name: "resume", label: "Resume", type: "upload", required: true },
                    { name: "contracts", label: "Contracts", type: "upload" },
                ],
            },
        ],
    }}
/>
```

### 4. Route CRUD

**Best For**: Full navigation control, bookmarkable URLs, SEO
**Pros**: RESTful URLs, browser navigation, shareable links
**Cons**: More complex setup, requires routing configuration

```tsx
<QuickUI
    title="Project Management"
    crudType="route"
    formSchema={projectFormSchema}
    routeConfig={{
        basePath: "/projects",
        createPath: "/projects/new",
        editPath: "/projects/[id]/edit",
        viewPath: "/projects/[id]",
        listPath: "/projects",
    }}
    currentAction={getCurrentActionFromURL()}
    currentRecordId={getRecordIdFromURL()}
    onNavigate={path => router.push(path)}
/>
```

## Form Schema Patterns

### 1. Simple Form (Field List)

```tsx
const simpleSchema: FormSchema = {
    layout: "vertical",
    fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "active", label: "Active", type: "switch", defaultValue: true },
    ],
};
```

### 2. Sectioned Form (Grouped Fields)

```tsx
const sectionedSchema: FormSchema = {
    layout: "vertical",
    sections: [
        {
            title: "Personal Information",
            description: "Basic personal details",
            fields: [
                { name: "firstName", label: "First Name", type: "text", required: true },
                { name: "lastName", label: "Last Name", type: "text", required: true },
            ],
        },
        {
            title: "Contact Information",
            fields: [
                { name: "email", label: "Email", type: "email", required: true },
                { name: "phone", label: "Phone", type: "tel" },
            ],
        },
    ],
};
```

### 3. Tabbed Form (Complex Organization)

```tsx
const tabbedSchema: FormSchema = {
    layout: "vertical",
    tabs: [
        {
            key: "basic",
            title: "Basic Info",
            icon: "UserOutlined",
            fields: [
                { name: "name", label: "Name", type: "text", required: true },
                { name: "email", label: "Email", type: "email", required: true },
            ],
        },
        {
            key: "preferences",
            title: "Preferences",
            icon: "SettingOutlined",
            fields: [
                { name: "theme", label: "Theme", type: "select", options: themeOptions },
                { name: "notifications", label: "Email Notifications", type: "switch" },
            ],
        },
    ],
};
```

### 4. Wizard Form (Step-by-Step)

```tsx
const wizardSchema: FormSchema = {
    layout: "vertical",
    steps: [
        {
            title: "Account Setup",
            description: "Create your account",
            fields: [
                { name: "username", label: "Username", type: "text", required: true },
                { name: "password", label: "Password", type: "password", required: true },
            ],
        },
        {
            title: "Profile Information",
            description: "Tell us about yourself",
            fields: [
                { name: "firstName", label: "First Name", type: "text", required: true },
                { name: "bio", label: "Bio", type: "textarea" },
            ],
        },
        {
            title: "Review & Submit",
            description: "Review your information",
            fields: [],
            isReview: true,
        },
    ],
};
```

This comprehensive guide covers all props, their purposes, and when to use each configuration. Each example demonstrates real-world usage patterns with practical benefits and trade-offs.
