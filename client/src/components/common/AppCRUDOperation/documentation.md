# QuickUI - Complete Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Installation & Setup](#installation--setup)
3. [Core Concepts](#core-concepts)
4. [Props Reference](#props-reference)
5. [Type Definitions](#type-definitions)
6. [Usage Examples](#usage-examples)
7. [Customization](#customization)
8. [Advanced Features](#advanced-features)
9. [Redux Integration](#redux-integration)
10. [Best Practices](#best-practices)
11. [Advanced Examples](#advanced-examples)

## Introduction

QuickUI is a powerful, flexible React component that provides a complete CRUD (Create, Read, Update, Delete) interface with Redux Toolkit state management. It automatically generates tables, forms, modal dialogs, and handles all CRUD operations with minimal configuration.

### Key Features

- **Fully-featured data tables** with sorting, filtering, and pagination
- **Dynamic form generation** based on schema definitions
- **Multiple UI modes** (modal, drawer, page-based) for CRUD operations
- **Redux integration** for state management
- **Batch operations** for handling multiple records
- **Statistics display** for data overview
- **Customizable appearance** and behavior
- **Automatic filtering** based on form schema
- **Advanced search** capabilities across multiple fields

## Installation & Setup

### 1. Install Dependencies

```bash
npm install @reduxjs/toolkit react-redux antd
```

### 2. Configure Redux Store

```typescript
// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import quickUIReducer from "./quickUISlice";

export const store = configureStore({
    reducer: {
        quickUI: quickUIReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 3. Wrap App with Provider

```tsx
// App.tsx
import { Provider } from "react-redux";
import { store } from "./store";

function App() {
    return (
        <Provider store={store}>
            <YourComponent />
        </Provider>
    );
}
```

## Core Concepts

### Form Schema

The form schema defines the structure and behavior of forms and tables. It supports:

- Single-level field lists
- Grouped sections
- Tabbed interfaces
- Multi-step forms

### CRUD Types

QuickUI supports three UI patterns for CRUD operations:

- **Modal**: Forms appear in modal dialogs
- **Drawer**: Forms appear in side drawers
- **Page**: Forms render on dedicated pages

## Props Reference

### Basic Configuration

| Prop          | Type                            | Required | Default   | Description                               |
| ------------- | ------------------------------- | -------- | --------- | ----------------------------------------- |
| `title`       | `string`                        | ✅       | -         | Title for the CRUD interface              |
| `formSchema`  | `FormSchema`                    | ✅       | -         | Schema defining form fields and structure |
| `crudType`    | `"modal" \| "drawer" \| "page"` | ❌       | `"modal"` | UI pattern for CRUD operations            |
| `initialData` | `any[]`                         | ❌       | `[]`      | Initial data for the table                |
| `icon`        | `TIconName`                     | ❌       | -         | Icon to display with the title            |

### Action Handlers

| Prop             | Type                                                                   | Required | Default | Description                                                         |
| ---------------- | ---------------------------------------------------------------------- | -------- | ------- | ------------------------------------------------------------------- |
| `onDataChange`   | `(data: any[]) => void`                                                | ❌       | -       | Called when data changes, useful for syncing with external state    |
| `onRecordView`   | `(record: any) => void`                                                | ❌       | -       | Called when viewing a record, useful for analytics or logging       |
| `onRecordCreate` | `(record: any) => Promise<any> \| void`                                | ❌       | -       | Called when creating a record, use for API calls or side effects    |
| `onRecordUpdate` | `(record: any) => Promise<any> \| void`                                | ❌       | -       | Called when updating a record, use for API calls or side effects    |
| `onRecordDelete` | `(record: any) => Promise<any> \| void`                                | ❌       | -       | Called when deleting a record, use for API calls or side effects    |
| `onFilter`       | `(data: any[], filter: Record<string, any>) => Promise<any[]> \| void` | ❌       | -       | Custom filter function for complex filtering beyond simple equality |

### UI Customization

| Prop                 | Type                                                                                                 | Required | Default           | Description                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------- | -------- | ----------------- | -------------------------------------------------- |
| `tableColumns`       | `ColumnType<any>[]`                                                                                  | ❌       | Auto-generated    | Custom table columns for full control over display |
| `tableProps`         | `TableProps<any>`                                                                                    | ❌       | `{}`              | Additional props for Ant Design Table              |
| `formProps`          | `any`                                                                                                | ❌       | `{}`              | Additional props for AppForm                       |
| `actions`            | `{ view?: boolean; edit?: boolean; delete?: boolean; extraActions?: (record: any) => ReactNode[]; }` | ❌       | All enabled       | Configure available actions per row                |
| `showFilter`         | `boolean`                                                                                            | ❌       | `true`            | Show/hide filter section                           |
| `emptyText`          | `string`                                                                                             | ❌       | `"No data found"` | Text when no data available                        |
| `showToggleCrudType` | `boolean`                                                                                            | ❌       | `false`           | Show CRUD type toggle for user preference          |

### Filtering and Searching

| Prop           | Type       | Required | Default        | Description                                                      |
| -------------- | ---------- | -------- | -------------- | ---------------------------------------------------------------- |
| `searchFields` | `string[]` | ❌       | `[]`           | Fields to include in search (uses fuzzy matching when searching) |
| `filterFields` | `any[]`    | ❌       | Auto-generated | Custom filter fields for more control over filtering options     |

### Messages and Confirmations

| Prop              | Type                                                     | Required | Default          | Description                                      |
| ----------------- | -------------------------------------------------------- | -------- | ---------------- | ------------------------------------------------ |
| `confirmTexts`    | `{ delete?: string; create?: string; update?: string; }` | ❌       | Default texts    | Confirmation messages for various actions        |
| `successMessages` | `{ create?: string; update?: string; delete?: string; }` | ❌       | Default messages | Success messages displayed after CRUD operations |

### Additional Features

| Prop               | Type                                                         | Required | Default | Description                                            |
| ------------------ | ------------------------------------------------------------ | -------- | ------- | ------------------------------------------------------ |
| `statistics`       | `StatItem[] \| ((data: any[]) => StatItem[])`                | ❌       | -       | Statistics to display above table (static or dynamic)  |
| `rowSelection`     | `boolean`                                                    | ❌       | `false` | Enable row selection for batch operations              |
| `batchActions`     | `(selectedRowKeys: any[], selectedRows: any[]) => ReactNode` | ❌       | -       | Actions for selected rows (appears when rows selected) |
| `validateOnMount`  | `boolean`                                                    | ❌       | `false` | Validate form on mount (useful for edit forms)         |
| `preserveFormData` | `boolean`                                                    | ❌       | `false` | Preserve form data after submission (for multi-save)   |

### Advanced Form Handling

| Prop                     | Type                                                   | Required | Default     | Description                                       |
| ------------------------ | ------------------------------------------------------ | -------- | ----------- | ------------------------------------------------- |
| `beforeFormSubmit`       | `(values: any) => any \| Promise<any>`                 | ❌       | -           | Process values before submission (transform data) |
| `afterFormSubmit`        | `(values: any, result: any) => void`                   | ❌       | -           | Called after form submission (side effects)       |
| `renderExtraFormActions` | `(form: any, editingRecord: any \| null) => ReactNode` | ❌       | -           | Render extra form actions (custom buttons)        |
| `sliceName`              | `string`                                               | ❌       | `"quickUI"` | Redux slice name (for multiple instances)         |

## Type Definitions

### FormSchema

```typescript
interface FormSchema {
    layout?: "horizontal" | "vertical" | "inline";
    fields?: FormField[];
    sections?: FormSection[];
    tabs?: FormTab[];
    steps?: FormStep[];
}

interface FormField {
    name: string;
    label: string;
    type:
        | "text"
        | "number"
        | "select"
        | "boolean"
        | "switch"
        | "date"
        | "textarea"
        | "password"
        | "radio"
        | "checkbox"
        | "upload"
        | "richtext";
    required?: boolean;
    options?: Array<{ value: any; label: string }> | any[];
    defaultValue?: any;
    filterable?: boolean;
    sortable?: boolean;
    hideInTable?: boolean;
    render?: (value: any, record: any) => ReactNode;
    grid?: { xs?: number; sm?: number; md?: number; lg?: number };
    rules?: any[];
    disabled?: boolean;
    placeholder?: string;
}

interface FormSection {
    title: string;
    fields: FormField[];
    collapsible?: boolean;
    defaultCollapsed?: boolean;
}

interface FormTab {
    key: string;
    title: string;
    fields: FormField[];
}

interface FormStep {
    title: string;
    fields: FormField[];
    description?: string;
}
```

### StatItem

```typescript
type StatItem = {
    key: string;
    label: string;
    value: number | string;
    color?: string;
    icon?: ReactNode;
};
```

### CrudType

```typescript
type CrudType = "modal" | "drawer" | "page";
```

## Usage Examples

### Basic Usage

```tsx
import QuickUI from "../components/common/AppCRUDOperation";

const UserManagement = () => {
    const formSchema = {
        layout: "vertical",
        fields: [
            {
                name: "name",
                label: "Full Name",
                type: "text",
                required: true,
                filterable: true,
            },
            {
                name: "email",
                label: "Email",
                type: "text",
                required: true,
                filterable: true,
            },
            {
                name: "role",
                label: "Role",
                type: "select",
                options: [
                    { value: "admin", label: "Administrator" },
                    { value: "user", label: "User" },
                    { value: "manager", label: "Manager" },
                ],
                filterable: true,
            },
            {
                name: "active",
                label: "Active Status",
                type: "switch",
                defaultValue: true,
                filterable: true,
            },
        ],
    };

    const initialData = [
        { id: "1", name: "John Doe", email: "john@example.com", role: "admin", active: true },
        { id: "2", name: "Jane Smith", email: "jane@example.com", role: "user", active: false },
    ];

    return <QuickUI title="Users" formSchema={formSchema} initialData={initialData} crudType="modal" />;
};
```

### With API Integration

```tsx
import QuickUI from "../components/common/AppCRUDOperation";
import { useEffect, useState } from "react";
import { message } from "antd";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/products");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            message.error("Failed to load products");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formSchema = {
        layout: "vertical",
        fields: [
            { name: "name", label: "Product Name", type: "text", required: true, filterable: true },
            { name: "price", label: "Price", type: "number", required: true, filterable: true },
            {
                name: "category",
                label: "Category",
                type: "select",
                options: [
                    { value: "electronics", label: "Electronics" },
                    { value: "clothing", label: "Clothing" },
                    { value: "food", label: "Food" },
                ],
                filterable: true,
            },
            { name: "inStock", label: "In Stock", type: "switch", defaultValue: true },
            { name: "description", label: "Description", type: "textarea" },
        ],
    };

    const handleCreate = async (record: any) => {
        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(record),
            });
            const result = await response.json();
            fetchProducts(); // Refresh the list
            return result;
        } catch (error) {
            message.error("Failed to create product");
            console.error(error);
            throw error;
        }
    };

    const handleUpdate = async (record: any) => {
        try {
            const response = await fetch(`/api/products/${record.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(record),
            });
            const result = await response.json();
            fetchProducts(); // Refresh the list
            return result;
        } catch (error) {
            message.error("Failed to update product");
            console.error(error);
            throw error;
        }
    };

    const handleDelete = async (record: any) => {
        try {
            await fetch(`/api/products/${record.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            fetchProducts(); // Refresh the list
        } catch (error) {
            message.error("Failed to delete product");
            console.error(error);
            throw error;
        }
    };

    return (
        <QuickUI
            title="Products"
            formSchema={formSchema}
            initialData={products}
            onRecordCreate={handleCreate}
            onRecordUpdate={handleUpdate}
            onRecordDelete={handleDelete}
            crudType="drawer"
            tableProps={{ loading }}
        />
    );
};
```

### With Custom Statistics

```tsx
import QuickUI from "../components/common/AppCRUDOperation";
import { ShoppingOutlined, DollarOutlined, TagOutlined } from "@ant-design/icons";

const SalesManagement = () => {
    // Form schema and other props...

    const salesStatistics = data => [
        {
            key: "total",
            label: "Total Sales",
            value: data.reduce((sum, item) => sum + item.amount, 0).toFixed(2),
            color: "#1890ff",
            icon: <DollarOutlined style={{ fontSize: 24 }} />,
        },
        {
            key: "count",
            label: "Number of Orders",
            value: data.length,
            color: "#52c41a",
            icon: <ShoppingOutlined style={{ fontSize: 24 }} />,
        },
        {
            key: "average",
            label: "Average Order Value",
            value:
                data.length > 0 ? (data.reduce((sum, item) => sum + item.amount, 0) / data.length).toFixed(2) : "0.00",
            color: "#722ed1",
            icon: <TagOutlined style={{ fontSize: 24 }} />,
        },
    ];

    return (
        <QuickUI
            title="Sales"
            formSchema={formSchema}
            initialData={salesData}
            statistics={salesStatistics}
            // Other props...
        />
    );
};
```

### With Custom Table Columns & Actions

```tsx
import QuickUI from "../components/common/AppCRUDOperation";
import { Button, Tag, Tooltip } from "antd";
import { FileExcelOutlined, PrinterOutlined } from "@ant-design/icons";

const InventoryManagement = () => {
    const customColumns = [
        {
            title: "Product ID",
            dataIndex: "id",
            key: "id",
            sorter: true,
        },
        {
            title: "Product Name",
            dataIndex: "name",
            key: "name",
            sorter: true,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: status => {
                let color = "green";
                if (status === "low") color = "orange";
                if (status === "out") color = "red";
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            sorter: true,
        },
        {
            title: "Last Updated",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: date => new Date(date).toLocaleDateString(),
        },
    ];

    const extraActions = record => [
        <Tooltip title="Export to Excel">
            <Button icon={<FileExcelOutlined />} size="small" onClick={() => exportToExcel(record)} />
        </Tooltip>,
        <Tooltip title="Print Label">
            <Button icon={<PrinterOutlined />} size="small" onClick={() => printLabel(record)} />
        </Tooltip>,
    ];

    const exportToExcel = record => {
        console.log("Exporting to Excel:", record);
        // Implementation for export
    };

    const printLabel = record => {
        console.log("Printing label for:", record);
        // Implementation for printing
    };

    return (
        <QuickUI
            title="Inventory"
            formSchema={formSchema}
            initialData={inventoryData}
            tableColumns={customColumns}
            actions={{
                view: true,
                edit: true,
                delete: true,
                extraActions: extraActions,
            }}
        />
    );
};
```

### Complex Form with Sections & Tabs

```tsx
import QuickUI from "../components/common/AppCRUDOperation";

const CustomerManagement = () => {
    const formSchema = {
        tabs: [
            {
                key: "basic",
                title: "Basic Information",
                fields: [
                    { name: "firstName", label: "First Name", type: "text", required: true },
                    { name: "lastName", label: "Last Name", type: "text", required: true },
                    { name: "email", label: "Email", type: "text", required: true },
                    { name: "phone", label: "Phone", type: "text" },
                ],
            },
            {
                key: "address",
                title: "Address",
                fields: [
                    { name: "street", label: "Street", type: "text" },
                    { name: "city", label: "City", type: "text" },
                    { name: "state", label: "State", type: "text" },
                    { name: "zipCode", label: "Zip Code", type: "text" },
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
            {
                key: "preferences",
                title: "Preferences",
                fields: [
                    { name: "marketingEmails", label: "Receive Marketing Emails", type: "switch", defaultValue: true },
                    {
                        name: "language",
                        label: "Preferred Language",
                        type: "select",
                        options: [
                            { value: "en", label: "English" },
                            { value: "fr", label: "French" },
                            { value: "es", label: "Spanish" },
                        ],
                    },
                    { name: "notes", label: "Additional Notes", type: "textarea" },
                ],
            },
        ],
    };

    return (
        <QuickUI
            title="Customers"
            formSchema={formSchema}
            crudType="drawer"
            // Other props...
        />
    );
};
```

### Batch Actions Example

```tsx
import QuickUI from "../components/common/AppCRUDOperation";
import { Button, Space, message } from "antd";
import { MailOutlined, UserDeleteOutlined, TagsOutlined } from "@ant-design/icons";

const ContactManagement = () => {
    // Form schema and other props...

    const handleBatchEmail = (selectedKeys, selectedRows) => {
        message.info(`Sending email to ${selectedKeys.length} contacts`);
        // Implementation for batch email
    };

    const handleBatchDelete = (selectedKeys, selectedRows) => {
        message.info(`Deleting ${selectedKeys.length} contacts`);
        // Implementation for batch delete
    };

    const handleBatchTag = (selectedKeys, selectedRows) => {
        message.info(`Tagging ${selectedKeys.length} contacts`);
        // Implementation for batch tagging
    };

    const batchActions = (selectedKeys, selectedRows) => (
        <Space>
            <Button icon={<MailOutlined />} onClick={() => handleBatchEmail(selectedKeys, selectedRows)}>
                Email Selected
            </Button>
            <Button icon={<TagsOutlined />} onClick={() => handleBatchTag(selectedKeys, selectedRows)}>
                Tag Selected
            </Button>
            <Button danger icon={<UserDeleteOutlined />} onClick={() => handleBatchDelete(selectedKeys, selectedRows)}>
                Delete Selected
            </Button>
        </Space>
    );

    return (
        <QuickUI
            title="Contacts"
            formSchema={formSchema}
            initialData={contactsData}
            rowSelection={true}
            batchActions={batchActions}
        />
    );
};
```

## Customization

### Custom Rendering

The `render` function in the field definition allows custom rendering of values in the table:

```tsx
{
  name: 'status',
  label: 'Status',
  type: 'text',
  render: (value, record) => {
    const statusColors = {
      active: 'green',
      pending: 'orange',
      inactive: 'red',
    };
    return <Tag color={statusColors[value] || 'blue'}>{value?.toUpperCase()}</Tag>;
  }
}
```

### Custom Form Actions

You can add custom actions to your form using the `renderExtraFormActions` prop:

```tsx
<QuickUI
    title="Orders"
    formSchema={orderFormSchema}
    initialData={ordersData}
    renderExtraFormActions={(form, editingRecord) => (
        <>
            {editingRecord && (
                <Button onClick={() => handlePrintOrder(editingRecord.id)} icon={<PrinterOutlined />}>
                    Print Order
                </Button>
            )}
            <Button onClick={() => form.resetFields()} danger>
                Reset
            </Button>
        </>
    )}
/>
```

## Advanced Features

### Processing Form Values Before Submission

The `beforeFormSubmit` prop allows you to process form values before submission:

```tsx
const processFormValues = values => {
    // Add timestamp
    const processed = {
        ...values,
        submittedAt: new Date().toISOString(),
    };

    // Format specific fields
    if (processed.price) {
        processed.price = Number(processed.price);
    }

    return processed;
};

<QuickUI
    title="Products"
    formSchema={productFormSchema}
    beforeFormSubmit={processFormValues}
    // Other props...
/>;
```

### Custom Filtering Logic

The `onFilter` prop allows custom filtering implementation:

```tsx
const customFilter = (data, filters) => {
    return data.filter(item => {
        // Implement custom filtering logic
        for (const [key, value] of Object.entries(filters)) {
            if (key === "priceRange" && value) {
                const [min, max] = value;
                if (item.price < min || item.price > max) return false;
            } else if (value !== undefined && item[key] !== value) {
                return false;
            }
        }
        return true;
    });
};

<QuickUI
    title="Products"
    formSchema={productFormSchema}
    initialData={productsData}
    onFilter={customFilter}
    // Other props...
/>;
```

## Redux Integration

QuickUI uses Redux for state management by default. You can access and manipulate the QuickUI state directly using Redux actions and selectors:

```tsx
import { useDispatch, useSelector } from "react-redux";
import { setData, resetState } from "../path/to/quickUISlice";
import { RootState } from "../path/to/store";

const YourComponent = () => {
    const dispatch = useDispatch();
    const { data, selectedRows } = useSelector((state: RootState) => state.quickUI);

    // Reset QuickUI state
    const handleReset = () => {
        dispatch(resetState());
    };

    // Set data programmatically
    const handleLoadData = async () => {
        const response = await fetch("/api/data");
        const newData = await response.json();
        dispatch(setData(newData));
    };

    return (
        <>
            <Button onClick={handleReset}>Reset</Button>
            <Button onClick={handleLoadData}>Load Data</Button>
            <QuickUI
                title="Data"
                formSchema={schema}
                // Other props...
            />
        </>
    );
};
```

## Best Practices

1. **Define Form Schemas Separately**: For complex applications, define form schemas in separate files for better organization.

2. **Use API Handlers**: Keep API handling logic separate from your component to improve maintainability.

3. **Optimize Table Rendering**: For large datasets, configure pagination and limit the fields displayed in the table.

4. **Customize Validation**: Use the form field `rules` property to add custom validation rules.

5. **Implement Error Handling**: Always include error handling in your API interaction functions.

6. **Use Grid Layout**: Configure the `grid` property on form fields for responsive layouts.

7. **Provide Meaningful Success Messages**: Customize success messages to provide clear feedback to users.

8. **Type Your Data**: Use TypeScript interfaces for your data structures to improve type safety.

9. **Test Edge Cases**: Test your CRUD implementation with empty datasets, large datasets, and various field types.

10. **Monitor Performance**: For large applications, monitor the performance of your CRUD interfaces and optimize as needed.

## Conclusion

QuickUI provides a comprehensive solution for building CRUD interfaces in React applications. By following this documentation and examples, you can rapidly develop powerful data management interfaces with minimal effort.

## Advanced Examples

### 1. Hierarchical Data Management

This example demonstrates managing hierarchical data (departments and employees) with related tables:

```tsx
import QuickUI from "../components/common/AppCRUDOperation";
import { Tabs } from "antd";
import { useEffect, useState } from "react";

const HierarchicalDataManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    // Department form schema
    const departmentFormSchema = {
        layout: "vertical",
        fields: [
            {
                name: "name",
                label: "Department Name",
                type: "text",
                required: true,
                filterable: true,
            },
            {
                name: "code",
                label: "Department Code",
                type: "text",
                required: true,
            },
            {
                name: "budget",
                label: "Annual Budget",
                type: "number",
                filterable: true,
            },
            {
                name: "manager",
                label: "Department Manager",
                type: "select",
                options: employees.map(emp => ({ label: emp.name, value: emp.id })),
            },
            {
                name: "description",
                label: "Description",
                type: "textarea",
            },
        ],
    };

    // Employee form schema with department relation
    const employeeFormSchema = {
        layout: "vertical",
        fields: [
            {
                name: "name",
                label: "Employee Name",
                type: "text",
                required: true,
                filterable: true,
            },
            {
                name: "email",
                label: "Email Address",
                type: "text",
                required: true,
                filterable: true,
                rules: [{ type: "email" }],
            },
            {
                name: "departmentId",
                label: "Department",
                type: "select",
                required: true,
                filterable: true,
                options: departments.map(dept => ({ label: dept.name, value: dept.id })),
            },
            {
                name: "position",
                label: "Position",
                type: "text",
                required: true,
                filterable: true,
            },
            {
                name: "startDate",
                label: "Start Date",
                type: "date",
                required: true,
            },
            {
                name: "salary",
                label: "Salary",
                type: "number",
                required: true,
            },
            {
                name: "isManager",
                label: "Is Manager",
                type: "switch",
                defaultValue: false,
            },
        ],
    };

    // Custom employee filter to filter by department when a department is selected
    const filterEmployeesByDepartment = (data, filters) => {
        let filteredData = [...data];

        // First apply the selected department filter if any
        if (selectedDepartment) {
            filteredData = filteredData.filter(emp => emp.departmentId === selectedDepartment.id);
        }

        // Then apply any other filters
        if (Object.keys(filters).length > 0) {
            filteredData = filteredData.filter(item => {
                for (const [key, value] of Object.entries(filters)) {
                    if (value !== undefined && item[key] !== value) {
                        return false;
                    }
                }
                return true;
            });
        }

        return filteredData;
    };

    // Department statistics calculation
    const departmentStats = data => [
        {
            key: "total",
            label: "Total Departments",
            value: data.length,
            color: "#1890ff",
        },
        {
            key: "avgBudget",
            label: "Average Budget",
            value:
                data.length > 0
                    ? `$${(data.reduce((sum, dept) => sum + (parseFloat(dept.budget) || 0), 0) / data.length).toFixed(2)}`
                    : "$0.00",
            color: "#52c41a",
        },
        {
            key: "withManagers",
            label: "With Managers",
            value: data.filter(dept => dept.manager).length,
            color: "#722ed1",
        },
    ];

    // Employee statistics calculation based on selected department
    const employeeStats = data => {
        const filteredData = selectedDepartment ? data.filter(emp => emp.departmentId === selectedDepartment.id) : data;

        return [
            {
                key: "total",
                label: selectedDepartment ? `Employees in ${selectedDepartment.name}` : "Total Employees",
                value: filteredData.length,
                color: "#1890ff",
            },
            {
                key: "avgSalary",
                label: "Average Salary",
                value:
                    filteredData.length > 0
                        ? `$${(filteredData.reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0) / filteredData.length).toFixed(2)}`
                        : "$0.00",
                color: "#52c41a",
            },
            {
                key: "managers",
                label: "Managers",
                value: filteredData.filter(emp => emp.isManager).length,
                color: "#722ed1",
            },
        ];
    };

    // Handle department selection to filter employees
    const handleViewDepartment = record => {
        setSelectedDepartment(record);
    };

    return (
        <div>
            <h1>Organization Management</h1>

            <Tabs defaultActiveKey="departments">
                <Tabs.TabPane tab="Departments" key="departments">
                    <QuickUI
                        title="Departments"
                        formSchema={departmentFormSchema}
                        initialData={departments}
                        onDataChange={setDepartments}
                        onRecordView={handleViewDepartment}
                        crudType="drawer"
                        statistics={departmentStats}
                    />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Employees" key="employees">
                    {selectedDepartment && (
                        <div style={{ marginBottom: 16, padding: 8, background: "#f0f2f5", borderRadius: 4 }}>
                            Filtering by department: <strong>{selectedDepartment.name}</strong>
                            <Button size="small" style={{ marginLeft: 8 }} onClick={() => setSelectedDepartment(null)}>
                                Clear Filter
                            </Button>
                        </div>
                    )}

                    <QuickUI
                        title="Employees"
                        formSchema={employeeFormSchema}
                        initialData={employees}
                        onDataChange={setEmployees}
                        onFilter={filterEmployeesByDepartment}
                        crudType="drawer"
                        statistics={employeeStats}
                    />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};
```

### 2. Multi-entity E-commerce Product Management

This example shows a comprehensive product management system with categories, variants, and inventory tracking:

```tsx
import QuickUI from "../components/common/AppCRUDOperation";
import { Tabs, Card, Row, Col, Statistic, Button, Upload, message } from "antd";
import { PictureOutlined, BarcodeOutlined, TagsOutlined, ImportOutlined } from "@ant-design/icons";
import { useState } from "react";

const EcommerceProductManagement = () => {
    // Product form schema with complex structure
    const productFormSchema = {
        layout: "vertical",
        tabs: [
            {
                key: "basic",
                title: "Basic Information",
                fields: [
                    { name: "name", label: "Product Name", type: "text", required: true, filterable: true },
                    { name: "sku", label: "SKU", type: "text", required: true },
                    {
                        name: "categoryId",
                        label: "Category",
                        type: "select",
                        required: true,
                        filterable: true,
                        options: categories.map(cat => ({ label: cat.name, value: cat.id })),
                    },
                    { name: "brand", label: "Brand", type: "text", filterable: true },
                    {
                        name: "status",
                        label: "Status",
                        type: "select",
                        required: true,
                        filterable: true,
                        options: [
                            { label: "Active", value: "active" },
                            { label: "Draft", value: "draft" },
                            { label: "Archived", value: "archived" },
                        ],
                        defaultValue: "draft",
                    },
                    {
                        name: "tags",
                        label: "Tags",
                        type: "select",
                        props: { mode: "tags", tokenSeparators: [","] },
                    },
                ],
            },
            {
                key: "details",
                title: "Product Details",
                fields: [
                    {
                        name: "description",
                        label: "Description",
                        type: "textarea",
                        props: { rows: 5 },
                    },
                    {
                        name: "shortDescription",
                        label: "Short Description",
                        type: "textarea",
                        props: { rows: 2 },
                    },
                    { name: "weight", label: "Weight (kg)", type: "number" },
                    { name: "dimensions.length", label: "Length (cm)", type: "number" },
                    { name: "dimensions.width", label: "Width (cm)", type: "number" },
                    { name: "dimensions.height", label: "Height (cm)", type: "number" },
                ],
            },
            {
                key: "pricing",
                title: "Pricing",
                fields: [
                    {
                        name: "basePrice",
                        label: "Base Price",
                        type: "number",
                        required: true,
                        props: { min: 0, step: 0.01, precision: 2 },
                    },
                    {
                        name: "salePrice",
                        label: "Sale Price",
                        type: "number",
                        props: { min: 0, step: 0.01, precision: 2 },
                    },
                    {
                        name: "costPrice",
                        label: "Cost Price",
                        type: "number",
                        props: { min: 0, step: 0.01, precision: 2 },
                    },
                    {
                        name: "taxClass",
                        label: "Tax Class",
                        type: "select",
                        options: [
                            { label: "Standard", value: "standard" },
                            { label: "Reduced", value: "reduced" },
                            { label: "Zero", value: "zero" },
                        ],
                        defaultValue: "standard",
                    },
                    {
                        name: "onSale",
                        label: "On Sale",
                        type: "switch",
                        defaultValue: false,
                    },
                    {
                        name: "saleStartDate",
                        label: "Sale Start Date",
                        type: "date",
                        dependencies: [
                            {
                                type: "show_if",
                                conditions: [{ field: "onSale", operator: "equals", value: true }],
                            },
                        ],
                    },
                    {
                        name: "saleEndDate",
                        label: "Sale End Date",
                        type: "date",
                        dependencies: [
                            {
                                type: "show_if",
                                conditions: [{ field: "onSale", operator: "equals", value: true }],
                            },
                        ],
                    },
                ],
            },
            {
                key: "inventory",
                title: "Inventory",
                fields: [
                    {
                        name: "manageInventory",
                        label: "Track Inventory",
                        type: "switch",
                        defaultValue: true,
                    },
                    {
                        name: "stockQuantity",
                        label: "Stock Quantity",
                        type: "number",
                        props: { min: 0, precision: 0 },
                        dependencies: [
                            {
                                type: "show_if",
                                conditions: [{ field: "manageInventory", operator: "equals", value: true }],
                            },
                            {
                                type: "required_if",
                                conditions: [{ field: "manageInventory", operator: "equals", value: true }],
                            },
                        ],
                    },
                    {
                        name: "lowStockThreshold",
                        label: "Low Stock Threshold",
                        type: "number",
                        props: { min: 0, precision: 0 },
                        dependencies: [
                            {
                                type: "show_if",
                                conditions: [{ field: "manageInventory", operator: "equals", value: true }],
                            },
                        ],
                    },
                    {
                        name: "backorders",
                        label: "Allow Backorders",
                        type: "select",
                        options: [
                            { label: "Do not allow", value: "no" },
                            { label: "Allow, but notify customer", value: "notify" },
                            { label: "Allow", value: "yes" },
                        ],
                        defaultValue: "no",
                        dependencies: [
                            {
                                type: "show_if",
                                conditions: [{ field: "manageInventory", operator: "equals", value: true }],
                            },
                        ],
                    },
                ],
            },
            {
                key: "media",
                title: "Media",
                fields: [
                    {
                        name: "images",
                        label: "Product Images",
                        type: "upload",
                        props: {
                            listType: "picture-card",
                            multiple: true,
                            maxCount: 10,
                            accept: "image/*",
                        },
                    },
                    {
                        name: "featuredImage",
                        label: "Featured Image",
                        type: "upload",
                        props: {
                            listType: "picture-card",
                            maxCount: 1,
                            accept: "image/*",
                        },
                    },
                    {
                        name: "videos",
                        label: "Product Videos",
                        type: "upload",
                        props: {
                            listType: "text",
                            multiple: true,
                            accept: "video/*",
                        },
                    },
                ],
            },
        ],
    };

    // Variant form schema
    const variantFormSchema = {
        layout: "vertical",
        fields: [
            {
                name: "productId",
                label: "Product",
                type: "select",
                required: true,
                options: products.map(p => ({ label: p.name, value: p.id })),
            },
            { name: "sku", label: "SKU", type: "text", required: true },
            {
                name: "attributes",
                label: "Attributes",
                type: "form.list",
                formList: {
                    min: 1,
                    template: [
                        {
                            name: "name",
                            label: "Name",
                            type: "text",
                            required: true,
                            grid: { xs: 24, md: 12 },
                        },
                        {
                            name: "value",
                            label: "Value",
                            type: "text",
                            required: true,
                            grid: { xs: 24, md: 12 },
                        },
                    ],
                },
            },
            {
                name: "price",
                label: "Price",
                type: "number",
                required: true,
                props: { min: 0, step: 0.01, precision: 2 },
            },
            { name: "stockQuantity", label: "Stock Quantity", type: "number", required: true },
            {
                name: "image",
                label: "Variant Image",
                type: "upload",
                props: {
                    listType: "picture-card",
                    maxCount: 1,
                    accept: "image/*",
                },
            },
        ],
    };

    // Render custom statistics for products
    const productStatistics = data => [
        {
            key: "total",
            label: "Total Products",
            value: data.length,
            color: "#1890ff",
            icon: <TagsOutlined />,
        },
        {
            key: "active",
            label: "Active Products",
            value: data.filter(p => p.status === "active").length,
            color: "#52c41a",
        },
        {
            key: "outOfStock",
            label: "Out of Stock",
            value: data.filter(p => p.manageInventory && p.stockQuantity <= 0).length,
            color: "#f5222d",
        },
        {
            key: "avgPrice",
            label: "Average Price",
            value:
                data.length > 0
                    ? `$${(data.reduce((sum, p) => sum + (parseFloat(p.basePrice) || 0), 0) / data.length).toFixed(2)}`
                    : "$0.00",
            color: "#fa8c16",
        },
    ];

    // Before form submit handler that processes data
    const beforeProductSubmit = values => {
        // Convert tags from string array to comma-separated string for API
        if (values.tags && Array.isArray(values.tags)) {
            values.tagsString = values.tags.join(",");
        }

        // Calculate profit margin
        if (values.basePrice && values.costPrice) {
            const margin = ((values.basePrice - values.costPrice) / values.basePrice) * 100;
            values.profitMargin = margin.toFixed(2) + "%";
        }

        // Format dates for API
        if (values.saleStartDate) {
            values.saleStartDate = new Date(values.saleStartDate).toISOString();
        }
        if (values.saleEndDate) {
            values.saleEndDate = new Date(values.saleEndDate).toISOString();
        }

        return values;
    };

    // Custom bulk actions
    const productBatchActions = (selectedKeys, selectedRows) => (
        <Space>
            <Button
                type="primary"
                onClick={() => {
                    // Change status of selected products to active
                    message.success(`Activated ${selectedKeys.length} products`);
                }}
            >
                Activate Selected
            </Button>
            <Button
                onClick={() => {
                    // Download selected products as CSV
                    message.success(`Exporting ${selectedKeys.length} products`);
                }}
            >
                Export CSV
            </Button>
            <Button
                danger
                onClick={() => {
                    // Delete selected products
                    message.success(`Deleted ${selectedKeys.length} products`);
                }}
            >
                Delete Selected
            </Button>
        </Space>
    );

    // Custom render actions for product rows
    const productExtraActions = record => [
        <Button
            size="small"
            icon={<BarcodeOutlined />}
            onClick={() => {
                message.success(`Generated barcode for ${record.name}`);
            }}
        >
            Generate Barcode
        </Button>,
        <Button
            size="small"
            onClick={() => {
                message.success(`Duplicated product ${record.name}`);
            }}
        >
            Duplicate
        </Button>,
    ];

    return (
        <div>
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                    <Col span={6}>
                        <Statistic title="Total Products" value={products.length} prefix={<TagsOutlined />} />
                    </Col>
                    <Col span={6}>
                        <Statistic title="Total Revenue" value={142345.67} precision={2} prefix="$" />
                    </Col>
                    <Col span={6}>
                        <Statistic title="Profit Margin" value={32.5} suffix="%" />
                    </Col>
                    <Col span={6}>
                        <Upload
                            beforeUpload={file => {
                                message.success(`Importing products from ${file.name}`);
                                return false;
                            }}
                        >
                            <Button icon={<ImportOutlined />}>Import Products</Button>
                        </Upload>
                    </Col>
                </Row>
            </Card>

            <Tabs defaultActiveKey="products">
                <Tabs.TabPane tab="Products" key="products">
                    <QuickUI
                        title="Products"
                        formSchema={productFormSchema}
                        initialData={products}
                        crudType="drawer"
                        statistics={productStatistics}
                        rowSelection={true}
                        batchActions={productBatchActions}
                        actions={{
                            view: true,
                            edit: true,
                            delete: true,
                            extraActions: productExtraActions,
                        }}
                        beforeFormSubmit={beforeProductSubmit}
                    />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Variants" key="variants">
                    <QuickUI
                        title="Product Variants"
                        formSchema={variantFormSchema}
                        initialData={variants}
                        crudType="drawer"
                    />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};
```

### 3. Advanced Filtering with Custom Filter Implementation

This example demonstrates advanced filtering capabilities with custom filter implementation:

```tsx
import QuickUI from "../components/common/AppCRUDOperation";
import { DatePicker, Slider, Space, Tag } from "antd";
import { useState } from "react";

const AdvancedFilteringExample = () => {
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [dateRange, setDateRange] = useState(null);

    // Order form schema
    const orderFormSchema = {
        layout: "vertical",
        fields: [
            { name: "orderNumber", label: "Order #", type: "text", required: true, filterable: true },
            { name: "customerName", label: "Customer", type: "text", required: true, filterable: true },
            { name: "email", label: "Email", type: "text", required: true },
            {
                name: "status",
                label: "Status",
                type: "select",
                required: true,
                filterable: true,
                options: [
                    { label: "Pending", value: "pending" },
                    { label: "Processing", value: "processing" },
                    { label: "Shipped", value: "shipped" },
                    { label: "Delivered", value: "delivered" },
                    { label: "Cancelled", value: "cancelled" },
                ],
            },
            {
                name: "paymentMethod",
                label: "Payment Method",
                type: "select",
                filterable: true,
                options: [
                    { label: "Credit Card", value: "credit_card" },
                    { label: "PayPal", value: "paypal" },
                    { label: "Bank Transfer", value: "bank_transfer" },
                ],
            },
            {
                name: "total",
                label: "Order Total",
                type: "number",
                required: true,
                props: { min: 0, step: 0.01, precision: 2 },
            },
            { name: "orderDate", label: "Order Date", type: "date", required: true },
            {
                name: "items",
                label: "Order Items",
                type: "form.list",
                formList: {
                    min: 1,
                    template: [
                        {
                            name: "productName",
                            label: "Product",
                            type: "text",
                            required: true,
                            grid: { xs: 24, md: 8 },
                        },
                        {
                            name: "quantity",
                            label: "Quantity",
                            type: "number",
                            required: true,
                            grid: { xs: 24, md: 4 },
                        },
                        {
                            name: "price",
                            label: "Price",
                            type: "number",
                            required: true,
                            grid: { xs: 24, md: 6 },
                        },
                        {
                            name: "subtotal",
                            label: "Subtotal",
                            type: "number",
                            grid: { xs: 24, md: 6 },
                            dependencies: [
                                {
                                    type: "calculate",
                                    conditions: [
                                        { field: "quantity", operator: "is_not_empty" },
                                        { field: "price", operator: "is_not_empty" },
                                    ],
                                    callback: (form, values, fieldName) => {
                                        // Extract field index from name like 'items[0].subtotal'
                                        const match = fieldName.match(/items\[(\d+)\]/);
                                        if (match) {
                                            const index = parseInt(match[1]);
                                            const quantity = values.items[index].quantity || 0;
                                            const price = values.items[index].price || 0;
                                            return (quantity * price).toFixed(2);
                                        }
                                        return 0;
                                    },
                                },
                            ],
                        },
                    ],
                },
            },
            { name: "shippingAddress", label: "Shipping Address", type: "textarea" },
            { name: "notes", label: "Order Notes", type: "textarea" },
        ],
    };

    // Custom filter fields beyond the auto-generated ones
    const customFilterFields = [
        {
            name: "priceRange",
            label: "Price Range",
            type: "custom",
            render: () => (
                <div>
                    <Slider
                        range
                        min={0}
                        max={1000}
                        defaultValue={priceRange}
                        onChange={value => setPriceRange(value)}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                </div>
            ),
        },
        {
            name: "dateRange",
            label: "Order Date Range",
            type: "custom",
            render: () => <DatePicker.RangePicker onChange={value => setDateRange(value)} />,
        },
    ];

    // Custom filter implementation that handles the custom filter fields
    const customFilterImplementation = (data, filters) => {
        return data.filter(order => {
            // Standard filters
            for (const [key, value] of Object.entries(filters)) {
                // Skip custom filters which we'll handle separately
                if (key === "priceRange" || key === "dateRange") continue;

                if (value !== undefined && value !== null && order[key] !== value) {
                    return false;
                }
            }

            // Price range filter
            if (priceRange && order.total) {
                const [min, max] = priceRange;
                if (order.total < min || order.total > max) {
                    return false;
                }
            }

            // Date range filter
            if (dateRange && dateRange.length === 2 && order.orderDate) {
                const orderDate = new Date(order.orderDate);
                const startDate = dateRange[0].startOf("day").toDate();
                const endDate = dateRange[1].endOf("day").toDate();

                if (orderDate < startDate || orderDate > endDate) {
                    return false;
                }
            }

            return true;
        });
    };

    // Custom table columns with status coloring and formatting
    const customColumns = [
        {
            title: "Order #",
            dataIndex: "orderNumber",
            key: "orderNumber",
            sorter: true,
        },
        {
            title: "Customer",
            dataIndex: "customerName",
            key: "customerName",
            sorter: true,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: status => {
                const statusColors = {
                    pending: "gold",
                    processing: "blue",
                    shipped: "purple",
                    delivered: "green",
                    cancelled: "red",
                };
                return <Tag color={statusColors[status] || "default"}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Date",
            dataIndex: "orderDate",
            key: "orderDate",
            render: date => new Date(date).toLocaleDateString(),
            sorter: true,
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: total => `$${parseFloat(total).toFixed(2)}`,
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: "Payment Method",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            render: method => {
                const methodLabels = {
                    credit_card: "Credit Card",
                    paypal: "PayPal",
                    bank_transfer: "Bank Transfer",
                };
                return methodLabels[method] || method;
            },
        },
        {
            title: "Items",
            dataIndex: "items",
            key: "items",
            render: items => items?.length || 0,
        },
    ];

    // Order statistics
    const orderStatistics = data => [
        {
            key: "total",
            label: "Total Orders",
            value: data.length,
            color: "#1890ff",
        },
        {
            key: "pending",
            label: "Pending",
            value: data.filter(order => order.status === "pending").length,
            color: "#faad14",
        },
        {
            key: "delivered",
            label: "Delivered",
            value: data.filter(order => order.status === "delivered").length,
            color: "#52c41a",
        },
        {
            key: "revenue",
            label: "Total Revenue",
            value: `$${data.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0).toFixed(2)}`,
            color: "#722ed1",
        },
    ];

    return (
        <QuickUI
            title="Orders"
            formSchema={orderFormSchema}
            initialData={orders}
            crudType="drawer"
            statistics={orderStatistics}
            filterFields={customFilterFields}
            onFilter={customFilterImplementation}
            tableColumns={customColumns}
        />
    );
};
```

### 4. Advanced Form Processing with Multi-step Wizard and Data Transformation

```tsx
import QuickUI from "../components/common/AppCRUDOperation";
import { UserOutlined, FileOutlined, CreditCardOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { notification } from "antd";

const SubscriptionManagementExample = () => {
    // Subscription plan form schema with multi-step wizard
    const subscriptionFormSchema = {
        layout: "vertical",
        steps: [
            {
                title: "Plan Details",
                description: "Basic information",
                icon: <FileOutlined />,
                fields: [
                    { name: "name", label: "Plan Name", type: "text", required: true, filterable: true },
                    {
                        name: "type",
                        label: "Plan Type",
                        type: "select",
                        required: true,
                        filterable: true,
                        options: [
                            { label: "Basic", value: "basic" },
                            { label: "Premium", value: "premium" },
                            { label: "Enterprise", value: "enterprise" },
                        ],
                    },
                    {
                        name: "billingCycle",
                        label: "Billing Cycle",
                        type: "select",
                        required: true,
                        filterable: true,
                        options: [
                            { label: "Monthly", value: "monthly" },
                            { label: "Quarterly", value: "quarterly" },
                            { label: "Annual", value: "annual" },
                        ],
                    },
                    {
                        name: "price",
                        label: "Price",
                        type: "number",
                        required: true,
                        props: { min: 0, step: 0.01, precision: 2 },
                    },
                    {
                        name: "trialDays",
                        label: "Trial Period (Days)",
                        type: "number",
                        props: { min: 0, precision: 0 },
                    },
                    { name: "description", label: "Description", type: "textarea" },
                ],
            },
            {
                title: "Features",
                description: "Plan features",
                icon: <CheckCircleOutlined />,
                fields: [
                    {
                        name: "features",
                        label: "Plan Features",
                        type: "form.list",
                        formList: {
                            min: 1,
                            addText: "Add Feature",
                            template: [
                                {
                                    name: "name",
                                    label: "Feature Name",
                                    type: "text",
                                    required: true,
                                    grid: { xs: 24, md: 12 },
                                },
                                {
                                    name: "description",
                                    label: "Description",
                                    type: "text",
                                    grid: { xs: 24, md: 12 },
                                },
                            ],
                        },
                    },
                    {
                        name: "maxUsers",
                        label: "Maximum Users",
                        type: "number",
                        required: true,
                        props: { min: 1, precision: 0 },
                    },
                    {
                        name: "maxStorage",
                        label: "Storage Space (GB)",
                        type: "number",
                        required: true,
                        props: { min: 1, precision: 0 },
                    },
                    { name: "supportIncluded", label: "Support Included", type: "switch", defaultValue: false },
                    {
                        name: "supportLevel",
                        label: "Support Level",
                        type: "select",
                        options: [
                            { label: "Email Only", value: "email" },
                            { label: "Email + Chat", value: "chat" },
                            { label: "Priority Support", value: "priority" },
                        ],
                        dependencies: [
                            {
                                type: "show_if",
                                conditions: [{ field: "supportIncluded", operator: "equals", value: true }],
                            },
                            {
                                type: "required_if",
                                conditions: [{ field: "supportIncluded", operator: "equals", value: true }],
                            },
                        ],
                    },
                ],
            },
            {
                title: "Limitations",
                description: "Plan limitations",
                icon: <UserOutlined />,
                fields: [
                    {
                        name: "apiCalls",
                        label: "API Calls Per Day",
                        type: "number",
                        props: { min: 0, precision: 0 },
                    },
                    { name: "customDomain", label: "Custom Domain", type: "switch", defaultValue: false },
                    { name: "whiteLabel", label: "White Labeling", type: "switch", defaultValue: false },
                    { name: "exportData", label: "Data Export", type: "switch", defaultValue: true },
                    { name: "premium", label: "Premium Features", type: "switch", defaultValue: false },
                ],
            },
            {
                title: "Payment Settings",
                description: "Billing configuration",
                icon: <CreditCardOutlined />,
                fields: [
                    {
                        name: "acceptedPaymentMethods",
                        label: "Accepted Payment Methods",
                        type: "checkbox_group",
                        options: [
                            { label: "Credit Card", value: "credit_card" },
                            { label: "PayPal", value: "paypal" },
                            { label: "Bank Transfer", value: "bank_transfer" },
                            { label: "Crypto", value: "crypto" },
                        ],
                        defaultValue: ["credit_card", "paypal"],
                    },
                    { name: "autoRenew", label: "Auto-Renew By Default", type: "switch", defaultValue: true },
                    { name: "cancelAnytime", label: "Cancel Anytime", type: "switch", defaultValue: true },
                    { name: "refundPolicy", label: "Refund Policy", type: "textarea" },
                ],
            },
        ],
    };

    // Custom data processing before form submission
    const beforeSubmitHandler = values => {
        // Calculate effective monthly price based on billing cycle
        let monthlyPrice = values.price;
        if (values.billingCycle === "quarterly") {
            monthlyPrice = values.price / 3;
        } else if (values.billingCycle === "annual") {
            monthlyPrice = values.price / 12;
        }

        values.effectiveMonthlyPrice = monthlyPrice.toFixed(2);

        // Generate unique plan ID if it's a new plan
        if (!values.id) {
            values.id = `plan_${Date.now()}`;
        }

        // Format features into a more API-friendly format
        if (values.features && Array.isArray(values.features)) {
            values.featuresArray = values.features.map(f => f.name);
            values.featuresObject = values.features.reduce((obj, f) => {
                obj[f.name] = f.description || true;
                return obj;
            }, {});
        }

        // Set appropriate limits based on plan type
        if (values.type === "basic" && !values.limits) {
            values.limits = {
                maxProjects: 3,
                maxTeamMembers: 5,
                maxStorage: values.maxStorage || 5,
            };
        } else if (values.type === "premium" && !values.limits) {
            values.limits = {
                maxProjects: 10,
                maxTeamMembers: 15,
                maxStorage: values.maxStorage || 50,
            };
        } else if (values.type === "enterprise" && !values.limits) {
            values.limits = {
                maxProjects: 100,
                maxTeamMembers: 100,
                maxStorage: values.maxStorage || 500,
            };
        }

        return values;
    };

    // After form submission handler
    const afterSubmitHandler = (values, result) => {
        // Show a more detailed notification
        notification.success({
            message: `Subscription Plan ${values.name} Saved`,
            description: `The ${values.type} plan has been ${result.isNew ? "created" : "updated"} successfully with a price of $${values.price}/${values.billingCycle}.`,
            duration: 5,
        });

        // Additional analytics or side effects could be done here
        console.log("Plan saved with calculated monthly price:", values.effectiveMonthlyPrice);
    };

    // Custom statistics with calculations
    const planStatistics = data => {
        // Calculate average prices by plan type
        const pricesByType = data.reduce((acc, plan) => {
            if (!acc[plan.type]) {
                acc[plan.type] = { total: 0, count: 0 };
            }
            acc[plan.type].total += parseFloat(plan.price) || 0;
            acc[plan.type].count += 1;
            return acc;
        }, {});

        const avgPrices = {};
        for (const [type, { total, count }] of Object.entries(pricesByType)) {
            avgPrices[type] = count > 0 ? (total / count).toFixed(2) : 0;
        }

        return [
            {
                key: "total",
                label: "Total Plans",
                value: data.length,
                color: "#1890ff",
            },
            {
                key: "basic",
                label: "Basic Plans",
                value: data.filter(plan => plan.type === "basic").length,
                color: "#52c41a",
            },
            {
                key: "premium",
                label: "Premium Plans",
                value: data.filter(plan => plan.type === "premium").length,
                color: "#722ed1",
            },
            {
                key: "enterprise",
                label: "Enterprise Plans",
                value: data.filter(plan => plan.type === "enterprise").length,
                color: "#eb2f96",
            },
            {
                key: "avgBasic",
                label: "Avg. Basic Price",
                value: `$${avgPrices.basic || 0}`,
                color: "#faad14",
            },
            {
                key: "avgPremium",
                label: "Avg. Premium Price",
                value: `$${avgPrices.premium || 0}`,
                color: "#13c2c2",
            },
        ];
    };

    return (
        <QuickUI
            title="Subscription Plans"
            formSchema={subscriptionFormSchema}
            initialData={subscriptionPlans}
            crudType="drawer"
            statistics={planStatistics}
            beforeFormSubmit={beforeSubmitHandler}
            afterFormSubmit={afterSubmitHandler}
            tableProps={{
                expandable: {
                    expandedRowRender: record => (
                        <div>
                            <p>
                                <strong>Description:</strong> {record.description || "No description"}
                            </p>
                            <p>
                                <strong>Features:</strong>
                            </p>
                            <ul>
                                {record.features?.map((feature, index) => (
                                    <li key={index}>
                                        {feature.name} - {feature.description}
                                    </li>
                                )) || "No features defined"}
                            </ul>
                        </div>
                    ),
                },
            }}
        />
    );
};
```

These examples demonstrate advanced usage patterns for QuickUI, showcasing complex forms, relations between entities, custom filtering, data transformations, and more.
