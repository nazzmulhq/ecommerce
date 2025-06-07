# QuickUI Component Documentation

## Overview
QuickUI is a comprehensive React component that provides a complete CRUD (Create, Read, Update, Delete) interface with multiple display modes, filtering, pagination, and permission management.

## Props Reference

### Basic Configuration

| Prop | Type | Required | Default | Description | Example | When to Use |
|------|------|----------|---------|-------------|---------|-------------|
| `title` | `string` | ✅ | - | Display title for the component | `"Users"` | Always required to identify the data type |
| `formSchema` | `FormSchema` | ✅ | - | Schema defining form fields and validation | `{ fields: [{ name: "name", type: "text" }] }` | Always required to define form structure |
| `crudType` | `CrudType` | ❌ | `"modal"` | UI mode for CRUD operations | `"modal" \| "drawer" \| "page" \| "route"` | Choose based on UX requirements |
| `initialData` | `any[]` | ❌ | `[]` | Initial dataset | `[{ id: 1, name: "John" }]` | When you have static data or initial dataset |
| `icon` | `TIconName` | ❌ | - | Icon to display with title | `"UserOutlined"` | To enhance visual identification |

### Event Handlers

| Prop | Type | Description | Example | When to Use |
|------|------|-------------|---------|-------------|
| `onDataChange` | `(data: any[]) => void` | Called when data changes | `(data) => console.log('Data updated:', data)` | When parent needs to track data changes |
| `onRecordView` | `(record: any) => void` | Called when viewing a record | `(record) => console.log('Viewing:', record)` | For custom view actions or tracking |
| `onRecordCreate` | `(record: any) => Promise<any> \| void` | Handle record creation | `async (record) => await api.create(record)` | For API integration or custom create logic |
| `onRecordUpdate` | `(record: any) => Promise<any> \| void` | Handle record updates | `async (record) => await api.update(record)` | For API integration or custom update logic |
| `onRecordDelete` | `(record: any) => Promise<any> \| void` | Handle record deletion | `async (record) => await api.delete(record.id)` | For API integration or custom delete logic |
| `onFilter` | `(data: any[], filter: Record<string, any>) => Promise<any[]> \| void` | Handle filtering | `async (data, filters) => await api.filter(filters)` | For server-side filtering or custom filter logic |

### Table Customization

| Prop | Type | Description | Example | When to Use |
|------|------|-------------|---------|-------------|
| `tableColumns` | `any[]` | Custom table columns | `[{ title: "Name", dataIndex: "name", key: "name" }]` | When you need custom column rendering |
| `tableProps` | `any` | Additional props for Ant Design Table | `{ size: "small", bordered: true }` | To customize table appearance/behavior |
| `actions` | `object` | Configure action buttons | `{ view: true, edit: true, delete: false }` | To control which actions are available |

**Actions Object Structure:**
```typescript
{
  view?: boolean;
  edit?: boolean; 
  delete?: boolean;
  extraActions?: (record: any, permissions?: object) => ReactNode[];
}
```

### Form Configuration

| Prop | Type | Description | Example | When to Use |
|------|------|-------------|---------|-------------|
| `formProps` | `any` | Additional props for AppForm | `{ layout: "horizontal" }` | To customize form layout/behavior |
| `validateOnMount` | `boolean` | Validate form when mounted | `true` | When you want immediate validation feedback |
| `preserveFormData` | `boolean` | Keep form data when switching modes | `true` | To prevent data loss during navigation |
| `beforeFormSubmit` | `(values: any) => any \| Promise<any>` | Transform data before submission | `(values) => ({ ...values, timestamp: Date.now() })` | For data preprocessing |
| `afterFormSubmit` | `(values: any, result: any) => void` | Called after successful submission | `(values, result) => console.log('Submitted:', result)` | For post-submission actions |
| `renderExtraFormActions` | `function` | Add custom form actions | `(form, record, permissions) => <Button>Custom</Button>` | For additional form buttons |

### Filtering & Search

| Prop | Type | Default | Description | Example | When to Use |
|------|------|---------|-------------|---------|-------------|
| `showFilter` | `boolean` | `true` | Show filter section | `false` | To hide filtering when not needed |
| `searchFields` | `string[]` | `[]` | Fields to search in | `["name", "email"]` | For quick search functionality |
| `filterFields` | `any[]` | `[]` | Custom filter fields | `[{ name: "status", type: "select" }]` | For custom filter controls |

### Messages & Confirmations

| Prop | Type | Description | Example | When to Use |
|------|------|-------------|---------|-------------|
| `confirmTexts` | `object` | Confirmation button texts | `{ delete: "Remove", create: "Save" }` | To customize button labels |
| `successMessages` | `object` | Success notification messages | `{ create: "User created successfully" }` | To customize success messages |
| `emptyText` | `string` | Text when no data | `"No users found"` | To customize empty state message |

**Confirm Texts Structure:**
```typescript
{
  delete?: string;
  create?: string; 
  update?: string;
}
```

**Success Messages Structure:**
```typescript
{
  create?: string;
  update?: string;
  delete?: string;
}
```

### Statistics & Analytics

| Prop | Type | Description | Example | When to Use |
|------|------|-------------|---------|-------------|
| `statistics` | `StatItem[] \| ((data: any[]) => StatItem[])` | Display statistics cards | `[{ key: "total", label: "Total Users", value: 100 }]` | To show data insights |

**StatItem Structure:**
```typescript
{
  key: string;
  label: string;
  value: number | string;
  color?: string;
  icon?: ReactNode;
}
```

### Row Selection & Batch Actions

| Prop | Type | Default | Description | Example | When to Use |
|------|------|---------|-------------|---------|-------------|
| `rowSelection` | `boolean` | `false` | Enable row selection | `true` | For bulk operations |
| `batchActions` | `function` | - | Render batch action buttons | `(keys, rows) => <Button>Delete Selected</Button>` | For bulk operations UI |

### Permissions & Security

| Prop | Type | Description | Example | When to Use |
|------|------|-------------|---------|-------------|
| `permissions` | `PermissionConfig` | Permission configuration | `{ create: "user.create", edit: ["user.edit", "admin"] }` | For role-based access control |
| `checkPermission` | `PermissionChecker` | Permission checking function | `(permission) => user.hasPermission(permission)` | To implement custom permission logic |

**Permission Config Structure:**
```typescript
{
  view?: Permission;
  create?: Permission;
  edit?: Permission;
  delete?: Permission;
  filter?: Permission;
  export?: Permission;
  [key: string]: Permission | undefined;
}
```

### Routing & Navigation

| Prop | Type | Description | Example | When to Use |
|------|------|-------------|---------|-------------|
| `routeConfig` | `RouteConfig` | Route configuration for navigation | `{ basePath: "/users", paramName: "id" }` | When using route-based CRUD |
| `currentAction` | `string` | Current route action | `"create" \| "edit" \| "view" \| "list"` | For route-based mode |
| `currentRecordId` | `string` | Current record ID from route | `"123"` | For route-based mode |
| `onNavigate` | `function` | Custom navigation handler | `(path, params) => router.push(path)` | For custom routing logic |

**Route Config Structure:**
```typescript
{
  basePath: string;
  createPath?: string;
  editPath?: string;
  viewPath?: string;
  listPath?: string;
  paramName?: string;
  queryParams?: Record<string, string>;
}
```

### Advanced Features

| Prop | Type | Default | Description | Example | When to Use |
|------|------|---------|-------------|---------|-------------|
| `showToggleCrudType` | `boolean` | `false` | Show CRUD type toggle buttons | `true` | To allow users to switch UI modes |

## Usage Examples

### Basic Usage
```typescript
<QuickUI
  title="Users"
  formSchema={{
    fields: [
      { name: "name", type: "text", label: "Name", required: true },
      { name: "email", type: "email", label: "Email", required: true },
      { name: "status", type: "select", label: "Status", options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" }
      ]}
    ]
  }}
  initialData={users}
/>
```

### With API Integration
```typescript
<QuickUI
  title="Products"
  formSchema={productSchema}
  crudType="drawer"
  onRecordCreate={async (record) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(record)
    });
    return response.json();
  }}
  onRecordUpdate={async (record) => {
    const response = await fetch(`/api/products/${record.id}`, {
      method: 'PUT',
      body: JSON.stringify(record)
    });
    return response.json();
  }}
  onRecordDelete={async (record) => {
    await fetch(`/api/products/${record.id}`, { method: 'DELETE' });
  }}
  onFilter={async (data, filters) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`/api/products?${params}`);
    return response.json();
  }}
/>
```

### With Permissions
```typescript
<QuickUI
  title="Admin Panel"
  formSchema={adminSchema}
  permissions={{
    create: ["admin", "manager"],
    edit: "admin",
    delete: "admin",
    view: ["admin", "manager", "user"]
  }}
  checkPermission={(permission) => {
    if (Array.isArray(permission)) {
      return permission.some(p => user.roles.includes(p));
    }
    return user.roles.includes(permission);
  }}
/>
```

### With Custom Statistics
```typescript
<QuickUI
  title="Sales Dashboard"
  formSchema={salesSchema}
  statistics={(data) => [
    {
      key: "total",
      label: "Total Sales",
      value: data.length,
      color: "#52c41a",
      icon: <DollarOutlined />
    },
    {
      key: "revenue",
      label: "Total Revenue",
      value: `$${data.reduce((sum, item) => sum + item.amount, 0)}`,
      color: "#1890ff"
    }
  ]}
/>
```

### Route-based CRUD
```typescript
<QuickUI
  title="Orders"
  formSchema={orderSchema}
  crudType="route"
  routeConfig={{
    basePath: "/orders",
    createPath: "/orders/new",
    editPath: "/orders/[id]/edit",
    viewPath: "/orders/[id]",
    paramName: "id"
  }}
  currentAction={router.query.action as string}
  currentRecordId={router.query.id as string}
/>
```

## CRUD Types Comparison

| Type | Use Case | Pros | Cons |
|------|----------|------|------|
| `modal` | Simple forms, quick edits | Clean UI, doesn't leave page | Limited space |
| `drawer` | Medium complexity forms | More space than modal, side panel | May overlap content |
| `page` | Complex forms, multi-step | Full page space, better UX | Requires navigation |
| `route` | RESTful URLs, bookmarkable | SEO friendly, shareable URLs | More complex setup |

## Best Practices

1. **Choose appropriate CRUD type** based on form complexity
2. **Use permissions** for secure access control  
3. **Implement proper error handling** in event handlers
4. **Provide meaningful messages** for user feedback
5. **Use statistics** to provide data insights
6. **Implement server-side filtering** for large datasets
7. **Use route-based CRUD** for bookmarkable URLs