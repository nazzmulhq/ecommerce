# AppForm Component - Comprehensive Documentation

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Component Props](#component-props)
4. [Form Schema Structure](#form-schema-structure)
5. [Field Types](#field-types)
6. [Complex Form Structures](#complex-form-structures)
7. [Dependency System](#dependency-system)
8. [Validation](#validation)
9. [Custom Components & Rendering](#custom-components--rendering)
10. [Advanced Examples](#advanced-examples)
11. [Performance Optimization](#performance-optimization)
12. [Troubleshooting](#troubleshooting)

## Overview

AppForm is a powerful, flexible React component built on Ant Design that provides a declarative approach to building complex forms with minimal code. It transforms JSON schema definitions into fully functional forms with advanced features like conditional rendering, multi-step wizards, validation, and more.

## Features

- **Schema-driven form generation** - Define forms with JSON instead of JSX
- **Rich field type library** - 30+ built-in field types for any scenario
- **Complex form structures** - Fields, sections, tabs, and multi-step wizards
- **Powerful dependency system** - Show/hide, enable/disable, and transform fields based on conditions
- **Advanced validation** - Built-in and custom validation rules with cross-field validation
- **Dynamic lists** - Add, remove, reorder, and duplicate form items
- **Conditional rendering** - Show or hide fields based on other field values
- **Auto-save capability** - Prevent data loss with automatic saving
- **Custom styling and layout** - Grid system for responsive layouts
- **Form hooks** - Intercept and modify form behavior at key lifecycle points
- **Performance optimization** - Memoization, debouncing, and lazy loading for large forms
- **Extensibility** - Plugins and middleware for custom functionality

## Component Props

### Core Props

| Prop             | Type                                           | Required | Description                     |
| ---------------- | ---------------------------------------------- | -------- | ------------------------------- |
| `schema`         | `FormSchema`                                   | ✅       | Form configuration schema       |
| `initialValues`  | `Record<string, any>`                          | ❌       | Initial form values             |
| `onFinish`       | `(values: any) => void \| Promise<void>`       | ❌       | Form submission handler         |
| `onFinishFailed` | `(errorInfo: any) => void`                     | ❌       | Form validation failure handler |
| `onValuesChange` | `(changedValues: any, allValues: any) => void` | ❌       | Values change handler           |
| `form`           | `FormInstance`                                 | ❌       | External form instance          |

### State and Mode Props

| Prop       | Type                           | Default    | Description          |
| ---------- | ------------------------------ | ---------- | -------------------- |
| `loading`  | `boolean`                      | `false`    | Shows loading state  |
| `disabled` | `boolean`                      | `false`    | Disables entire form |
| `readonly` | `boolean`                      | `false`    | Makes form read-only |
| `mode`     | `'create' \| 'edit' \| 'view'` | `'create'` | Form mode            |

### Advanced Props

| Prop                 | Type                                                                      | Default | Description                       |
| -------------------- | ------------------------------------------------------------------------- | ------- | --------------------------------- |
| `autoSave`           | `boolean`                                                                 | `false` | Enables auto-save functionality   |
| `validateOnMount`    | `boolean`                                                                 | `false` | Validates form on component mount |
| `preserveFormData`   | `boolean`                                                                 | `false` | Preserves data across renders     |
| `formKey`            | `string`                                                                  | -       | Unique form identifier            |
| `onAutoSave`         | `(values: any) => void`                                                   | -       | Auto-save callback                |
| `onValidationChange` | `(errors: any[]) => void`                                                 | -       | Validation state change           |
| `onFormReady`        | `(form: FormInstance) => void`                                            | -       | Form initialization callback      |
| `renderHeader`       | `() => React.ReactNode`                                                   | -       | Custom header renderer            |
| `renderFooter`       | `(form: FormInstance, loading: boolean) => React.ReactNode`               | -       | Custom footer renderer            |
| `renderField`        | `(field: FieldConfig, defaultRender: React.ReactNode) => React.ReactNode` | -       | Custom field renderer             |
| `plugins`            | `Array<(form: FormInstance, schema: FormSchema) => void>`                 | -       | Form plugins                      |
| `middleware`         | `Array<(values: any) => any>`                                             | -       | Value transformation middleware   |

## Form Schema Structure

The schema defines the entire structure and behavior of your form. You can use one of four main structures:

1. **Fields** - Simple list of fields
2. **Sections** - Collapsible sections containing fields
3. **Tabs** - Tabbed interface with fields in each tab
4. **Steps** - Multi-step wizard form

### Basic Schema Structure

```typescript
interface FormSchema {
    // Basic Layout
    layout?: "horizontal" | "vertical" | "inline";
    size?: "small" | "middle" | "large";

    // Structure (use one of these)
    fields?: FieldConfig[];
    sections?: FormSection[];
    steps?: FormStep[];
    tabs?: FormTab[];

    // Additional Configuration
    autoSave?: { enabled: boolean; interval?: number };
    validation?: { validateOnChange?: boolean; scrollToError?: boolean };
    ui?: { theme?: string; showProgress?: boolean };
    hooks?: { beforeSubmit?: Function; afterSubmit?: Function };
}
```

### Field Configuration

Each field is defined with a detailed configuration object:

```typescript
interface FieldConfig {
    name: string; // Field identifier in form values
    type: keyof typeof FIELD_TYPES; // Field component type
    label?: string; // Display label
    required?: boolean; // Is field required?
    placeholder?: string; // Placeholder text
    tooltip?: string; // Help tooltip
    disabled?: boolean; // Is field disabled?
    hidden?: boolean; // Is field hidden?
    options?: Option[]; // For select-type fields
    defaultValue?: any; // Default value
    grid?: ColProps; // Responsive layout
    rules?: ValidationRule[]; // Validation rules
    dependencies?: FormDependency[]; // Field dependencies
    extras?: ExtraButton[]; // Extra action buttons
    hideInTable?: boolean; // Hide in table view
    hideInForm?: boolean; // Hide in form view
    order?: number; // Display order
    // And many more properties...
}
```

## Field Types

AppForm supports a wide range of field types:

### Basic Input Fields

- `input` - Standard text input
- `input.password` - Password input with hide/show
- `input.search` - Search input with icon
- `input.text_area` - Multi-line text input
- `input.otp` - One-time password input
- `input_number` - Numeric input with controls

### Selection Fields

- `select` - Dropdown select
- `auto_complete` - Auto-complete input
- `cascader` - Cascading selection
- `tree_select` - Tree-structured selection
- `radio.group` - Radio button group
- `checkbox_group` - Checkbox group
- `segmented` - Segmented control (button-like options)

### Date and Time Fields

- `date_picker` - Date selection
- `date_picker_range` - Date range selection
- `time_picker` - Time selection
- `time_picker_range` - Time range selection

### Interactive Controls

- `switch` - Toggle switch
- `slider` - Slider control
- `rate` - Star rating
- `color_picker` - Color selection

### File Upload

- `upload` - File upload
- `upload.dragger` - Drag-and-drop file upload

### Complex Fields

- `form.list` - Dynamic list of fields
- `transfer` - Transfer selection
- `mention` - @mentions input

### Layout Elements

- `divider` - Horizontal divider
- `title` - Section title
- `text` - Static text
- `alert` - Information alert

### Example Field Definitions

```typescript
// Basic text input
{
  name: "fullName",
  type: FIELD_TYPES.INPUT,
  label: "Full Name",
  required: true,
  placeholder: "Enter your full name",
  grid: { xs: 24, md: 12 },
  order: 1
}

// Select with options
{
  name: "country",
  type: FIELD_TYPES.SELECT,
  label: "Country",
  required: true,
  placeholder: "Select your country",
  options: [
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
    { label: "United Kingdom", value: "uk" }
  ],
  grid: { xs: 24, md: 12 },
  order: 2
}

// Date picker with validation
{
  name: "birthDate",
  type: FIELD_TYPES.DATE_PICKER,
  label: "Date of Birth",
  required: true,
  rules: [
    {
      validator: (_, value) => {
        if (!value) return Promise.resolve();
        const age = moment().diff(value, 'years');
        return age >= 18
          ? Promise.resolve()
          : Promise.reject('You must be at least 18 years old');
      }
    }
  ],
  grid: { xs: 24, md: 12 },
  order: 3
}
```

## Complex Form Structures

### 1. Sections

Sections group related fields and can be collapsible:

```typescript
const sectionedFormSchema = {
    layout: "vertical",
    sections: [
        {
            title: "Personal Information",
            description: "Enter your personal details",
            fields: [
                {
                    name: "firstName",
                    type: FIELD_TYPES.INPUT,
                    label: "First Name",
                    required: true,
                    order: 1,
                },
                {
                    name: "lastName",
                    type: FIELD_TYPES.INPUT,
                    label: "Last Name",
                    required: true,
                    order: 2,
                },
                // More fields...
            ],
        },
        {
            title: "Contact Information",
            fields: [
                // Contact fields...
            ],
        },
    ],
};
```

### 2. Tabbed Forms

Tabs organize fields into separate panels:

```typescript
const tabbedFormSchema = {
  layout: "vertical",
  tabs: [
    {
      key: "personal",
      tab: "Personal Info",
      icon: <UserOutlined />,
      fields: [
        // Personal fields...
      ]
    },
    {
      key: "professional",
      tab: "Work History",
      icon: <BriefcaseOutlined />,
      fields: [
        // Professional fields...
      ]
    }
  ]
};
```

### 3. Multi-Step Forms

Steps break complex forms into a sequential wizard:

```typescript
const stepFormSchema = {
  layout: "vertical",
  ui: { showProgress: true },
  steps: [
    {
      title: "Account Setup",
      description: "Create your account",
      icon: <UserOutlined />,
      fields: [
        // Account fields...
      ],
      validation: async () => {
        // Custom step validation logic
        return true;
      }
    },
    {
      title: "Profile Details",
      description: "Tell us about yourself",
      fields: [
        // Profile fields...
      ]
    },
    // More steps...
  ]
};
```

### 4. Nested Dynamic Lists

For complex repeating structures:

```typescript
{
  name: "contacts",
  type: FIELD_TYPES.FORM_LIST,
  label: "Contact Information",
  formList: {
    min: 1,
    max: 5,
    addText: "Add Contact",
    allowReorder: true,
    allowDuplicate: true,
    template: [
      {
        name: "type",
        type: FIELD_TYPES.SELECT,
        label: "Contact Type",
        required: true,
        options: [
          { label: "Email", value: "email" },
          { label: "Phone", value: "phone" },
          { label: "Address", value: "address" }
        ],
        grid: { xs: 24, md: 6 },
        order: 1
      },
      {
        name: "value",
        type: FIELD_TYPES.INPUT,
        label: "Contact Value",
        required: true,
        grid: { xs: 24, md: 14 },
        order: 2
      },
      {
        name: "isPrimary",
        type: FIELD_TYPES.SWITCH,
        label: "Primary",
        grid: { xs: 24, md: 4 },
        order: 3
      }
    ]
  }
}
```

## Dependency System

The dependency system allows fields to respond to changes in other fields. Each dependency defines:

1. **Type** - What action to take (show/hide/etc.)
2. **Conditions** - When to take the action
3. **Logic** - How to combine conditions (AND/OR)
4. **Target** - What to set (for certain types)

### Key Dependency Types

| Type          | Description                           | Example Use Case                                            |
| ------------- | ------------------------------------- | ----------------------------------------------------------- |
| `show_if`     | Show field when conditions are met    | Show shipping fields for physical products                  |
| `hide_if`     | Hide field when conditions are met    | Hide payment fields when "Invoice me" is selected           |
| `enable_if`   | Enable field when conditions are met  | Enable discount code field when "Apply discount" is checked |
| `disable_if`  | Disable field when conditions are met | Disable edit button for archived records                    |
| `required_if` | Make field required conditionally     | Require reason when selecting "Other"                       |
| `optional_if` | Make field optional conditionally     | Make middle name optional for non-US customers              |
| `set_value`   | Set field value conditionally         | Set tax rate based on selected country                      |
| `clear_value` | Clear field value conditionally       | Clear shipping address when "Same as billing" is checked    |
| `set_options` | Change options conditionally          | Update city options based on selected state                 |
| `calculate`   | Calculate value from others           | Calculate total based on price and quantity                 |
| `custom`      | Custom logic                          | Complex validation or transformation                        |

### Dependency Examples

#### 1. Show/Hide Fields Based on Selection

```typescript
{
  name: "hasShippingAddress",
  type: FIELD_TYPES.SWITCH,
  label: "Use different shipping address"
},
{
  name: "shippingAddress",
  type: FIELD_TYPES.INPUT_TEXT_AREA,
  label: "Shipping Address",
  dependencies: [
    {
      type: DEPENDENCY_TYPES.SHOW_IF,
      conditions: [{ field: "hasShippingAddress", operator: OPERATORS.EQUALS, value: true }]
    },
    {
      type: DEPENDENCY_TYPES.REQUIRED_IF,
      conditions: [{ field: "hasShippingAddress", operator: OPERATORS.EQUALS, value: true }]
    }
  ]
}
```

#### 2. Dynamic Options Based on Other Fields

```typescript
{
  name: "country",
  type: FIELD_TYPES.SELECT,
  label: "Country",
  options: [
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" }
  ]
},
{
  name: "state",
  type: FIELD_TYPES.SELECT,
  label: "State/Province",
  dependencies: [
    {
      type: DEPENDENCY_TYPES.SET_OPTIONS,
      conditions: [{ field: "country", operator: OPERATORS.EQUALS, value: "us" }],
      target: [
        { label: "California", value: "ca" },
        { label: "New York", value: "ny" },
        { label: "Texas", value: "tx" }
      ]
    },
    {
      type: DEPENDENCY_TYPES.SET_OPTIONS,
      conditions: [{ field: "country", operator: OPERATORS.EQUALS, value: "ca" }],
      target: [
        { label: "Ontario", value: "on" },
        { label: "Quebec", value: "qc" },
        { label: "British Columbia", value: "bc" }
      ]
    }
  ]
}
```

#### 3. Calculation Field Example

```typescript
{
  name: "quantity",
  type: FIELD_TYPES.INPUT_NUMBER,
  label: "Quantity",
  required: true,
  props: { min: 1 }
},
{
  name: "unitPrice",
  type: FIELD_TYPES.INPUT_NUMBER,
  label: "Unit Price ($)",
  required: true,
  props: { min: 0, precision: 2 }
},
{
  name: "total",
  type: FIELD_TYPES.INPUT_NUMBER,
  label: "Total ($)",
  props: { disabled: true, precision: 2 },
  dependencies: [
    {
      type: DEPENDENCY_TYPES.CALCULATE,
      conditions: [
        { field: "quantity", operator: OPERATORS.IS_NOT_EMPTY },
        { field: "unitPrice", operator: OPERATORS.IS_NOT_EMPTY }
      ],
      logic: "AND",
      callback: (form, values) => {
        const quantity = Number(values.quantity) || 0;
        const unitPrice = Number(values.unitPrice) || 0;
        return (quantity * unitPrice).toFixed(2);
      }
    }
  ]
}
```

#### 4. Complex Conditions with Multiple Fields

```typescript
{
  name: "discountCode",
  type: FIELD_TYPES.INPUT,
  label: "Discount Code",
  dependencies: [
    {
      type: DEPENDENCY_TYPES.SHOW_IF,
      conditions: [
        { field: "orderTotal", operator: OPERATORS.GREATER_THAN, value: 100 },
        {
          field: "customerType",
          operator: OPERATORS.IN,
          values: ["premium", "vip"]
        }
      ],
      logic: "OR" // Show if EITHER condition is true
    }
  ]
}
```

## Validation

AppForm supports multiple validation methods:

### 1. Basic Required Validation

```typescript
{
  name: "email",
  type: FIELD_TYPES.INPUT,
  label: "Email",
  required: true  // Simple required validation
}
```

### 2. Built-in Rule Validation

```typescript
{
  name: "email",
  type: FIELD_TYPES.INPUT,
  label: "Email",
  rules: [
    { required: true, message: "Email is required" },
    { type: "email", message: "Please enter a valid email" },
    { max: 100, message: "Email cannot exceed 100 characters" }
  ]
}
```

### 3. Custom Validator Functions

```typescript
{
  name: "password",
  type: FIELD_TYPES.INPUT_PASSWORD,
  label: "Password",
  rules: [
    { required: true, message: "Password is required" },
    { min: 8, message: "Password must be at least 8 characters" },
    {
      validator: (_, value) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

        if (!value || (hasUpperCase && hasLowerCase && hasNumber && hasSpecial)) {
          return Promise.resolve();
        }
        return Promise.reject("Password must include uppercase, lowercase, number and special character");
      }
    }
  ]
}
```

### 4. Cross-Field Validation

```typescript
{
  name: "password",
  type: FIELD_TYPES.INPUT_PASSWORD,
  label: "Password",
  required: true
},
{
  name: "confirmPassword",
  type: FIELD_TYPES.INPUT_PASSWORD,
  label: "Confirm Password",
  required: true,
  rules: [
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject('Passwords do not match');
      },
    }),
  ]
}
```

### 5. Async Validation

```typescript
{
  name: "username",
  type: FIELD_TYPES.INPUT,
  label: "Username",
  rules: [
    { required: true, message: "Username is required" },
    {
      validator: async (_, value) => {
        if (!value) return Promise.resolve();

        // Check if username is available
        try {
          const response = await fetch(`/api/check-username?username=${value}`);
          const data = await response.json();

          if (data.isAvailable) {
            return Promise.resolve();
          }
          return Promise.reject("Username is already taken");
        } catch (error) {
          return Promise.reject("Failed to check username availability");
        }
      }
    }
  ]
}
```

## Custom Components & Rendering

### 1. Custom Field Component

```typescript
// Custom color picker field
const ColorPickerField = ({ value, onChange, disabled }) => {
  return (
    <div className="custom-color-picker">
      <div
        className="color-preview"
        style={{ backgroundColor: value || '#ffffff' }}
      />
      <input
        type="color"
        value={value || '#ffffff'}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
};

// Field definition
{
  name: "brandColor",
  type: FIELD_TYPES.CUSTOM,
  label: "Brand Color",
  customComponent: ColorPickerField
}
```

### 2. Field with Extra Buttons

```typescript
{
  name: "apiKey",
  type: FIELD_TYPES.INPUT,
  label: "API Key",
  extras: [
    {
      type: BUTTON_TYPES.CUSTOM,
      label: "Generate",
      icon: <KeyOutlined />,
      tooltip: "Generate new API key",
      callback: async (fieldName, form) => {
        try {
          const response = await fetch('/api/generate-key', { method: 'POST' });
          const data = await response.json();
          form.setFieldValue(fieldName, data.apiKey);
          message.success('Generated new API key');
        } catch (error) {
          message.error('Failed to generate API key');
        }
      }
    },
    {
      type: BUTTON_TYPES.COPY,
      tooltip: "Copy to clipboard",
      visible: (values) => !!values.apiKey,
      callback: (fieldName, form) => {
        const value = form.getFieldValue(fieldName);
        navigator.clipboard.writeText(value);
        message.success('Copied to clipboard');
      }
    }
  ]
}
```

### 3. Custom Form Rendering

```tsx
<AppForm
    schema={formSchema}
    renderHeader={() => (
        <div className="custom-form-header">
            <h2>Customer Registration</h2>
            <p>Please fill out all required information below</p>
        </div>
    )}
    renderFooter={(form, loading) => (
        <div className="custom-form-footer">
            <Space>
                <Button onClick={() => form.resetFields()}>Reset</Button>
                <Button type="primary" onClick={() => form.submit()} loading={loading}>
                    Complete Registration
                </Button>
            </Space>
        </div>
    )}
    renderField={(field, defaultRender) => {
        // Custom rendering for specific fields
        if (field.name === "termsAndConditions") {
            return (
                <div className="highlighted-field">
                    {defaultRender}
                    <Alert type="info" message="By accepting, you agree to our Privacy Policy" />
                </div>
            );
        }
        return defaultRender;
    }}
/>
```

## Advanced Examples

### 1. Complex Nested Data Structure

```typescript
const nestedDataSchema = {
    layout: "vertical",
    fields: [
        // Company Information
        {
            name: "company.name",
            type: FIELD_TYPES.INPUT,
            label: "Company Name",
            required: true,
            order: 1,
        },
        {
            name: "company.registrationNumber",
            type: FIELD_TYPES.INPUT,
            label: "Registration Number",
            order: 2,
        },
        {
            name: "company.foundedDate",
            type: FIELD_TYPES.DATE_PICKER,
            label: "Founded Date",
            order: 3,
        },
        // Nested address
        {
            name: "company.address.street",
            type: FIELD_TYPES.INPUT,
            label: "Street Address",
            order: 4,
        },
        {
            name: "company.address.city",
            type: FIELD_TYPES.INPUT,
            label: "City",
            order: 5,
        },
        {
            name: "company.address.state",
            type: FIELD_TYPES.INPUT,
            label: "State/Province",
            order: 6,
        },
        {
            name: "company.address.postalCode",
            type: FIELD_TYPES.INPUT,
            label: "Postal Code",
            order: 7,
        },
        {
            name: "company.address.country",
            type: FIELD_TYPES.SELECT,
            label: "Country",
            options: [
                { label: "United States", value: "us" },
                { label: "Canada", value: "ca" },
            ],
            order: 8,
        },
        // Dynamic contacts list
        {
            name: "company.contacts",
            type: FIELD_TYPES.FORM_LIST,
            label: "Contact Persons",
            order: 9,
            formList: {
                min: 1,
                max: 10,
                addText: "Add Contact Person",
                template: [
                    {
                        name: "name",
                        type: FIELD_TYPES.INPUT,
                        label: "Name",
                        required: true,
                        grid: { xs: 24, md: 12 },
                        order: 1,
                    },
                    {
                        name: "title",
                        type: FIELD_TYPES.INPUT,
                        label: "Job Title",
                        grid: { xs: 24, md: 12 },
                        order: 2,
                    },
                    {
                        name: "primary",
                        type: FIELD_TYPES.SWITCH,
                        label: "Primary Contact",
                        grid: { xs: 24, md: 6 },
                        order: 3,
                    },
                    {
                        name: "department",
                        type: FIELD_TYPES.SELECT,
                        label: "Department",
                        grid: { xs: 24, md: 18 },
                        options: [
                            { label: "Management", value: "management" },
                            { label: "Sales", value: "sales" },
                            { label: "Support", value: "support" },
                        ],
                        order: 4,
                    },
                    // Nested contact methods
                    {
                        name: "contactMethods",
                        type: FIELD_TYPES.FORM_LIST,
                        label: "Contact Methods",
                        order: 5,
                        formList: {
                            min: 1,
                            max: 5,
                            addText: "Add Contact Method",
                            template: [
                                {
                                    name: "type",
                                    type: FIELD_TYPES.SELECT,
                                    label: "Type",
                                    required: true,
                                    grid: { xs: 24, md: 8 },
                                    options: [
                                        { label: "Email", value: "email" },
                                        { label: "Phone", value: "phone" },
                                        { label: "Address", value: "address" },
                                    ],
                                    order: 1,
                                },
                                {
                                    name: "value",
                                    type: FIELD_TYPES.INPUT,
                                    label: "Value",
                                    required: true,
                                    grid: { xs: 24, md: 16 },
                                    order: 2,
                                },
                            ],
                        },
                    },
                ],
            },
        },
        // Dynamic product list
        {
            name: "products",
            type: FIELD_TYPES.FORM_LIST,
            label: "Products",
            order: 10,
            formList: {
                min: 0,
                max: 20,
                addText: "Add Product",
                template: [
                    {
                        name: "name",
                        type: FIELD_TYPES.INPUT,
                        label: "Product Name",
                        required: true,
                        grid: { xs: 24, md: 12 },
                        order: 1,
                    },
                    {
                        name: "sku",
                        type: FIELD_TYPES.INPUT,
                        label: "SKU",
                        grid: { xs: 24, md: 12 },
                        order: 2,
                    },
                    {
                        name: "price",
                        type: FIELD_TYPES.INPUT_NUMBER,
                        label: "Price",
                        required: true,
                        grid: { xs: 24, md: 8 },
                        props: { precision: 2, min: 0 },
                        order: 3,
                    },
                    {
                        name: "stock",
                        type: FIELD_TYPES.INPUT_NUMBER,
                        label: "Stock",
                        grid: { xs: 24, md: 8 },
                        props: { precision: 0, min: 0 },
                        order: 4,
                    },
                    {
                        name: "categories",
                        type: FIELD_TYPES.SELECT,
                        label: "Categories",
                        grid: { xs: 24, md: 8 },
                        props: { mode: "multiple" },
                        options: [
                            { label: "Electronics", value: "electronics" },
                            { label: "Clothing", value: "clothing" },
                            { label: "Home & Garden", value: "home" },
                        ],
                        order: 5,
                    },
                    // Nested variants
                    {
                        name: "variants",
                        type: FIELD_TYPES.FORM_LIST,
                        label: "Variants",
                        order: 6,
                        formList: {
                            min: 0,
                            max: 10,
                            addText: "Add Variant",
                            template: [
                                {
                                    name: "name",
                                    type: FIELD_TYPES.INPUT,
                                    label: "Variant Name",
                                    required: true,
                                    grid: { xs: 24, md: 12 },
                                    order: 1,
                                },
                                {
                                    name: "sku",
                                    type: FIELD_TYPES.INPUT,
                                    label: "Variant SKU",
                                    grid: { xs: 24, md: 12 },
                                    order: 2,
                                },
                                {
                                    name: "attributes",
                                    type: FIELD_TYPES.FORM_LIST,
                                    label: "Attributes",
                                    order: 3,
                                    formList: {
                                        min: 1,
                                        max: 5,
                                        addText: "Add Attribute",
                                        template: [
                                            {
                                                name: "name",
                                                type: FIELD_TYPES.INPUT,
                                                label: "Attribute Name",
                                                required: true,
                                                grid: { xs: 24, md: 12 },
                                                order: 1,
                                            },
                                            {
                                                name: "value",
                                                type: FIELD_TYPES.INPUT,
                                                label: "Attribute Value",
                                                required: true,
                                                grid: { xs: 24, md: 12 },
                                                order: 2,
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
};
```

### 2. Order Form with Tax and Discounts

```typescript
const orderFormSchema = {
    layout: "vertical",
    sections: [
        {
            title: "Customer Information",
            fields: [
                {
                    name: "customer.id",
                    type: FIELD_TYPES.INPUT,
                    label: "Customer ID",
                    required: true,
                    order: 1,
                    extras: [
                        {
                            type: BUTTON_TYPES.CUSTOM,
                            label: "Look Up",
                            callback: async (fieldName, form) => {
                                const id = form.getFieldValue(fieldName);
                                if (id) {
                                    // Simulate API call
                                    await new Promise(resolve => setTimeout(resolve, 1000));

                                    // Set other fields based on customer data
                                    form.setFieldsValue({
                                        "customer.name": "John Doe",
                                        "customer.email": "john@example.com",
                                        "customer.type": "premium",
                                        "customer.address": "123 Main St, New York, NY 10001",
                                    });
                                }
                            },
                        },
                    ],
                },
                {
                    name: "customer.name",
                    type: FIELD_TYPES.INPUT,
                    label: "Customer Name",
                    required: true,
                    order: 2,
                },
                {
                    name: "customer.email",
                    type: FIELD_TYPES.INPUT,
                    label: "Email",
                    required: true,
                    order: 3,
                },
                {
                    name: "customer.type",
                    type: FIELD_TYPES.SELECT,
                    label: "Customer Type",
                    options: [
                        { label: "Regular", value: "regular" },
                        { label: "Premium", value: "premium" },
                        { label: "VIP", value: "vip" },
                    ],
                    order: 4,
                },
                {
                    name: "customer.address",
                    type: FIELD_TYPES.INPUT_TEXT_AREA,
                    label: "Shipping Address",
                    required: true,
                    order: 5,
                },
            ],
        },
        {
            title: "Order Items",
            fields: [
                {
                    name: "items",
                    type: FIELD_TYPES.FORM_LIST,
                    label: "Order Items",
                    formList: {
                        min: 1,
                        addText: "Add Item",
                        template: [
                            {
                                name: "product",
                                type: FIELD_TYPES.SELECT,
                                label: "Product",
                                required: true,
                                grid: { xs: 24, md: 10 },
                                options: [
                                    { label: "Laptop", value: "laptop", price: 999.99 },
                                    { label: "Smartphone", value: "smartphone", price: 699.99 },
                                    { label: "Tablet", value: "tablet", price: 499.99 },
                                    { label: "Headphones", value: "headphones", price: 149.99 },
                                ],
                                order: 1,
                            },
                            {
                                name: "quantity",
                                type: FIELD_TYPES.INPUT_NUMBER,
                                label: "Quantity",
                                required: true,
                                props: { min: 1 },
                                grid: { xs: 24, md: 6 },
                                order: 2,
                            },
                            {
                                name: "unitPrice",
                                type: FIELD_TYPES.INPUT_NUMBER,
                                label: "Unit Price ($)",
                                props: { precision: 2, disabled: true },
                                grid: { xs: 24, md: 8 },
                                dependencies: [
                                    {
                                        type: DEPENDENCY_TYPES.CALCULATE,
                                        conditions: [{ field: "product", operator: OPERATORS.IS_NOT_EMPTY }],
                                        callback: (form, values, fieldName) => {
                                            const idx = fieldName.match(/\d+/)[0]; // Extract array index
                                            const product = values.items[idx].product;
                                            const options = form.getFieldValue(["items", idx, "product", "options"]);
                                            const selectedOption = options?.find(opt => opt.value === product);
                                            return selectedOption?.price || 0;
                                        },
                                    },
                                ],
                                order: 3,
                            },
                            {
                                name: "subtotal",
                                type: FIELD_TYPES.INPUT_NUMBER,
                                label: "Subtotal ($)",
                                props: { precision: 2, disabled: true },
                                grid: { xs: 24, md: 8 },
                                dependencies: [
                                    {
                                        type: DEPENDENCY_TYPES.CALCULATE,
                                        conditions: [
                                            { field: "quantity", operator: OPERATORS.IS_NOT_EMPTY },
                                            { field: "unitPrice", operator: OPERATORS.IS_NOT_EMPTY },
                                        ],
                                        logic: "AND",
                                        callback: (form, values, fieldName) => {
                                            const idx = fieldName.match(/\d+/)[0]; // Extract array index
                                            const quantity = Number(values.items[idx].quantity) || 0;
                                            const unitPrice = Number(values.items[idx].unitPrice) || 0;
                                            return (quantity * unitPrice).toFixed(2);
                                        },
                                    },
                                ],
                                order: 4,
                            },
                        ],
                    },
                },
                // Order summary fields with calculations
                {
                    name: "subtotal",
                    type: FIELD_TYPES.INPUT_NUMBER,
                    label: "Order Subtotal ($)",
                    props: { precision: 2, disabled: true },
                    dependencies: [
                        {
                            type: DEPENDENCY_TYPES.CALCULATE,
                            conditions: [{ field: "items", operator: OPERATORS.IS_NOT_EMPTY }],
                            callback: (form, values) => {
                                let total = 0;
                                if (values.items && Array.isArray(values.items)) {
                                    values.items.forEach(item => {
                                        total += Number(item.subtotal) || 0;
                                    });
                                }
                                return total.toFixed(2);
                            },
                        },
                    ],
                },
                {
                    name: "hasDiscount",
                    type: FIELD_TYPES.SWITCH,
                    label: "Apply Discount",
                },
                {
                    name: "discountType",
                    type: FIELD_TYPES.RADIO_GROUP,
                    label: "Discount Type",
                    options: [
                        { label: "Percentage", value: "percentage" },
                        { label: "Fixed Amount", value: "fixed" },
                    ],
                    dependencies: [
                        {
                            type: DEPENDENCY_TYPES.SHOW_IF,
                            conditions: [{ field: "hasDiscount", operator: OPERATORS.EQUALS, value: true }],
                        },
                    ],
                },
                {
                    name: "discountValue",
                    type: FIELD_TYPES.INPUT_NUMBER,
                    label: "Discount Value",
                    props: {
                        min: 0,
                        precision: 2,
                    },
                    dependencies: [
                        {
                            type: DEPENDENCY_TYPES.SHOW_IF,
                            conditions: [{ field: "hasDiscount", operator: OPERATORS.EQUALS, value: true }],
                        },
                        {
                            type: DEPENDENCY_TYPES.SET_PROPS,
                            conditions: [{ field: "discountType", operator: OPERATORS.EQUALS, value: "percentage" }],
                            target: {
                                max: 100,
                                formatter: value => `${value}%`,
                                parser: value => value.replace("%", ""),
                            },
                        },
                    ],
                },
                {
                    name: "discountAmount",
                    type: FIELD_TYPES.INPUT_NUMBER,
                    label: "Discount Amount ($)",
                    props: { precision: 2, disabled: true },
                    dependencies: [
                        {
                            type: DEPENDENCY_TYPES.SHOW_IF,
                            conditions: [{ field: "hasDiscount", operator: OPERATORS.EQUALS, value: true }],
                        },
                        {
                            type: DEPENDENCY_TYPES.CALCULATE,
                            conditions: [
                                { field: "subtotal", operator: OPERATORS.IS_NOT_EMPTY },
                                { field: "discountValue", operator: OPERATORS.IS_NOT_EMPTY },
                                { field: "discountType", operator: OPERATORS.IS_NOT_EMPTY },
                            ],
                            logic: "AND",
                            callback: (form, values) => {
                                const subtotal = Number(values.subtotal) || 0;
                                const discountValue = Number(values.discountValue) || 0;

                                if (values.discountType === "percentage") {
                                    return ((subtotal * discountValue) / 100).toFixed(2);
                                } else {
                                    return Math.min(subtotal, discountValue).toFixed(2);
                                }
                            },
                        },
                    ],
                },
                {
                    name: "taxRate",
                    type: FIELD_TYPES.INPUT_NUMBER,
                    label: "Tax Rate (%)",
                    props: {
                        min: 0,
                        max: 30,
                        precision: 2,
                        formatter: value => `${value}%`,
                        parser: value => value.replace("%", ""),
                    },
                },
                {
                    name: "taxAmount",
                    type: FIELD_TYPES.INPUT_NUMBER,
                    label: "Tax Amount ($)",
                    props: { precision: 2, disabled: true },
                    dependencies: [
                        {
                            type: DEPENDENCY_TYPES.CALCULATE,
                            conditions: [
                                { field: "subtotal", operator: OPERATORS.IS_NOT_EMPTY },
                                { field: "taxRate", operator: OPERATORS.IS_NOT_EMPTY },
                                { field: "discountAmount", operator: OPERATORS.IS_NOT_EMPTY },
                            ],
                            callback: (form, values) => {
                                const subtotal = Number(values.subtotal) || 0;
                                const discountAmount = Number(values.discountAmount) || 0;
                                const taxRate = Number(values.taxRate) || 0;

                                const taxableAmount = subtotal - discountAmount;
                                return ((taxableAmount * taxRate) / 100).toFixed(2);
                            },
                        },
                    ],
                },
                {
                    name: "totalAmount",
                    type: FIELD_TYPES.INPUT_NUMBER,
                    label: "Total Order Amount ($)",
                    props: { precision: 2, disabled: true },
                    dependencies: [
                        {
                            type: DEPENDENCY_TYPES.CALCULATE,
                            conditions: [{ field: "subtotal", operator: OPERATORS.IS_NOT_EMPTY }],
                            callback: (form, values) => {
                                const subtotal = Number(values.subtotal) || 0;
                                const discountAmount = Number(values.discountAmount) || 0;
                                const taxAmount = Number(values.taxAmount) || 0;

                                return (subtotal - discountAmount + taxAmount).toFixed(2);
                            },
                        },
                    ],
                },
            ],
        },
        {
            title: "Payment Information",
            fields: [
                {
                    name: "paymentMethod",
                    type: FIELD_TYPES.RADIO_GROUP,
                    label: "Payment Method",
                    required: true,
                    options: [
                        { label: "Credit Card", value: "credit_card" },
                        { label: "PayPal", value: "paypal" },
                        { label: "Bank Transfer", value: "bank_transfer" },
                        { label: "Invoice", value: "invoice" },
                    ],
                },
                // Credit card fields
                {
                    name: "creditCard.number",
                    type: FIELD_TYPES.INPUT,
                    label: "Card Number",
                    dependencies: [
                        {
                            type: DEPENDENCY_TYPES.SHOW_IF,
                            conditions: [{ field: "paymentMethod", operator: OPERATORS.EQUALS, value: "credit_card" }],
                        },
                        {
                            type: DEPENDENCY_TYPES.REQUIRED_IF,
                            conditions: [{ field: "paymentMethod", operator: OPERATORS.EQUALS, value: "credit_card" }],
                        },
                    ],
                },
                {
                    name: "creditCard.expiryDate",
                    type: FIELD_TYPES.INPUT,
                    label: "Expiry Date (MM/YY)",
                    dependencies: [
                        {
                            type: DEPENDENCY_TYPES.SHOW_IF,
                            conditions: [{ field: "paymentMethod", operator: OPERATORS.EQUALS, value: "credit_card" }],
                        },
                        {
                            type: DEPENDENCY_TYPES.REQUIRED_IF,
                            conditions: [{ field: "paymentMethod", operator: OPERATORS.EQUALS, value: "credit_card" }],
                        },
                    ],
                },
                {
                    name: "creditCard.cvv",
                    type: FIELD_TYPES.INPUT,
                    label: "CVV",
                    dependencies: [
                        {
                            type: DEPENDENCY_TYPES.SHOW_IF,
                            conditions: [{ field: "paymentMethod", operator: OPERATORS.EQUALS, value: "credit_card" }],
                        },
                        {
                            type: DEPENDENCY_TYPES.REQUIRED_IF,
                            conditions: [{ field: "paymentMethod", operator: OPERATORS.EQUALS, value: "credit_card" }],
                        },
                    ],
                },
                // PayPal email
                {
                    name: "paypal.email",
                    type: FIELD_TYPES.INPUT,
                    label: "PayPal Email",
                    dependencies: [
                        {
                            type: DEPENDENCY_TYPES.SHOW_IF,
                            conditions: [{ field: "paymentMethod", operator: OPERATORS.EQUALS, value: "paypal" }],
                        },
                        {
                            type: DEPENDENCY_TYPES.REQUIRED_IF,
                            conditions: [{ field: "paymentMethod", operator: OPERATORS.EQUALS, value: "paypal" }],
                        },
                    ],
                },
                // Bank transfer details
                {
                    name: "bankTransfer.accountName",
                    type: FIELD_TYPES.INPUT,
                    label: "Account Name",
                    dependencies: [
                        {
                            type: DEPENDENCY_TYPES.SHOW_IF,
                            conditions: [
                                { field: "paymentMethod", operator: OPERATORS.EQUALS, value: "bank_transfer" },
                            ],
                        },
                        {
                            type: DEPENDENCY_TYPES.REQUIRED_IF,
                            conditions: [
                                { field: "paymentMethod", operator: OPERATORS.EQUALS, value: "bank_transfer" },
                            ],
                        },
                    ],
                },
                {
                    name: "bankTransfer.accountNumber",
                    type: FIELD_TYPES.INPUT,
                    label: "Account Number",
                    dependencies: [
                        {
                            type: DEPENDENCY_TYPES.SHOW_IF,
                            conditions: [
                                { field: "paymentMethod", operator: OPERATORS.EQUALS, value: "bank_transfer" },
                            ],
                        },
                        {
                            type: DEPENDENCY_TYPES.REQUIRED_IF,
                            conditions: [
                                { field: "paymentMethod", operator: OPERATORS.EQUALS, value: "bank_transfer" },
                            ],
                        },
                    ],
                },
                {
                    name: "bankTransfer.bankName",
                    type: FIELD_TYPES.INPUT,
                    label: "Bank Name",
                    dependencies: [
                        {
                            type: DEPENDENCY_TYPES.SHOW_IF,
                            conditions: [
                                { field: "paymentMethod", operator: OPERATORS.EQUALS, value: "bank_transfer" },
                            ],
                        },
                    ],
                },
                // Invoice details
                {
                    name: "invoice.poNumber",
                    type: FIELD_TYPES.INPUT,
                    label: "Purchase Order Number",
                    dependencies: [
                        {
                            type: DEPENDENCY_TYPES.SHOW_IF,
                            conditions: [{ field: "paymentMethod", operator: OPERATORS.EQUALS, value: "invoice" }],
                        },
                        {
                            type: DEPENDENCY_TYPES.REQUIRED_IF,
                            conditions: [{ field: "paymentMethod", operator: OPERATORS.EQUALS, value: "invoice" }],
                        },
                    ],
                },
                {
                    name: "invoice.terms",
                    type: FIELD_TYPES.SELECT,
                    label: "Payment Terms",
                    options: [
                        { label: "Net 15", value: "net15" },
                        { label: "Net 30", value: "net30" },
                        { label: "Net 45", value: "net45" },
                        { label: "Net 60", value: "net60" },
                    ],
                    dependencies: [
                        {
                            type: DEPENDENCY_TYPES.SHOW_IF,
                            conditions: [{ field: "paymentMethod", operator: OPERATORS.EQUALS, value: "invoice" }],
                        },
                    ],
                },
            ],
        },
        {
            title: "Notes & Terms",
            fields: [
                {
                    name: "notes",
                    type: FIELD_TYPES.INPUT_TEXT_AREA,
                    label: "Order Notes",
                    props: { rows: 4 },
                },
                {
                    name: "termsAccepted",
                    type: FIELD_TYPES.CHECKBOX_GROUP,
                    label: "Terms & Conditions",
                    required: true,
                    options: [
                        { label: "I accept the terms and conditions of sale", value: "terms" },
                        { label: "I agree to the privacy policy", value: "privacy" },
                    ],
                },
            ],
        },
    ],
    hooks: {
        beforeSubmit: async values => {
            // Format for API submission
            return {
                ...values,
                submittedAt: new Date().toISOString(),
                orderNumber: `ORD-${Date.now()}`,
            };
        },
    },
};
```
