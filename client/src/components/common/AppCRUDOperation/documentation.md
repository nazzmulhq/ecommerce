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

| Prop             | Type                                                                   | Required | Default | Description                   |
| ---------------- | ---------------------------------------------------------------------- | -------- | ------- | ----------------------------- |
| `onDataChange`   | `(data: any[]) => void`                                                | ❌       | -       | Called when data changes      |
| `onRecordView`   | `(record: any) => void`                                                | ❌       | -       | Called when viewing a record  |
| `onRecordCreate` | `(record: any) => Promise<any> \| void`                                | ❌       | -       | Called when creating a record |
| `onRecordUpdate` | `(record: any) => Promise<any> \| void`                                | ❌       | -       | Called when updating a record |
| `onRecordDelete` | `(record: any) => Promise<any> \| void`                                | ❌       | -       | Called when deleting a record |
| `onFilter`       | `(data: any[], filter: Record<string, any>) => Promise<any[]> \| void` | ❌       | -       | Custom filter function        |

### UI Customization

| Prop                 | Type                                                                                                 | Required | Default           | Description                           |
| -------------------- | ---------------------------------------------------------------------------------------------------- | -------- | ----------------- | ------------------------------------- |
| `tableColumns`       | `ColumnType<any>[]`                                                                                  | ❌       | Auto-generated    | Custom table columns                  |
| `tableProps`         | `TableProps<any>`                                                                                    | ❌       | `{}`              | Additional props for Ant Design Table |
| `formProps`          | `any`                                                                                                | ❌       | `{}`              | Additional props for AppForm          |
| `actions`            | `{ view?: boolean; edit?: boolean; delete?: boolean; extraActions?: (record: any) => ReactNode[]; }` | ❌       | All enabled       | Configure available actions           |
| `showFilter`         | `boolean`                                                                                            | ❌       | `true`            | Show/hide filter section              |
| `emptyText`          | `string`                                                                                             | ❌       | `"No data found"` | Text when no data available           |
| `showToggleCrudType` | `boolean`                                                                                            | ❌       | `false`           | Show CRUD type toggle                 |

### Filtering and Searching

| Prop           | Type       | Required | Default        | Description                 |
| -------------- | ---------- | -------- | -------------- | --------------------------- |
| `searchFields` | `string[]` | ❌       | `[]`           | Fields to include in search |
| `filterFields` | `any[]`    | ❌       | Auto-generated | Custom filter fields        |

### Messages and Confirmations

| Prop              | Type                                                     | Required | Default          | Description           |
| ----------------- | -------------------------------------------------------- | -------- | ---------------- | --------------------- |
| `confirmTexts`    | `{ delete?: string; create?: string; update?: string; }` | ❌       | Default texts    | Confirmation messages |
| `successMessages` | `{ create?: string; update?: string; delete?: string; }` | ❌       | Default messages | Success messages      |

### Additional Features

| Prop               | Type                                                         | Required | Default | Description                         |
| ------------------ | ------------------------------------------------------------ | -------- | ------- | ----------------------------------- |
| `statistics`       | `StatItem[] \| ((data: any[]) => StatItem[])`                | ❌       | -       | Statistics to display above table   |
| `rowSelection`     | `boolean`                                                    | ❌       | `false` | Enable row selection                |
| `batchActions`     | `(selectedRowKeys: any[], selectedRows: any[]) => ReactNode` | ❌       | -       | Actions for selected rows           |
| `validateOnMount`  | `boolean`                                                    | ❌       | `false` | Validate form on mount              |
| `preserveFormData` | `boolean`                                                    | ❌       | `false` | Preserve form data after submission |

### Advanced Form Handling

| Prop                     | Type                                                   | Required | Default     | Description                      |
| ------------------------ | ------------------------------------------------------ | -------- | ----------- | -------------------------------- |
| `beforeFormSubmit`       | `(values: any) => any \| Promise<any>`                 | ❌       | -           | Process values before submission |
| `afterFormSubmit`        | `(values: any, result: any) => void`                   | ❌       | -           | Called after form submission     |
| `renderExtraFormActions` | `(form: any, editingRecord: any \| null) => ReactNode` | ❌       | -           | Render extra form actions        |
| `sliceName`              | `string`                                               | ❌       | `"quickUI"` | Redux slice name                 |

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
