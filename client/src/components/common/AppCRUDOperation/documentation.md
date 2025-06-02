# QuickUI Redux - Complete Documentation

## Overview
QuickUI Redux is a powerful, flexible React component that provides a complete CRUD interface with Redux Toolkit state management. It automatically generates tables, forms, and handles all CRUD operations with minimal configuration.

## Installation & Setup

### 1. Install Dependencies
```bash
npm install @reduxjs/toolkit react-redux antd
```

### 2. Configure Redux Store
```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import quickUIReducer from './quickUISlice';

export const store = configureStore({
  reducer: {
    quickUI: quickUIReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 3. Wrap App with Provider
```typescript
// App.tsx
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <YourComponent />
    </Provider>
  );
}
```

## Props Documentation

### Core Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✅ | - | Display title for the component |
| `formSchema` | `FormSchema` | ✅ | - | Schema defining form fields and structure |
| `crudType` | `'modal' \| 'drawer' \| 'page'` | ❌ | `'modal'` | UI type for create/edit forms |
| `initialData` | `any[]` | ❌ | `[]` | Initial data array |
| `icon` | `ReactNode` | ❌ | - | Icon displayed next to title |

### Event Handlers

| Prop | Type | Description |
|------|------|-------------|
| `onDataChange` | `(data: any[]) => void` | Called when data changes |
| `onRecordView` | `(record: any) => void` | Called when viewing a record |
| `onRecordCreate` | `(record: any) => Promise<any> \| void` | Called when creating a record |
| `onRecordUpdate` | `(record: any) => Promise<any> \| void` | Called when updating a record |
| `onRecordDelete` | `(record: any) => Promise<any> \| void` | Called when deleting a record |
| `onFilter` | `(data: any[], filter: Record<string, any>) => Promise<any[]> \| void` | Custom filter function |

### UI Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tableColumns` | `any[]` | Auto-generated | Custom table columns |
| `tableProps` | `any` | `{}` | Additional props for Ant Design Table |
| `formProps` | `any` | `{}` | Additional props for AppForm |
| `actions` | `ActionConfig` | All enabled | Configure available actions |
| `showFilter` | `boolean` | `true` | Show/hide filter section |
| `rowSelection` | `boolean` | `false` | Enable row selection |
| `emptyText` | `string` | `"No data found"` | Text when no data |
| `showToggleCrudType` | `boolean` | `false` | Show CRUD type toggle |

### Action Configuration

```typescript
interface ActionConfig {
  view?: boolean;
  edit?: boolean;
  delete?: boolean;
  extraActions?: (record: any) => ReactNode[];
}
```

### Messages & Confirmations

```typescript
interface ConfirmTexts {
  delete?: string;
  create?: string;
  update?: string;
}

interface SuccessMessages {
  create?: string;
  update?: string;
  delete?: string;
}
```

## FormSchema Structure

The `FormSchema` defines the structure of your forms and tables:

```typescript
interface FormSchema {
  layout?: 'horizontal' | 'vertical' | 'inline';
  fields?: FormField[];
  sections?: FormSection[];
  tabs?: FormTab[];
  steps?: FormStep[];
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'boolean' | 'switch' | 'date' | 'textarea';
  required?: boolean;
  options?: Array<{value: any, label: string}> | any[];
  defaultValue?: any;
  filterable?: boolean;
  sortable?: boolean;
  hideInTable?: boolean;
  render?: (value: any, record: any) => ReactNode;
  grid?: {xs?: number, sm?: number, md?: number, lg?: number};
}
```

## Usage Examples

### 1. Basic Usage

```typescript
import QuickUIRedux from './QuickUIRedux';

const UserManagement = () => {
  const formSchema = {
    layout: 'vertical',
    fields: [
      {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        required: true,
        filterable: true,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text',
        required: true,
        filterable: true,
      },
      {
        name: 'role',
        label: 'Role',
        type: 'select',
        options: [
          { value: 'admin', label: 'Administrator' },
          { value: 'user', label: 'User' },
          { value: 'manager', label: 'Manager' },
        ],
        filterable: true,
      },
      {
        name: 'active',
        label: 'Active Status',
        type: 'switch',
        defaultValue: true,
        filterable: true,
      },
    ],
  };

  const initialData = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', active: true },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', active: false },
  ];

  return (
    <QuickUIRedux
      title="Users"
      formSchema={formSchema}
      initialData={initialData}
      crudType="modal"
    />
  );
};
```

### 2. With Custom Actions

```typescript
const ProductManagement = () => {
  const formSchema = {
    fields: [
      { name: 'name', label: 'Product Name', type: 'text', required: true },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'category', label: 'Category', type: 'select', options: [...] },
      { name: 'inStock', label: 'In Stock', type: 'boolean' },
    ],
  };

  const handleCreate = async (record: any) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(record),
    });
    return response.json();
  };

  const handleUpdate = async (record: any) => {
    const response = await fetch(`/api/products/${record.id}`, {
      method: 'PUT',
      body: JSON.stringify(record),
    });
    return response.json();
  };

  const handleDelete = async (record: any) => {
    await fetch(`/api/products/${record.id}`, { method: 'DELETE' });
  };

  return (
    <QuickUIRedux
      title="Products"
      formSchema={formSchema}
      onRecordCreate={handleCreate}
      onRecordUpdate={handleUpdate}
      onRecordDelete={handleDelete}
      actions={{
        view: true,
        edit: