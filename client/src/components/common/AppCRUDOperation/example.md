# QuickUI Configuration Examples Documentation

## Table of Contents

1. [Basic Configuration](#basic-configuration)
2. [Form Schema Configuration](#form-schema-configuration)
3. [CRUD Type Configuration](#crud-type-configuration)
4. [Table Configuration](#table-configuration)
5. [Actions Configuration](#actions-configuration)
6. [Permissions Configuration](#permissions-configuration)
7. [Filter Configuration](#filter-configuration)
8. [Statistics Configuration](#statistics-configuration)
9. [Route Configuration](#route-configuration)
10. [Advanced Configuration](#advanced-configuration)

---

## Basic Configuration

### Minimal Setup

```typescript
const basicConfig: QuickUIProps = {
    title: "Users",
    formSchema: {
        fields: [
            { name: "name", label: "Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
        ],
    },
    initialData: [],
};
```

### With Icon and Initial Data

```typescript
const withIconConfig: QuickUIProps = {
    title: "Products",
    icon: "ShoppingCart",
    formSchema: {
        fields: [
            { name: "name", label: "Product Name", type: "text", required: true },
            { name: "price", label: "Price", type: "number", required: true },
            {
                name: "category",
                label: "Category",
                type: "select",
                options: [
                    { value: "electronics", label: "Electronics" },
                    { value: "clothing", label: "Clothing" },
                    { value: "books", label: "Books" },
                ],
            },
        ],
    },
    initialData: [
        { id: "1", name: "Laptop", price: 999, category: "electronics" },
        { id: "2", name: "T-Shirt", price: 29, category: "clothing" },
    ],
};
```

---

## Form Schema Configuration

### Simple Fields

```typescript
const simpleFormSchema: FormSchema = {
    layout: "vertical",
    fields: [
        { name: "firstName", label: "First Name", type: "text", required: true },
        { name: "lastName", label: "Last Name", type: "text", required: true },
        { name: "age", label: "Age", type: "number", min: 0, max: 120 },
        { name: "active", label: "Active", type: "switch", defaultValue: true },
        { name: "bio", label: "Biography", type: "textarea", rows: 4 },
    ],
};
```

### Advanced Field Types

```typescript
const advancedFormSchema: FormSchema = {
    layout: "horizontal",
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    fields: [
        {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
            rules: [{ type: "email", message: "Please enter a valid email" }],
        },
        {
            name: "phone",
            label: "Phone",
            type: "text",
            pattern: /^[\+]?[1-9][\d]{0,15}$/,
            placeholder: "+1234567890",
        },
        {
            name: "birthDate",
            label: "Birth Date",
            type: "date",
            disabledDate: current => current && current > new Date(),
        },
        {
            name: "skills",
            label: "Skills",
            type: "select",
            mode: "multiple",
            options: [
                { value: "javascript", label: "JavaScript" },
                { value: "python", label: "Python" },
                { value: "react", label: "React" },
                { value: "nodejs", label: "Node.js" },
            ],
        },
        {
            name: "experience",
            label: "Experience Level",
            type: "radio",
            options: [
                { value: "junior", label: "Junior (0-2 years)" },
                { value: "mid", label: "Mid-level (2-5 years)" },
                { value: "senior", label: "Senior (5+ years)" },
            ],
        },
    ],
};
```

### Sectioned Form Schema

```typescript
const sectionedFormSchema: FormSchema = {
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
            title: "Address",
            description: "Contact address information",
            fields: [
                { name: "street", label: "Street Address", type: "text" },
                { name: "city", label: "City", type: "text" },
                { name: "zipCode", label: "ZIP Code", type: "text" },
                {
                    name: "country",
                    label: "Country",
                    type: "select",
                    options: [
                        { value: "us", label: "United States" },
                        { value: "ca", label: "Canada" },
                        { value: "uk", label: "United Kingdom" },
                    ],
                },
            ],
        },
    ],
};
```

### Tabbed Form Schema

```typescript
const tabbedFormSchema: FormSchema = {
    layout: "vertical",
    tabs: [
        {
            key: "basic",
            title: "Basic Info",
            fields: [
                { name: "name", label: "Full Name", type: "text", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "phone", label: "Phone", type: "text" },
            ],
        },
        {
            key: "preferences",
            title: "Preferences",
            fields: [
                {
                    name: "theme",
                    label: "Theme",
                    type: "select",
                    options: [
                        { value: "light", label: "Light" },
                        { value: "dark", label: "Dark" },
                        { value: "auto", label: "Auto" },
                    ],
                },
                { name: "notifications", label: "Email Notifications", type: "switch" },
                {
                    name: "language",
                    label: "Language",
                    type: "select",
                    options: [
                        { value: "en", label: "English" },
                        { value: "es", label: "Spanish" },
                        { value: "fr", label: "French" },
                    ],
                },
            ],
        },
    ],
};
```

### Step-by-Step Form Schema

```typescript
const stepFormSchema: FormSchema = {
    layout: "vertical",
    steps: [
        {
            title: "Account Setup",
            description: "Create your account",
            fields: [
                { name: "username", label: "Username", type: "text", required: true },
                { name: "password", label: "Password", type: "password", required: true },
                { name: "confirmPassword", label: "Confirm Password", type: "password", required: true },
            ],
        },
        {
            title: "Profile Information",
            description: "Tell us about yourself",
            fields: [
                { name: "firstName", label: "First Name", type: "text", required: true },
                { name: "lastName", label: "Last Name", type: "text", required: true },
                { name: "avatar", label: "Profile Picture", type: "upload", accept: "image/*" },
            ],
        },
        {
            title: "Preferences",
            description: "Customize your experience",
            fields: [
                { name: "newsletter", label: "Subscribe to Newsletter", type: "checkbox" },
                {
                    name: "theme",
                    label: "Preferred Theme",
                    type: "radio",
                    options: [
                        { value: "light", label: "Light" },
                        { value: "dark", label: "Dark" },
                    ],
                },
            ],
        },
    ],
};
```

---

## CRUD Type Configuration

### Modal CRUD (Default)

```typescript
const modalConfig: QuickUIProps = {
    title: "Users",
    crudType: "modal",
    formSchema: {
        /* ... */
    },
    // Forms will open in modal dialogs
};
```

### Drawer CRUD

```typescript
const drawerConfig: QuickUIProps = {
    title: "Products",
    crudType: "drawer",
    formSchema: {
        /* ... */
    },
    // Forms will open in side drawers
};
```

### Page CRUD

```typescript
const pageConfig: QuickUIProps = {
    title: "Orders",
    crudType: "page",
    formSchema: {
        /* ... */
    },
    // Forms will replace the list view on the same page
};
```

### Route-based CRUD

```typescript
const routeConfig: QuickUIProps = {
    title: "Customers",
    crudType: "route",
    formSchema: {
        /* ... */
    },
    routeConfig: {
        basePath: "/customers",
        createPath: "/customers/new",
        editPath: "/customers/[id]/edit",
        viewPath: "/customers/[id]",
        listPath: "/customers",
        paramName: "id",
    },
    // Forms will navigate to different routes
};
```

### Dynamic CRUD Type Switching

```typescript
const dynamicConfig: QuickUIProps = {
    title: "Dynamic CRUD",
    crudType: "modal", // Default type
    showToggleCrudType: true, // Show toggle buttons
    formSchema: {
        /* ... */
    },
    // Users can switch between modal, drawer, page, and route modes
};
```

---

## Table Configuration

### Custom Table Columns

```typescript
const customTableConfig: QuickUIProps = {
  title: "Products",
  formSchema: { /* ... */ },
  tableColumns: [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      fixed: "left",
      width: 200
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: true,
      render: (price: number) => `$${price.toFixed(2)}`,
      align: "right"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" }
      ],
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString()
    }
  ]
};
```

### Table Props Configuration

```typescript
const tablePropsConfig: QuickUIProps = {
  title: "Advanced Table",
  formSchema: { /* ... */ },
  tableProps: {
    size: "small",
    bordered: true,
    showHeader: true,
    scroll: { x: 1000, y: 400 },
    sticky: true,
    summary: (data) => (
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} colSpan={2}>
          <strong>Total</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={2}>
          <strong>{data.length} items</strong>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    )
  }
};
```

### Row Selection Configuration

```typescript
const rowSelectionConfig: QuickUIProps = {
  title: "Selectable Items",
  formSchema: { /* ... */ },
  rowSelection: true,
  batchActions: (selectedRowKeys, selectedRows, permissions) => (
    <Space>
      <Button
        type="primary"
        danger
        disabled={!permissions?.canDelete}
        onClick={() => handleBatchDelete(selectedRowKeys)}
      >
        Delete Selected ({selectedRowKeys.length})
      </Button>
      <Button
        onClick={() => handleBatchExport(selectedRows)}
      >
        Export Selected
      </Button>
    </Space>
  )
};
```

---

## Actions Configuration

### Basic Actions

```typescript
const basicActionsConfig: QuickUIProps = {
    title: "Users",
    formSchema: {
        /* ... */
    },
    actions: {
        view: true,
        edit: true,
        delete: true,
    },
};
```

### Custom Actions

```typescript
const customActionsConfig: QuickUIProps = {
  title: "Orders",
  formSchema: { /* ... */ },
  actions: {
    view: true,
    edit: true,
    delete: false, // Disable delete
    extraActions: (record, permissions) => [
      <Tooltip key="print" title="Print Order">
        <Button
          size="small"
          icon={<PrinterOutlined />}
          onClick={() => handlePrintOrder(record)}
        />
      </Tooltip>,
      <Tooltip key="email" title="Email Customer">
        <Button
          size="small"
          icon={<MailOutlined />}
          onClick={() => handleEmailCustomer(record)}
          disabled={!record.email}
        />
      </Tooltip>,
      permissions?.canApprove && record.status === "pending" && (
        <Tooltip key="approve" title="Approve Order">
          <Button
            size="small"
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApproveOrder(record)}
          />
        </Tooltip>
      )
    ].filter(Boolean)
  }
};
```

### Confirmation Texts

```typescript
const confirmationConfig: QuickUIProps = {
    title: "Sensitive Data",
    formSchema: {
        /* ... */
    },
    confirmTexts: {
        delete: "Are you absolutely sure? This action cannot be undone.",
        create: "Save New Record",
        update: "Update Record",
    },
    successMessages: {
        create: "Record has been created successfully!",
        update: "Record has been updated successfully!",
        delete: "Record has been permanently deleted.",
    },
};
```

---

## Permissions Configuration

### Basic Permissions

```typescript
const basicPermissionsConfig: QuickUIProps = {
    title: "Restricted Content",
    formSchema: {
        /* ... */
    },
    permissions: {
        view: "content:read",
        create: "content:create",
        edit: "content:update",
        delete: "content:delete",
        filter: "content:filter",
        export: "content:export",
    },
    checkPermission: permission => {
        // Your permission checking logic
        return userPermissions.includes(permission);
    },
};
```

### Multiple Permissions (OR Logic)

```typescript
const multiplePermissionsConfig: QuickUIProps = {
    title: "Admin Panel",
    formSchema: {
        /* ... */
    },
    permissions: {
        view: ["admin:read", "moderator:read"], // User needs either permission
        create: ["admin:create"],
        edit: ["admin:update", "moderator:update"],
        delete: ["admin:delete"], // Only admin can delete
    },
    checkPermission: permission => {
        if (Array.isArray(permission)) {
            return permission.some(p => userPermissions.includes(p));
        }
        return userPermissions.includes(permission);
    },
};
```

### Role-based Permissions

```typescript
const roleBasedConfig: QuickUIProps = {
    title: "Users Management",
    formSchema: {
        /* ... */
    },
    permissions: {
        view: ["admin", "manager", "user"],
        create: ["admin", "manager"],
        edit: ["admin", "manager"],
        delete: ["admin"],
    },
    checkPermission: permission => {
        const userRole = getCurrentUserRole();
        if (Array.isArray(permission)) {
            return permission.includes(userRole);
        }
        return permission === userRole;
    },
};
```

---

## Filter Configuration

### Basic Filtering

```typescript
const basicFilterConfig: QuickUIProps = {
    title: "Products",
    formSchema: {
        fields: [
            { name: "name", label: "Product Name", type: "text", filterable: true },
            {
                name: "category",
                label: "Category",
                type: "select",
                filterable: true,
                options: [
                    { value: "electronics", label: "Electronics" },
                    { value: "clothing", label: "Clothing" },
                ],
            },
            { name: "price", label: "Price", type: "number", filterable: true },
            { name: "active", label: "Active", type: "switch", filterable: true },
        ],
    },
    showFilter: true,
};
```

### Custom Filter Fields

```typescript
const customFilterConfig: QuickUIProps = {
    title: "Orders",
    formSchema: {
        /* ... */
    },
    filterFields: [
        {
            name: "status",
            label: "Order Status",
            type: "select",
            options: [
                { value: "pending", label: "Pending" },
                { value: "processing", label: "Processing" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
            ],
        },
        {
            name: "dateRange",
            label: "Date Range",
            type: "dateRange",
        },
        {
            name: "amount",
            label: "Amount Range",
            type: "numberRange",
        },
        {
            name: "customer",
            label: "Customer",
            type: "text",
        },
    ],
};
```

### Server-side Filtering

```typescript
const serverFilterConfig: QuickUIProps = {
    title: "Large Dataset",
    formSchema: {
        /* ... */
    },
    onFilter: async (data, filters) => {
        // Server-side filtering with pagination
        const response = await fetch("/api/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                filters,
                page: filters._pagination?.page || 1,
                pageSize: filters._pagination?.pageSize || 10,
            }),
        });

        const result = await response.json();

        // Return paginated response
        return {
            data: result.items,
            total: result.total,
            current: result.page,
            pageSize: result.pageSize,
        };
    },
};
```

### Search Fields Configuration

```typescript
const searchConfig: QuickUIProps = {
    title: "Searchable Content",
    formSchema: {
        /* ... */
    },
    searchFields: ["name", "email", "description"], // Fields to search in
    onFilter: (data, filters) => {
        if (filters.search) {
            return data.filter(item =>
                searchFields.some(field => item[field]?.toLowerCase().includes(filters.search.toLowerCase())),
            );
        }
        return data;
    },
};
```

---

## Statistics Configuration

### Static Statistics

```typescript
const staticStatsConfig: QuickUIProps = {
  title: "Dashboard",
  formSchema: { /* ... */ },
  statistics: [
    {
      key: "total",
      label: "Total Items",
      value: 1234,
      color: "#1890ff",
      icon: <DatabaseOutlined />
    },
    {
      key: "active",
      label: "Active Items",
      value: 856,
      color: "#52c41a",
      icon: <CheckCircleOutlined />
    },
    {
      key: "pending",
      label: "Pending Items",
      value: 234,
      color: "#faad14",
      icon: <ClockCircleOutlined />
    },
    {
      key: "inactive",
      label: "Inactive Items",
      value: 144,
      color: "#ff4d4f",
      icon: <StopOutlined />
    }
  ]
};
```

### Dynamic Statistics

```typescript
const dynamicStatsConfig: QuickUIProps = {
  title: "Sales Data",
  formSchema: { /* ... */ },
  statistics: (data) => {
    const totalRevenue = data.reduce((sum, item) => sum + item.amount, 0);
    const avgOrder = totalRevenue / data.length || 0;
    const completedOrders = data.filter(item => item.status === 'completed').length;

    return [
      {
        key: "total_revenue",
        label: "Total Revenue",
        value: `$${totalRevenue.toLocaleString()}`,
        color: "#52c41a",
        icon: <DollarOutlined />
      },
      {
        key: "avg_order",
        label: "Average Order",
        value: `$${avgOrder.toFixed(2)}`,
        color: "#1890ff",
        icon: <CalculatorOutlined />
      },
      {
        key: "completed",
        label: "Completed Orders",
        value: completedOrders,
        color: "#722ed1",
        icon: <CheckCircleOutlined />
      },
      {
        key: "completion_rate",
        label: "Completion Rate",
        value: `${((completedOrders / data.length) * 100).toFixed(1)}%`,
        color: "#eb2f96",
        icon: <PercentageOutlined />
      }
    ];
  }
};
```

---

## Route Configuration

### Basic Route Configuration

```typescript
const routeConfig: QuickUIProps = {
    title: "Products",
    crudType: "route",
    formSchema: {
        /* ... */
    },
    routeConfig: {
        basePath: "/products",
        createPath: "/products/create",
        editPath: "/products/[id]/edit",
        viewPath: "/products/[id]",
        listPath: "/products",
        paramName: "id",
    },
    currentAction: router.query.action || "list",
    currentRecordId: router.query.id,
    onNavigate: (path, params) => {
        router.push(path);
    },
};
```

### Advanced Route Configuration

```typescript
const advancedRouteConfig: QuickUIProps = {
    title: "Orders",
    crudType: "route",
    formSchema: {
        /* ... */
    },
    routeConfig: {
        basePath: "/orders",
        createPath: "/orders/new",
        editPath: "/orders/edit/[orderId]",
        viewPath: "/orders/view/[orderId]",
        listPath: "/orders/list",
        paramName: "orderId",
        queryParams: {
            tab: "details",
            section: "main",
        },
    },
    currentAction: determineActionFromPath(router.pathname),
    currentRecordId: router.query.orderId,
    onNavigate: (path, params) => {
        // Custom navigation logic
        const url = new URL(path, window.location.origin);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.set(key, String(value));
            });
        }
        router.push(url.pathname + url.search);
    },
};
```

---

## Advanced Configuration

### Complete Configuration Example

```typescript
const completeConfig: QuickUIProps = {
  // Basic Configuration
  title: "Employee Management",
  icon: "Users",
  crudType: "modal",

  // Form Schema
  formSchema: {
    layout: "vertical",
    sections: [
      {
        title: "Personal Information",
        fields: [
          { name: "firstName", label: "First Name", type: "text", required: true, filterable: true },
          { name: "lastName", label: "Last Name", type: "text", required: true, filterable: true },
          { name: "email", label: "Email", type: "email", required: true, filterable: true },
          { name: "phone", label: "Phone", type: "text" },
          { name: "birthDate", label: "Birth Date", type: "date" }
        ]
      },
      {
        title: "Employment Details",
        fields: [
          { name: "department", label: "Department", type: "select", required: true, filterable: true,
            options: [
              { value: "engineering", label: "Engineering" },
              { value: "marketing", label: "Marketing" },
              { value: "sales", label: "Sales" },
              { value: "hr", label: "Human Resources" }
            ]
          },
          { name: "position", label: "Position", type: "text", required: true },
          { name: "salary", label: "Salary", type: "number", min: 0 },
          { name: "startDate", label: "Start Date", type: "date", required: true },
          { name: "isActive", label: "Active", type: "switch", defaultValue: true, filterable: true }
        ]
      }
    ]
  },

  // Data and Handlers
  initialData: employeeData,
  onDataChange: (data) => console.log('Data changed:', data),
  onRecordCreate: async (record) => {
    const response = await createEmployee(record);
    return response.data;
  },
  onRecordUpdate: async (record) => {
    const response = await updateEmployee(record.id, record);
    return response.data;
  },
  onRecordDelete: async (record) => {
    await deleteEmployee(record.id);
  },
  onRecordView: (record) => {
    console.log('Viewing:', record);
  },

  // Table Configuration
  tableColumns: [
    {
      title: "Name",
      key: "fullName",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sorter: true
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      filters: [
        { text: "Engineering", value: "engineering" },
        { text: "Marketing", value: "marketing" },
        { text: "Sales", value: "sales" },
        { text: "HR", value: "hr" }
      ]
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Active" : "Inactive"}
        </Tag>
      )
    }
  ],

  // Actions Configuration
  actions: {
    view: true,
    edit: true,
    delete: true,
    extraActions: (record, permissions) => [
      <Tooltip key="promote" title="Promote Employee">
        <Button
          size="small"
          icon={<TrophyOutlined />}
          onClick={() => handlePromote(record)}
          disabled={!permissions?.canPromote}
        />
      </Tooltip>
    ]
  },

  // Permissions
  permissions: {
    view: ["hr:read", "manager:read"],
    create: ["hr:create"],
    edit: ["hr:update", "manager:update"],
    delete: ["hr:delete"],
    promote: ["hr:promote", "manager:promote"]
  },
  checkPermission: (permission) => checkUserPermission(permission),

  // Filtering
  showFilter: true,
  onFilter: async (data, filters) => {
    if (Object.keys(filters).length === 0) return data;

    // Server-side filtering
    const response = await filterEmployees(filters);
    return response.data;
  },

  // Statistics
  statistics: (data) => [
    {
      key: "total",
      label: "Total Employees",
      value: data.length,
      icon: <TeamOutlined />
    },
    {
      key: "active",
      label: "Active Employees",
      value: data.filter(emp => emp.isActive).length,
      color: "#52c41a",
      icon: <UserOutlined />
    },
    {
      key: "departments",
      label: "Departments",
      value: new Set(data.map(emp => emp.department)).size,
      color: "#1890ff",
      icon: <ApartmentOutlined />
    }
  ],

  // Row Selection and Batch Actions
  rowSelection: true,
  batchActions: (selectedKeys, selectedRows, permissions) => (
    <Space>
      <Button
        type="primary"
        onClick={() => handleBatchUpdate(selectedKeys)}
        disabled={!permissions?.canEdit}
      >
        Batch Update ({selectedKeys.length})
      </Button>
      <Button
        danger
        onClick={() => handleBatchDeactivate(selectedKeys)}
        disabled={!permissions?.canEdit}
      >
        Deactivate Selected
      </Button>
    </Space>
  ),

  // Form Configuration
  formProps: {
    size: "large",
    preserve: false
  },
  validateOnMount: true,
  preserveFormData: false,
  beforeFormSubmit: async (values) => {
    // Validate and transform data before submission
    const processedValues = {
      ...values,
      fullName: `${values.firstName} ${values.lastName}`,
      updatedAt: new Date().toISOString()
    };
    return processedValues;
  },
  afterFormSubmit: (values, result) => {
    console.log('Form submitted:', values, result);
    // Refresh related data, show notifications, etc.
  },
  renderExtraFormActions: (form, editingRecord, permissions) => (
    <Space>
      {editingRecord && permissions?.canClone && (
        <Button onClick={() => handleCloneRecord(editingRecord)}>
          Clone Record
        </Button>
      )}
      <Button onClick={() => form.resetFields()}>
        Reset Form
      </Button>
    </Space>
  ),

  // UI Customization
  confirmTexts: {
    delete: "Are you sure you want to delete this employee? This action cannot be undone.",
    create: "Create Employee",
    update: "Update Employee"
  },
  successMessages: {
    create: "Employee created successfully!",
    update: "Employee updated successfully!",
    delete: "Employee deleted successfully!"
  },
  emptyText: "No employees found. Click 'Add Employee' to get started.",
  showToggleCrudType: true
};
```

### Conditional Configuration

```typescript
const conditionalConfig: QuickUIProps = {
  title: "Dynamic Configuration",
  formSchema: generateFormSchema(userRole), // Dynamic schema based on user role

  // Conditional features based on environment
  showFilter: process.env.NODE_ENV !== "production",
  showToggleCrudType: isDevelopment,

  // Conditional actions based on user permissions
  actions: {
    view: true,
    edit: hasPermission("edit"),
    delete: hasPermission("delete") && !isReadOnlyMode,
    extraActions: (record, permissions) => {
      const actions = [];

      if (permissions?.canExport) {
        actions.push(
          <Button
            key="export"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleExport(record)}
          >
            Export
          </Button>
        );
      }

      if (permissions?.canArchive && record.status !== "archived") {
        actions.push(
          <Button
            key="archive"
            size="small"
            icon={<InboxOutlined />}
            onClick={() => handleArchive(record)}
          >
            Archive
          </Button>
        );
      }

      // Show restore only for archived items
      if (permissions?.canRestore && record.status === "archived") {
        actions.push(
          <Button
            key="restore"
            size="small"
            type="primary"
            icon={<RedoOutlined />}
            onClick={() => handleRestore(record)}
          >
            Restore
          </Button>
        );
      }

      return actions;
    }
  },

  // Conditional table columns based on user role
  tableColumns: [
    ...baseColumns,
    ...(isAdmin ? adminColumns : []),
    ...(showSensitiveData ? sensitiveDataColumns : [])
  ],

  // Conditional statistics
  statistics: isManager ? managerStatistics : basicStatistics,

  // Conditional permissions
  permissions: {
    view: true,
    create: userLevel >= UserLevel.EDITOR,
    edit: userLevel >= UserLevel.EDITOR,
    delete: userLevel >= UserLevel.ADMIN,
    export: hasFeature("export"),
    archive: hasFeature("archive")
  }
};
```

### Environment-based Configuration

```typescript
const envBasedConfig: QuickUIProps = {
    title: "Environment Aware CRUD",

    // Development-only features
    ...(isDevelopment && {
        showToggleCrudType: true,
        showFilter: true,
        debugMode: true,
        onDebug: (action, data) => console.log(`[DEBUG] ${action}:`, data),
    }),

    // Production optimizations
    ...(isProduction && {
        crudType: "modal", // Force modal in production
        pagination: {
            pageSize: 20,
            showSizeChanger: false,
        },
        tableProps: {
            size: "small",
            scroll: { y: 400 },
        },
    }),

    // Feature flag based configuration
    formSchema: {
        fields: [
            ...baseFields,
            ...(featureFlags.advancedFields ? advancedFields : []),
            ...(featureFlags.betaFeatures ? betaFields : []),
        ],
    },

    // API endpoints based on environment
    onRecordCreate: async record => {
        const endpoint = isDevelopment ? "/api/dev/create" : "/api/create";
        return await apiCall(endpoint, record);
    },
};
```

### User Role-based Configuration

```typescript
const roleBasedConfig: QuickUIProps = {
  title: "Role-based CRUD",

  // Dynamic form schema based on role
  formSchema: (() => {
    switch (userRole) {
      case "admin":
        return {
          sections: [
            basicSection,
            advancedSection,
            systemSection
          ]
        };
      case "manager":
        return {
          sections: [
            basicSection,
            advancedSection
          ]
        };
      default:
        return {
          fields: basicFields
        };
    }
  })(),

  // Role-specific table columns
  tableColumns: [
    ...commonColumns,
    ...(["admin", "manager"].includes(userRole) ? [
      {
        title: "Internal Notes",
        dataIndex: "internalNotes",
        key: "internalNotes"
      }
    ] : []),
    ...(userRole === "admin" ? [
      {
        title: "System Info",
        dataIndex: "systemInfo",
        key: "systemInfo",
        render: (info) => <code>{JSON.stringify(info)}</code>
      }
    ] : [])
  ],

  // Dynamic permissions
  permissions: getRolePermissions(userRole),

  // Role-specific statistics
  statistics: (data) => {
    const baseStats = getBasicStatistics(data);

    if (userRole === "admin") {
      return [...baseStats, ...getSystemStatistics(data)];
    }

    if (userRole === "manager") {
      return [...baseStats, ...getManagerStatistics(data)];
    }

    return baseStats;
  }
};
```

### Responsive Configuration

```typescript
const responsiveConfig: QuickUIProps = {
    title: "Responsive CRUD",

    // Responsive CRUD type
    crudType: useMediaQuery("(max-width: 768px)") ? "drawer" : "modal",

    // Responsive table configuration
    tableProps: {
        scroll: {
            x: isMobile ? 800 : undefined,
            y: isMobile ? 300 : 500,
        },
        size: isMobile ? "small" : "middle",
        pagination: {
            pageSize: isMobile ? 5 : 10,
            showSizeChanger: !isMobile,
            showQuickJumper: !isMobile,
        },
    },

    // Responsive form layout
    formSchema: {
        layout: isMobile ? "vertical" : "horizontal",
        labelCol: isMobile ? undefined : { span: 8 },
        wrapperCol: isMobile ? undefined : { span: 16 },
        fields: baseFields.map(field => ({
            ...field,
            // Adjust field props for mobile
            ...(isMobile &&
                field.type === "textarea" && {
                    rows: 3,
                }),
        })),
    },

    // Hide complex features on mobile
    showFilter: !isMobile,
    showToggleCrudType: !isMobile,

    // Mobile-specific actions
    actions: {
        view: true,
        edit: true,
        delete: !isMobile, // Hide delete on mobile for safety
        extraActions: (record, permissions) => (isMobile ? [] : getDesktopActions(record, permissions)),
    },
};
```

### Context-aware Configuration

```typescript
const contextAwareConfig: QuickUIProps = {
    title: getContextualTitle(),

    // Configuration based on current page context
    formSchema: {
        fields: [
            ...getBaseFields(),
            ...(isEmbedded ? [] : getStandaloneFields()),
            ...(parentContext?.type === "project" ? getProjectFields() : []),
        ],
    },

    // Context-specific data handling
    onRecordCreate: async record => {
        const contextualRecord = {
            ...record,
            ...(parentContext && {
                parentId: parentContext.id,
                parentType: parentContext.type,
            }),
            createdBy: currentUser.id,
            workspace: currentWorkspace.id,
        };

        return await createRecord(contextualRecord);
    },

    // Filter data based on context
    initialData: data.filter(item => {
        if (showOnlyMine) return item.createdBy === currentUser.id;
        if (workspaceFilter) return item.workspace === currentWorkspace.id;
        return true;
    }),

    // Context-aware permissions
    permissions: {
        ...basePermissions,
        ...(isOwner && ownerPermissions),
        ...(isCollaborator && collaboratorPermissions),
    },

    // Dynamic statistics based on context
    statistics: data => {
        const stats = [];

        if (showPersonalStats) {
            stats.push({
                key: "my_items",
                label: "My Items",
                value: data.filter(item => item.createdBy === currentUser.id).length,
                color: "#1890ff",
            });
        }

        if (showTeamStats && currentTeam) {
            stats.push({
                key: "team_items",
                label: "Team Items",
                value: data.filter(item => item.team === currentTeam.id).length,
                color: "#52c41a",
            });
        }

        return [...getBaseStatistics(data), ...stats];
    },
};
```
