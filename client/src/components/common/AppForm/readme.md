# AppForm Component - Comprehensive Documentation

## Overview

AppForm is a powerful, flexible React component built on Ant Design that provides a declarative approach to building complex forms with minimal code. It transforms JSON schema definitions into fully functional forms with advanced features like conditional rendering, multi-step wizards, validation, and more.

## Why Use AppForm?

Traditional form development can be repetitive and time-consuming. AppForm solves this by:

- **Reducing boilerplate code** - Define forms with JSON instead of JSX
- **Standardizing form implementation** - Consistent UX across your application
- **Simplifying complex forms** - Handle dependencies and conditions declaratively
- **Speeding up development** - Build forms in minutes instead of hours
- **Supporting dynamic forms** - Change form structure based on user input
- **Enabling form reuse** - Define once, use anywhere

## Basic Usage

```tsx
import AppForm from "./components/common/AppForm";
import { FIELD_TYPES } from "./components/common/AppForm/form.type";

const basicSchema = {
    layout: "vertical",
    size: "middle",
    fields: [
        {
            name: "username",
            type: FIELD_TYPES.INPUT,
            label: "Username",
            required: true,
            placeholder: "Enter username",
        },
        {
            name: "email",
            type: FIELD_TYPES.INPUT,
            label: "Email",
            required: true,
            rules: [{ type: "email", message: "Please enter a valid email" }],
        },
    ],
};

const MyForm = () => {
    const handleSubmit = values => {
        console.log("Form submitted:", values);
        // Process form submission
    };

    return <AppForm schema={basicSchema} onFinish={handleSubmit} />;
};
```

## Component Props

### Core Props

| Prop             | Type                                           | Required | Default | Description                     | Purpose                                                   |
| ---------------- | ---------------------------------------------- | -------- | ------- | ------------------------------- | --------------------------------------------------------- |
| `schema`         | `FormSchema`                                   | ✅       | -       | Form configuration schema       | Defines the entire structure and behavior of the form     |
| `initialValues`  | `Record<string, any>`                          | ❌       | `{}`    | Initial form values             | Pre-fills form fields with values (useful for edit forms) |
| `onFinish`       | `(values: any) => void \| Promise<any>`        | ❌       | -       | Form submission handler         | Processes form data when successfully submitted           |
| `onFinishFailed` | `(errorInfo: any) => void`                     | ❌       | -       | Form validation failure handler | Handles validation errors during submission               |
| `onValuesChange` | `(changedValues: any, allValues: any) => void` | ❌       | -       | Values change handler           | Tracks changes to form values in real-time                |
| `form`           | `FormInstance`                                 | ❌       | -       | External form instance          | Allows external control of the form instance              |

### State Props

| Prop       | Type                           | Default    | Description          | Purpose                                                                  |
| ---------- | ------------------------------ | ---------- | -------------------- | ------------------------------------------------------------------------ |
| `loading`  | `boolean`                      | `false`    | Shows loading state  | Disables form and shows loading indicators during async operations       |
| `disabled` | `boolean`                      | `false`    | Disables entire form | Prevents user interaction with all form fields                           |
| `readonly` | `boolean`                      | `false`    | Makes form read-only | Shows form data without allowing edits (different styling than disabled) |
| `mode`     | `'create' \| 'edit' \| 'view'` | `'create'` | Form mode            | Changes button text and may affect form behavior based on context        |

### Advanced Props

| Prop                 | Type                                                                      | Default | Description                       | Purpose                                                   |
| -------------------- | ------------------------------------------------------------------------- | ------- | --------------------------------- | --------------------------------------------------------- |
| `autoSave`           | `boolean`                                                                 | `false` | Enables auto-save functionality   | Automatically saves form data periodically                |
| `validateOnMount`    | `boolean`                                                                 | `false` | Validates form on component mount | Shows validation errors immediately when form loads       |
| `preserveFormData`   | `boolean`                                                                 | `false` | Preserves data across renders     | Maintains form state when component remounts              |
| `formKey`            | `string`                                                                  | -       | Unique form identifier            | Used for caching and storage identification               |
| `onAutoSave`         | `(values: any) => void`                                                   | -       | Auto-save callback                | Handles form data during auto-save events                 |
| `onValidationChange` | `(errors: any[]) => void`                                                 | -       | Validation state change           | Notifies when form validation status changes              |
| `onFormReady`        | `(form: FormInstance) => void`                                            | -       | Form initialization callback      | Called when form is fully initialized and ready           |
| `renderHeader`       | `() => React.ReactNode`                                                   | -       | Custom header renderer            | Allows custom header content above the form               |
| `renderFooter`       | `(form: FormInstance, loading: boolean) => React.ReactNode`               | -       | Custom footer renderer            | Customizes the form buttons and footer area               |
| `renderField`        | `(field: FieldConfig, defaultRender: React.ReactNode) => React.ReactNode` | -       | Custom field renderer             | Customizes rendering of individual fields                 |
| `plugins`            | `Array<(form: FormInstance, schema: FormSchema) => void>`                 | -       | Form plugins                      | Extends form functionality with custom plugins            |
| `middleware`         | `Array<(values: any) => any>`                                             | -       | Value transformation middleware   | Transforms form values before submission or after changes |

## Form Schema (`FormSchema`)

The schema is the heart of AppForm. It defines everything about your form: fields, layout, validation, and behavior.

### Layout Configuration

```tsx
interface FormSchema {
    // Basic Layout
    layout?: "horizontal" | "vertical" | "inline"; // Form layout direction
    size?: "small" | "middle" | "large"; // Size of form controls
    colon?: boolean; // Whether to show colon after label
    labelAlign?: "left" | "right"; // Label text alignment
    labelCol?: object; // Label column layout
    wrapperCol?: object; // Form control column layout

    // Structure Types (use one of these)
    fields?: FieldConfig[]; // Simple field list
    sections?: FormSection[]; // Collapsible sections
    steps?: FormStep[]; // Multi-step wizard
    tabs?: FormTab[]; // Tabbed interface

    // Auto-save Configuration
    autoSave?: {
        enabled: boolean; // Enable auto-save
        interval: number; // Milliseconds between saves
        key?: string; // Storage key for saved data
    };

    // Validation Configuration
    validation?: {
        validateOnChange?: boolean; // Validate on field change
        validateOnBlur?: boolean; // Validate when field loses focus
        validateTrigger?: string | string[]; // Custom validation triggers
        scrollToError?: boolean; // Auto-scroll to first error
    };

    // UI Configuration
    ui?: {
        theme?: "default" | "compact" | "comfortable"; // Visual density theme
        showProgress?: boolean; // Show completion progress
        showFieldCount?: boolean; // Show count of fields
        compactMode?: boolean; // Use compact layout
        floatingLabels?: boolean; // Use floating labels
    };

    // Lifecycle Hooks
    hooks?: {
        beforeSubmit?: (values: any) => any | Promise<any>; // Transform values before submit
        afterSubmit?: (values: any, result?: any) => void; // Called after successful submit
        beforeReset?: () => boolean | Promise<boolean>; // Called before form reset
        afterReset?: () => void; // Called after form reset
        onFieldChange?: (fieldName: string, value: any, allValues: any) => void; // Field change
    };
}
```

### Structure Types

#### 1. Sections - Group related fields together

```tsx
interface FormSection {
    title: string; // Section title
    description?: string; // Section description
    fields: FieldConfig[]; // Fields in this section
    collapsible?: boolean; // Whether section can collapse
    defaultCollapsed?: boolean; // Initial collapsed state
    icon?: React.ReactNode; // Section icon
    extra?: React.ReactNode; // Extra content in header
}
```

**When to use**: Use sections when you have logical groups of fields that belong together. Sections help organize complex forms into manageable chunks.

#### 2. Steps - Break form into sequential steps

```tsx
interface FormStep {
    title: string; // Step title
    description?: string; // Step description
    icon?: React.ReactNode; // Step icon
    status?: "wait" | "process" | "finish" | "error"; // Step status
    fields: FieldConfig[]; // Fields in this step
    validation?: () => boolean | Promise<boolean>; // Custom step validation
}
```

**When to use**: Use steps for complex forms that are easier to complete in a guided sequence, especially when later fields depend on earlier choices.

#### 3. Tabs - Organize fields into tabbed panels

```tsx
interface FormTab {
    key: string; // Unique tab identifier
    tab: string; // Tab label text
    icon?: React.ReactNode; // Tab icon
    fields: FieldConfig[]; // Fields in this tab
    disabled?: boolean; // Whether tab is disabled
    closable?: boolean; // Whether tab can be closed
}
```

**When to use**: Use tabs when you have independent sections of a form that users may need to switch between but don't necessarily need to complete in a specific order.

### Field Configuration (`FieldConfig`)

Fields are the building blocks of your form. Each field defines a single input element.

```tsx
interface FieldConfig {
    // Basic Properties
    name: string; // Field identifier (used in form values)
    type: keyof typeof FIELD_TYPES; // Field component type
    label?: string; // Field label
    placeholder?: string; // Placeholder text
    tooltip?: string; // Help tooltip
    description?: string; // Field description

    // State Properties
    required?: boolean; // Whether field is required
    disabled?: boolean; // Whether field is disabled
    hidden?: boolean; // Whether field is hidden
    readOnly?: boolean; // Whether field is read-only

    // Data Properties
    options?: Option[]; // Options for select-type fields
    dataSource?: any[]; // Data source for complex components
    props?: Record<string, any>; // Additional component props
    defaultValue?: any; // Default value

    // Layout Properties
    grid?: ColProps; // Grid layout properties
    style?: React.CSSProperties; // Custom inline styles
    className?: string; // CSS classes
    span?: number; // Column span (alternative to grid)
    offset?: number; // Column offset
    order?: number; // Column order
    flex?: string | number; // Flex layout property

    // Validation & Dependencies
    rules?: ValidationRule[]; // Validation rules
    dependencies?: FormDependency[]; // Field dependencies
    extras?: ExtraButton[]; // Extra action buttons

    // Advanced Properties
    customComponent?: React.ComponentType<any>; // Custom field component
    formList?: FormListConfig; // Dynamic form list configuration
    conditionalGroups?: ConditionalGroup[]; // Conditional field groups
    nestedForm?: NestedFormConfig; // Nested form configuration

    // Performance Optimization
    debounce?: number; // Debounce delay for changes
    lazy?: boolean; // Lazy render the field
    memoize?: boolean; // Memoize the field component

    // Data Transformation
    formatter?: (value: any) => any; // Format value for display
    parser?: (value: any) => any; // Parse user input
    transform?: (value: any, allValues: any) => any; // Transform value
}
```

## Detailed Field Examples

### Text Input Fields

#### 1. Basic Text Input

```tsx
{
  name: "fullName",
  type: FIELD_TYPES.INPUT,
  label: "Full Name",
  placeholder: "Enter your full name",
  required: true,
  tooltip: "Your legal name as it appears on official documents",
  description: "This will be used for all official communications",
}
```

#### 2. Email Input with Validation

```tsx
{
  name: "email",
  type: FIELD_TYPES.INPUT,
  label: "Email Address",
  placeholder: "example@domain.com",
  required: true,
  rules: [
    { type: "email", message: "Please enter a valid email address" },
    { max: 100, message: "Email cannot exceed 100 characters" }
  ],
  extras: [
    {
      type: "custom",
      label: "Verify",
      callback: async (fieldName, form) => {
        const email = form.getFieldValue(fieldName);
        // Perform email verification
        await verifyEmail(email);
      }
    }
  ]
}
```

#### 3. Password Input with Strength Requirements

```tsx
{
  name: "password",
  type: FIELD_TYPES.INPUT_PASSWORD,
  label: "Password",
  required: true,
  rules: [
    { min: 8, message: "Password must be at least 8 characters" },
    {
      validator: (_, value) => {
        if (!value || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)) {
          return Promise.resolve();
        }
        return Promise.reject("Password must include uppercase, lowercase, number and special character");
      }
    }
  ]
}
```

### Selection Fields

#### 4. Select Dropdown with Custom Rendering

```tsx
{
  name: "country",
  type: FIELD_TYPES.SELECT,
  label: "Country",
  placeholder: "Select your country",
  required: true,
  options: [
    { label: "United States", value: "us", icon: <UsFlag /> },
    { label: "Canada", value: "ca", icon: <CanadaFlag /> },
    { label: "United Kingdom", value: "uk", icon: <UkFlag /> }
  ],
  props: {
    showSearch: true,
    filterOption: (input, option) =>
      option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
    optionRender: (option) => (
      <Space>
        {option.data.icon}
        {option.data.label}
      </Space>
    )
  }
}
```

#### 5. Cascading Selection

```tsx
{
  name: "location",
  type: FIELD_TYPES.CASCADER,
  label: "Location",
  placeholder: "Select your location",
  required: true,
  options: [
    {
      value: 'us',
      label: 'United States',
      children: [
        {
          value: 'ny',
          label: 'New York',
          children: [
            { value: 'nyc', label: 'New York City' },
            { value: 'buf', label: 'Buffalo' },
          ]
        },
        {
          value: 'ca',
          label: 'California',
          children: [
            { value: 'sf', label: 'San Francisco' },
            { value: 'la', label: 'Los Angeles' },
          ]
        }
      ]
    }
  ],
  props: {
    showSearch: true,
    changeOnSelect: true
  }
}
```

### Date & Time Fields

#### 6. Date Picker with Custom Format and Validation

```tsx
{
  name: "birthDate",
  type: FIELD_TYPES.DATE_PICKER,
  label: "Birth Date",
  required: true,
  props: {
    format: "MMMM D, YYYY",
    disabledDate: (current) => {
      // Can't select dates in the future or more than 100 years ago
      return current && (current > moment() || current < moment().subtract(100, 'years'));
    }
  },
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
  ]
}
```

### Dynamic Fields

#### 7. Form List for Multiple Entries

```tsx
{
  name: "contacts",
  type: FIELD_TYPES.FORM_LIST,
  label: "Contact Information",
  formList: {
    min: 1,
    max: 5,
    addText: "Add Contact Method",
    allowReorder: true,
    allowDuplicate: true,
    template: [
      {
        name: "type",
        type: FIELD_TYPES.SELECT,
        label: "Type",
        required: true,
        options: [
          { label: "Email", value: "email" },
          { label: "Phone", value: "phone" },
          { label: "Address", value: "address" }
        ],
        grid: { xs: 24, md: 8 }
      },
      {
        name: "value",
        type: FIELD_TYPES.INPUT,
        label: "Value",
        required: true,
        grid: { xs: 24, md: 12 },
        dependencies: [
          {
            type: DEPENDENCY_TYPES.SET_PROPS,
            conditions: [{ field: "type", operator: OPERATORS.EQUALS, value: "email" }],
            target: {
              placeholder: "Enter email address",
              type: "email"
            }
          },
          {
            type: DEPENDENCY_TYPES.SET_PROPS,
            conditions: [{ field: "type", operator: OPERATORS.EQUALS, value: "phone" }],
            target: {
              placeholder: "Enter phone number",
              type: "tel"
            }
          }
        ]
      },
      {
        name: "isPrimary",
        type: FIELD_TYPES.SWITCH,
        label: "Primary",
        grid: { xs: 24, md: 4 }
      }
    ]
  }
}
```

## Dependencies & Conditional Logic

One of AppForm's most powerful features is its declarative dependency system. This allows fields to respond to changes in other fields.

### Understanding Dependencies

A dependency defines how a field should change based on the values of other fields. Each dependency consists of:

1. **Type** - What action to take (show/hide/enable/disable/etc.)
2. **Conditions** - When to take the action (based on other fields' values)
3. **Logic** - How to combine multiple conditions (AND/OR)
4. **Target** - What value or options to set (for certain dependency types)

### Dependency Types

| Type             | Description                                  | Example Use Case                                               |
| ---------------- | -------------------------------------------- | -------------------------------------------------------------- |
| `show_if`        | Show field when conditions are met           | Show address fields only for physical products                 |
| `hide_if`        | Hide field when conditions are met           | Hide credit card fields when "Pay Later" is selected           |
| `enable_if`      | Enable field when conditions are met         | Enable "Other" text field when "Other" is selected in dropdown |
| `disable_if`     | Disable field when conditions are met        | Disable shipping options for digital products                  |
| `required_if`    | Make field required when conditions are met  | Require company name when "Business" account type is selected  |
| `optional_if`    | Make field optional when conditions are met  | Make middle name optional for non-US customers                 |
| `set_value`      | Set field value when conditions are met      | Set tax rate based on selected state                           |
| `clear_value`    | Clear field value when conditions are met    | Clear shipping address when "Same as billing" is checked       |
| `set_options`    | Change field options when conditions are met | Change city options based on selected state                    |
| `filter_options` | Filter field options when conditions are met | Filter available products based on category selection          |
| `calculate`      | Calculate field value based on other fields  | Calculate total price based on quantity and unit price         |
| `custom`         | Custom dependency logic                      | Complex validation or transformation logic                     |

### Dependency Conditions

Conditions use operators to compare field values:

| Operator       | Description                   | Example                                                          |
| -------------- | ----------------------------- | ---------------------------------------------------------------- |
| `equals`       | Field value equals target     | `{ field: 'type', operator: 'equals', value: 'business' }`       |
| `not_equals`   | Field value not equals target | `{ field: 'status', operator: 'not_equals', value: 'inactive' }` |
| `greater_than` | Numeric comparison            | `{ field: 'age', operator: 'greater_than', value: 18 }`          |
| `less_than`    | Numeric comparison            | `{ field: 'price', operator: 'less_than', value: 100 }`          |
| `contains`     | String contains substring     | `{ field: 'name', operator: 'contains', value: 'admin' }`        |
| `in`           | Value in array                | `{ field: 'category', operator: 'in', values: ['A', 'B'] }`      |
| `is_empty`     | Field is empty                | `{ field: 'comments', operator: 'is_empty' }`                    |
| `is_not_empty` | Field is not empty            | `{ field: 'email', operator: 'is_not_empty' }`                   |

### Dependency Examples

#### 1. Show Field Based on Selection

```tsx
{
  name: "accountType",
  type: FIELD_TYPES.RADIO_GROUP,
  label: "Account Type",
  options: [
    { label: "Personal", value: "personal" },
    { label: "Business", value: "business" }
  ]
},
{
  name: "companyName",
  type: FIELD_TYPES.INPUT,
  label: "Company Name",
  dependencies: [
    {
      type: DEPENDENCY_TYPES.SHOW_IF,
      conditions: [
        { field: "accountType", operator: OPERATORS.EQUALS, value: "business" }
      ]
    },
    {
      type: DEPENDENCY_TYPES.REQUIRED_IF,
      conditions: [
        { field: "accountType", operator: OPERATORS.EQUALS, value: "business" }
      ]
    }
  ]
}
```

#### 2. Set Options Based on Another Field

```tsx
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
  label: "State",
  dependencies: [
    {
      type: DEPENDENCY_TYPES.SET_OPTIONS,
      conditions: [
        { field: "country", operator: OPERATORS.EQUALS, value: "us" }
      ],
      target: [
        { label: "California", value: "ca" },
        { label: "New York", value: "ny" },
        { label: "Texas", value: "tx" }
      ]
    },
    {
      type: DEPENDENCY_TYPES.SET_OPTIONS,
      conditions: [
        { field: "country", operator: OPERATORS.EQUALS, value: "ca" }
      ],
      target: [
        { label: "Ontario", value: "on" },
        { label: "Quebec", value: "qc" },
        { label: "British Columbia", value: "bc" }
      ]
    }
  ]
}
```

#### 3. Complex Condition with Multiple Fields

```tsx
{
  name: "shippingMethod",
  type: FIELD_TYPES.SELECT,
  label: "Shipping Method",
  options: [
    { label: "Standard", value: "standard" },
    { label: "Express", value: "express" },
    { label: "Overnight", value: "overnight" }
  ],
  dependencies: [
    {
      type: DEPENDENCY_TYPES.DISABLE_IF,
      conditions: [
        { field: "totalWeight", operator: OPERATORS.GREATER_THAN, value: 50 },
        { field: "country", operator: OPERATORS.NOT_EQUALS, value: "us" }
      ],
      logic: "OR",
      target: ["overnight", "express"]
    }
  ]
}
```

#### 4. Calculate Field Values

```tsx
{
  name: "quantity",
  type: FIELD_TYPES.INPUT_NUMBER,
  label: "Quantity",
  props: { min: 1 }
},
{
  name: "unitPrice",
  type: FIELD_TYPES.INPUT_NUMBER,
  label: "Unit Price ($)",
  props: { min: 0, precision: 2 }
},
{
  name: "totalPrice",
  type: FIELD_TYPES.INPUT_NUMBER,
  label: "Total Price ($)",
  props: { precision: 2, disabled: true },
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

## Validation System

AppForm supports both built-in validation rules and custom validation functions.

### Built-in Validation Rules

```tsx
{
  name: "email",
  type: FIELD_TYPES.INPUT,
  label: "Email",
  rules: [
    { required: true, message: "Email is required" },            // Required field
    { type: "email", message: "Please enter a valid email" },    // Format validation
    { min: 5, message: "Email must be at least 5 characters" },  // Minimum length
    { max: 50, message: "Email must be less than 50 characters" } // Maximum length
  ]
}
```

### Custom Validation with Validator Function

```tsx
{
  name: "username",
  type: FIELD_TYPES.INPUT,
  label: "Username",
  rules: [
    { required: true, message: "Username is required" },
    {
      validator: async (rule, value) => {
        if (!value || value.length < 3) {
          throw new Error("Username must be at least 3 characters");
        }

        // Check uniqueness with API call
        const exists = await checkUsernameExists(value);
        if (exists) {
          throw new Error("Username already exists");
        }
      }
    }
  ]
}
```

### Cross-field Validation

```tsx
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

## Advanced Features

### Form Hooks

Form hooks allow you to intercept and modify form behavior at key points in the form lifecycle.

```tsx
const formSchema = {
    // ...field definitions
    hooks: {
        // Transform values before submission
        beforeSubmit: async values => {
            // Convert dates to ISO format
            const formattedValues = { ...values };
            if (values.birthDate) {
                formattedValues.birthDate = values.birthDate.toISOString();
            }
            // Add metadata
            formattedValues.submittedAt = new Date().toISOString();
            formattedValues.version = "1.0.0";

            return formattedValues;
        },

        // Run code after successful submission
        afterSubmit: (values, result) => {
            console.log("Form submitted successfully with result:", result);
            message.success("Form submitted successfully!");
            analytics.track("Form Submitted", { formId: "registration" });
        },

        // Run before form reset (can prevent reset)
        beforeReset: async () => {
            // Ask for confirmation if form has changes
            if (form.isFieldsTouched()) {
                const confirmed = await confirm("Are you sure you want to reset? All changes will be lost.");
                return confirmed;
            }
            return true;
        },

        // Run after form reset
        afterReset: () => {
            console.log("Form has been reset");
            analytics.track("Form Reset");
        },

        // Track individual field changes
        onFieldChange: (fieldName, value, allValues) => {
            console.log(`Field ${fieldName} changed to:`, value);

            // Special handling for specific fields
            if (fieldName === "email") {
                validateEmailFormat(value);
            }
        },
    },
};
```

### Auto-save Feature

Auto-save prevents data loss by periodically saving form data.

```tsx
// In schema definition
const formSchema = {
    // ...field definitions
    autoSave: {
        enabled: true,
        interval: 5000, // Save every 5 seconds
        key: "user-registration", // Storage key
    },
};

// In component
const MyForm = () => {
    const handleAutoSave = values => {
        // Save to localStorage
        localStorage.setItem("form-draft", JSON.stringify(values));

        // Or send to server
        api.saveDraft(values)
            .then(() => console.log("Draft saved"))
            .catch(err => console.error("Failed to save draft", err));
    };

    return <AppForm schema={formSchema} autoSave={true} onAutoSave={handleAutoSave} />;
};
```

### Field Extra Buttons

Add action buttons to individual fields for common operations.

```tsx
{
  name: "profileImage",
  type: FIELD_TYPES.UPLOAD,
  label: "Profile Image",
  extras: [
    {
      type: BUTTON_TYPES.PREVIEW,
      label: "Preview",
      tooltip: "View full size image",
      callback: (fieldName, form) => {
        const fileList = form.getFieldValue(fieldName);
        if (fileList?.length > 0) {
          const imageUrl = fileList[0].url || fileList[0].thumbUrl;
          // Show image in modal
          Modal.info({
            title: 'Profile Image',
            content: <img src={imageUrl} style={{ maxWidth: '100%' }} />,
            width: 800
          });
        }
      },
      // Only show if there's an image
      visible: (values) => values.profileImage?.length > 0
    },
    {
      type: BUTTON_TYPES.CLEAR,
      label: "Remove",
      tooltip: "Remove image",
      danger: true,
      confirm: {
        title: "Remove Image",
        description: "Are you sure you want to remove this image?"
      },
      callback: (fieldName, form) => {
        form.setFieldValue(fieldName, []);
      },
      // Only show if there's an image
      visible: (values) => values.profileImage?.length > 0
    }
  ]
}
```

### Custom Field Components

When built-in field types aren't enough, you can create custom components.

```tsx
// Custom color picker component
const ColorPickerField = ({ value, onChange, ...props }) => {
  return (
    <div>
      <div
        style={{
          width: 20,
          height: 20,
          background: value || '#ffffff',
          border: '1px solid #d9d9d9',
          display: 'inline-block',
          marginRight: 8
        }}
      />
      <input
        type="color"
        value={value || '#ffffff'}
        onChange={e => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
};

// In field definition
{
  name: "brandColor",
  type: FIELD_TYPES.CUSTOM,
  label: "Brand Color",
  customComponent: ColorPickerField
}
```

### Form with Plugins

Plugins extend form functionality in a reusable way.

```tsx
// Analytics plugin - tracks form events
const analyticsPlugin = (form, schema) => {
    // Track form initialization
    analytics.track("Form Viewed", { formId: schema.meta?.title || "unknown" });

    // Track form submission
    const originalFinish = form.submit;
    form.submit = () => {
        analytics.track("Form Submitted", { formId: schema.meta?.title || "unknown" });
        return originalFinish.call(form);
    };
};

// Auto-complete plugin - adds address auto-complete to address fields
const addressAutoCompletePlugin = (form, schema) => {
    // Find address fields
    const addressFields = getAllFields(schema).filter(
        f => f.name.toLowerCase().includes("address") || f.name.toLowerCase().includes("street"),
    );

    // Add auto-complete to each address field
    addressFields.forEach(field => {
        const originalRender = field.render;
        field.render = control => {
            return (
                <AddressAutoComplete onSelect={address => form.setFieldValue(field.name, address)}>
                    {originalRender ? originalRender(control) : control}
                </AddressAutoComplete>
            );
        };
    });
};

// Usage
function PluginForm() {
    return <AppForm schema={schema} plugins={[analyticsPlugin, addressAutoCompletePlugin]} />;
}
```

### Form with Middleware

Middleware transforms form values before submission or after changes.

```tsx
// Trim all string values
const trimMiddleware = values => {
    const trimmed = {};
    Object.keys(values).forEach(key => {
        trimmed[key] = typeof values[key] === "string" ? values[key].trim() : values[key];
    });
    return trimmed;
};

// Convert dates to ISO strings
const dateMiddleware = values => {
    const processed = { ...values };

    // Find all date fields and convert to ISO strings
    Object.keys(processed).forEach(key => {
        if (processed[key] instanceof Date) {
            processed[key] = processed[key].toISOString();
        }
    });

    return processed;
};

// Usage
function MiddlewareForm() {
    return <AppForm schema={schema} middleware={[trimMiddleware, dateMiddleware]} />;
}
```

## Performance Optimization

### Best Practices

1. **Use External Form Instance**

    ```tsx
    function OptimizedForm() {
        const [form] = Form.useForm();
        return <AppForm form={form} schema={schema} />;
    }
    ```

2. **Memoize Schema**

    ```tsx
    function OptimizedForm() {
        // Only recreate schema when dependencies change
        const schema = useMemo(
            () => ({
                // schema definition
            }),
            [someDependency],
        );

        return <AppForm schema={schema} />;
    }
    ```

3. **Lazy Load Options**

    ```tsx
    {
      name: "product",
      type: FIELD_TYPES.SELECT,
      label: "Product",
      props: {
        showSearch: true,
        filterOption: false,
        onSearch: debounce(async (value) => {
          if (value.length < 2) return;
          const products = await fetchProducts(value);
          setFieldState('product', { options: products });
        }, 500)
      }
    }
    ```

4. **Use Debounce for Expensive Operations**

    ```tsx
    {
      name: "query",
      type: FIELD_TYPES.INPUT_SEARCH,
      label: "Search",
      debounce: 500,  // Only process changes after 500ms of inactivity
      dependencies: [
        {
          type: DEPENDENCY_TYPES.CUSTOM,
          conditions: [{ field: "query", operator: OPERATORS.IS_NOT_EMPTY }],
          callback: async (form, values) => {
            // This won't run on every keystroke due to debounce
            const results = await searchApi(values.query);
            setSearchResults(results);
          }
        }
      ]
    }
    ```

## Examples of Complete Forms

## Basic Usage

```tsx
import AppForm from "./AppForm";
import { FormSchema } from "./form.type";

const schema: FormSchema = {
    layout: "vertical",
    fields: [
        {
            name: "username",
            type: "input",
            label: "Username",
            required: true,
            placeholder: "Enter username",
        },
    ],
};

function MyComponent() {
    const handleSubmit = (values: any) => {
        console.log("Form values:", values);
    };

    return <AppForm schema={schema} onFinish={handleSubmit} />;
}
```

# Example Type Of FORM

### 1. Basic Form (Fields Only)

```tsx
const basicFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    fields: [
        {
            name: "name",
            type: "input",
            label: "Full Name",
            required: true,
            grid: { xs: 24, md: 12 },
        },
        {
            name: "email",
            type: "input",
            label: "Email",
            required: true,
            grid: { xs: 24, md: 12 },
            rules: [{ type: "email", message: "Invalid email" }],
        },
        {
            name: "age",
            type: "input_number",
            label: "Age",
            grid: { xs: 24, md: 8 },
            props: { min: 0, max: 120 },
        },
        {
            name: "country",
            type: "select",
            label: "Country",
            grid: { xs: 24, md: 16 },
            options: [
                { label: "USA", value: "usa" },
                { label: "Canada", value: "canada" },
                { label: "UK", value: "uk" },
            ],
        },
    ],
};
```

### 2. Sectioned Form (Collapsible Sections)

```tsx
const sectionedFormSchema: FormSchema = {
    layout: "vertical",
    sections: [
        {
            title: "Personal Information",
            description: "Enter your personal details",
            fields: [
                {
                    name: "firstName",
                    type: "input",
                    label: "First Name",
                    required: true,
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "lastName",
                    type: "input",
                    label: "Last Name",
                    required: true,
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "birthDate",
                    type: "date_picker",
                    label: "Birth Date",
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "gender",
                    type: "segmented",
                    label: "Gender",
                    grid: { xs: 24, md: 12 },
                    options: [
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                        { label: "Other", value: "other" },
                    ],
                },
            ],
        },
        {
            title: "Contact Information",
            fields: [
                {
                    name: "email",
                    type: "input",
                    label: "Email",
                    required: true,
                    grid: { xs: 24, md: 12 },
                    rules: [{ type: "email" }],
                },
                {
                    name: "phone",
                    type: "input",
                    label: "Phone",
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "address",
                    type: "input.text_area",
                    label: "Address",
                    grid: { xs: 24 },
                    props: { rows: 3 },
                },
            ],
        },
        {
            title: "Preferences",
            fields: [
                {
                    name: "newsletter",
                    type: "switch",
                    label: "Subscribe to Newsletter",
                    grid: { xs: 24 },
                },
                {
                    name: "notifications",
                    type: "checkbox_group",
                    label: "Notification Preferences",
                    grid: { xs: 24 },
                    options: [
                        { label: "Email", value: "email" },
                        { label: "SMS", value: "sms" },
                        { label: "Push", value: "push" },
                    ],
                },
            ],
        },
    ],
};
```

### 3. Step Form (Multi-Step Wizard)

```tsx
const stepFormSchema: FormSchema = {
    layout: "vertical",
    steps: [
        {
            title: "Account Setup",
            description: "Create your account",
            fields: [
                {
                    name: "username",
                    type: "input",
                    label: "Username",
                    required: true,
                    grid: { xs: 24 },
                },
                {
                    name: "password",
                    type: "input.password",
                    label: "Password",
                    required: true,
                    grid: { xs: 24 },
                },
                {
                    name: "confirmPassword",
                    type: "input.password",
                    label: "Confirm Password",
                    required: true,
                    grid: { xs: 24 },
                    rules: [
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Passwords do not match"));
                            },
                        }),
                    ],
                },
            ],
            validation: async () => {
                // Custom step validation
                return true;
            },
        },
        {
            title: "Personal Details",
            description: "Tell us about yourself",
            fields: [
                {
                    name: "fullName",
                    type: "input",
                    label: "Full Name",
                    required: true,
                    grid: { xs: 24 },
                },
                {
                    name: "email",
                    type: "input",
                    label: "Email",
                    required: true,
                    grid: { xs: 24 },
                    rules: [{ type: "email" }],
                },
                {
                    name: "phone",
                    type: "input",
                    label: "Phone Number",
                    grid: { xs: 24 },
                },
            ],
        },
        {
            title: "Preferences",
            description: "Customize your experience",
            fields: [
                {
                    name: "theme",
                    type: "radio.group",
                    label: "Preferred Theme",
                    grid: { xs: 24 },
                    options: [
                        { label: "Light", value: "light" },
                        { label: "Dark", value: "dark" },
                        { label: "System", value: "system" },
                    ],
                },
                {
                    name: "language",
                    type: "select",
                    label: "Language",
                    grid: { xs: 24 },
                    options: [
                        { label: "English", value: "en" },
                        { label: "Spanish", value: "es" },
                        { label: "French", value: "fr" },
                    ],
                },
            ],
        },
        {
            title: "Confirmation",
            description: "Review and complete",
            fields: [
                {
                    name: "terms",
                    type: "checkbox_group",
                    label: "Agreements",
                    required: true,
                    grid: { xs: 24 },
                    options: [
                        { label: "I agree to the Terms of Service", value: "terms" },
                        { label: "I agree to the Privacy Policy", value: "privacy" },
                    ],
                },
                {
                    name: "marketing",
                    type: "switch",
                    label: "Receive marketing emails",
                    grid: { xs: 24 },
                },
            ],
        },
    ],
};
```

### 4. Tabbed Form

```tsx
const tabbedFormSchema: FormSchema = {
    layout: "vertical",
    tabs: [
        {
            key: "personal",
            tab: "Personal Info",
            icon: React.createElement("UserOutlined"),
            fields: [
                {
                    name: "firstName",
                    type: "input",
                    label: "First Name",
                    required: true,
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "lastName",
                    type: "input",
                    label: "Last Name",
                    required: true,
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "bio",
                    type: "input.text_area",
                    label: "Biography",
                    grid: { xs: 24 },
                    props: { rows: 4 },
                },
                {
                    name: "avatar",
                    type: "upload",
                    label: "Profile Picture",
                    grid: { xs: 24 },
                    props: {
                        accept: "image/*",
                        maxCount: 1,
                        listType: "picture-card",
                    },
                },
            ],
        },
        {
            key: "professional",
            tab: "Professional",
            icon: React.createElement("BriefcaseOutlined"),
            fields: [
                {
                    name: "company",
                    type: "input",
                    label: "Company",
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "position",
                    type: "input",
                    label: "Position",
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "experience",
                    type: "input_number",
                    label: "Years of Experience",
                    grid: { xs: 24, md: 12 },
                    props: { min: 0, max: 50 },
                },
                {
                    name: "salary",
                    type: "input_number",
                    label: "Expected Salary",
                    grid: { xs: 24, md: 12 },
                    props: {
                        formatter: value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        parser: value => value.replace(/\$\s?|(,*)/g, ""),
                    },
                },
                {
                    name: "skills",
                    type: "select",
                    label: "Skills",
                    grid: { xs: 24 },
                    props: { mode: "tags" },
                    options: [
                        { label: "React", value: "react" },
                        { label: "Vue", value: "vue" },
                        { label: "Angular", value: "angular" },
                        { label: "Node.js", value: "nodejs" },
                    ],
                },
                {
                    name: "resume",
                    type: "upload.dragger",
                    label: "Resume",
                    grid: { xs: 24 },
                    props: {
                        accept: ".pdf,.doc,.docx",
                        maxCount: 1,
                    },
                },
            ],
        },
        {
            key: "contact",
            tab: "Contact",
            icon: React.createElement("ContactsOutlined"),
            fields: [
                {
                    name: "email",
                    type: "input",
                    label: "Email",
                    required: true,
                    grid: { xs: 24, md: 12 },
                    rules: [{ type: "email" }],
                },
                {
                    name: "phone",
                    type: "input",
                    label: "Phone",
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "website",
                    type: "input",
                    label: "Website",
                    grid: { xs: 24, md: 12 },
                    rules: [{ type: "url", message: "Please enter a valid URL" }],
                },
                {
                    name: "linkedin",
                    type: "input",
                    label: "LinkedIn Profile",
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "address",
                    type: "input.text_area",
                    label: "Address",
                    grid: { xs: 24 },
                    props: { rows: 3 },
                },
            ],
        },
    ],
};
```

## Advanced Features

### 1. Dynamic Form Lists

```tsx
const dynamicListSchema: FormSchema = {
    layout: "vertical",
    fields: [
        {
            name: "contacts",
            type: "form.list",
            label: "Contact Information",
            grid: { xs: 24 },
            formList: {
                min: 1,
                max: 5,
                addText: "Add Contact",
                allowReorder: true,
                allowDuplicate: true,
                template: [
                    {
                        name: "type",
                        type: "select",
                        label: "Contact Type",
                        required: true,
                        grid: { xs: 24, md: 8 },
                        options: [
                            { label: "Email", value: "email" },
                            { label: "Phone", value: "phone" },
                            { label: "Address", value: "address" },
                            { label: "Social Media", value: "social" },
                        ],
                    },
                    {
                        name: "value",
                        type: "input",
                        label: "Contact Value",
                        required: true,
                        grid: { xs: 24, md: 12 },
                    },
                    {
                        name: "primary",
                        type: "switch",
                        label: "Primary",
                        grid: { xs: 24, md: 4 },
                    },
                ],
            },
        },
        {
            name: "workExperience",
            type: "form.list",
            label: "Work Experience",
            grid: { xs: 24 },
            formList: {
                min: 0,
                max: 10,
                addText: "Add Work Experience",
                template: [
                    {
                        name: "company",
                        type: "input",
                        label: "Company",
                        required: true,
                        grid: { xs: 24, md: 12 },
                    },
                    {
                        name: "position",
                        type: "input",
                        label: "Position",
                        required: true,
                        grid: { xs: 24, md: 12 },
                    },
                    {
                        name: "startDate",
                        type: "date_picker",
                        label: "Start Date",
                        required: true,
                        grid: { xs: 24, md: 6 },
                    },
                    {
                        name: "endDate",
                        type: "date_picker",
                        label: "End Date",
                        grid: { xs: 24, md: 6 },
                    },
                    {
                        name: "current",
                        type: "switch",
                        label: "Current Job",
                        grid: { xs: 24, md: 12 },
                    },
                    {
                        name: "description",
                        type: "input.text_area",
                        label: "Job Description",
                        grid: { xs: 24 },
                        props: { rows: 3 },
                    },
                ],
            },
        },
    ],
};
```

### 2. Conditional Logic

```tsx
const conditionalSchema: FormSchema = {
    layout: "vertical",
    fields: [
        {
            name: "userType",
            type: "radio.group",
            label: "User Type",
            required: true,
            grid: { xs: 24 },
            options: [
                { label: "Individual", value: "individual" },
                { label: "Business", value: "business" },
                { label: "Organization", value: "organization" },
            ],
        },
        // Individual fields
        {
            name: "firstName",
            type: "input",
            label: "First Name",
            grid: { xs: 24, md: 12 },
            dependencies: [
                {
                    type: "show_if",
                    conditions: [{ field: "userType", operator: "equals", value: "individual" }],
                },
                {
                    type: "required_if",
                    conditions: [{ field: "userType", operator: "equals", value: "individual" }],
                },
            ],
        },
        {
            name: "lastName",
            type: "input",
            label: "Last Name",
            grid: { xs: 24, md: 12 },
            dependencies: [
                {
                    type: "show_if",
                    conditions: [{ field: "userType", operator: "equals", value: "individual" }],
                },
                {
                    type: "required_if",
                    conditions: [{ field: "userType", operator: "equals", value: "individual" }],
                },
            ],
        },
        // Business fields
        {
            name: "companyName",
            type: "input",
            label: "Company Name",
            grid: { xs: 24, md: 12 },
            dependencies: [
                {
                    type: "show_if",
                    conditions: [{ field: "userType", operator: "equals", value: "business" }],
                },
                {
                    type: "required_if",
                    conditions: [{ field: "userType", operator: "equals", value: "business" }],
                },
            ],
        },
        {
            name: "taxId",
            type: "input",
            label: "Tax ID",
            grid: { xs: 24, md: 12 },
            dependencies: [
                {
                    type: "show_if",
                    conditions: [{ field: "userType", operator: "equals", value: "business" }],
                },
            ],
        },
        {
            name: "hasEmployees",
            type: "switch",
            label: "Has Employees",
            grid: { xs: 24 },
            dependencies: [
                {
                    type: "show_if",
                    conditions: [{ field: "userType", operator: "equals", value: "business" }],
                },
            ],
        },
        {
            name: "employeeCount",
            type: "input_number",
            label: "Number of Employees",
            grid: { xs: 24 },
            props: { min: 1, max: 10000 },
            dependencies: [
                {
                    type: "show_if",
                    conditions: [
                        { field: "userType", operator: "equals", value: "business" },
                        { field: "hasEmployees", operator: "equals", value: true },
                    ],
                    logic: "AND",
                },
                {
                    type: "required_if",
                    conditions: [
                        { field: "userType", operator: "equals", value: "business" },
                        { field: "hasEmployees", operator: "equals", value: true },
                    ],
                    logic: "AND",
                },
            ],
        },
        // Organization fields
        {
            name: "organizationName",
            type: "input",
            label: "Organization Name",
            grid: { xs: 24 },
            dependencies: [
                {
                    type: "show_if",
                    conditions: [{ field: "userType", operator: "equals", value: "organization" }],
                },
                {
                    type: "required_if",
                    conditions: [{ field: "userType", operator: "equals", value: "organization" }],
                },
            ],
        },
        {
            name: "organizationType",
            type: "select",
            label: "Organization Type",
            grid: { xs: 24 },
            options: [
                { label: "Non-profit", value: "nonprofit" },
                { label: "Government", value: "government" },
                { label: "Educational", value: "educational" },
                { label: "Healthcare", value: "healthcare" },
            ],
            dependencies: [
                {
                    type: "show_if",
                    conditions: [{ field: "userType", operator: "equals", value: "organization" }],
                },
            ],
        },
        // Common fields
        {
            name: "email",
            type: "input",
            label: "Email Address",
            required: true,
            grid: { xs: 24, md: 12 },
            rules: [{ type: "email" }],
        },
        {
            name: "phone",
            type: "input",
            label: "Phone Number",
            grid: { xs: 24, md: 12 },
        },
        // Conditional discount field
        {
            name: "discountEligible",
            type: "switch",
            label: "Eligible for Discount",
            grid: { xs: 24 },
            dependencies: [
                {
                    type: "show_if",
                    conditions: [{ field: "userType", operator: "in", values: ["organization", "business"] }],
                },
            ],
        },
        {
            name: "discountCode",
            type: "input",
            label: "Discount Code",
            grid: { xs: 24 },
            dependencies: [
                {
                    type: "show_if",
                    conditions: [
                        { field: "userType", operator: "in", values: ["organization", "business"] },
                        { field: "discountEligible", operator: "equals", value: true },
                    ],
                    logic: "AND",
                },
            ],
        },
    ],
};
```

### 3. Field Extras (Action Buttons)

```tsx
const fieldExtrasSchema: FormSchema = {
    layout: "vertical",
    fields: [
        {
            name: "email",
            type: "input",
            label: "Email Address",
            required: true,
            grid: { xs: 24 },
            extras: [
                {
                    type: "custom",
                    label: "Verify",
                    icon: React.createElement("CheckOutlined"),
                    callback: async (fieldName, form) => {
                        const email = form.getFieldValue(fieldName);
                        if (email) {
                            // Simulate verification
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            alert(`Email ${email} verified successfully!`);
                        }
                    },
                    tooltip: "Click to verify email address",
                },
            ],
        },
        {
            name: "password",
            type: "input.password",
            label: "Password",
            required: true,
            grid: { xs: 24 },
            extras: [
                {
                    type: "custom",
                    label: "Generate",
                    icon: React.createElement("KeyOutlined"),
                    callback: (fieldName, form) => {
                        const randomPassword = Math.random().toString(36).slice(-8);
                        form.setFieldValue(fieldName, randomPassword);
                    },
                    tooltip: "Generate random password",
                },
            ],
        },
        {
            name: "profileImage",
            type: FIELD_TYPES.UPLOAD,
            label: "Profile Image",
            extras: [
                {
                    type: BUTTON_TYPES.PREVIEW,
                    label: "Preview",
                    tooltip: "View full size image",
                    callback: (fieldName, form) => {
                        const fileList = form.getFieldValue(fieldName);
                        if (fileList?.length > 0) {
                            const imageUrl = fileList[0].url || fileList[0].thumbUrl;
                            // Show image in modal
                            Modal.info({
                                title: "Profile Image",
                                content: <img src={imageUrl} style={{ maxWidth: "100%" }} />,
                                width: 800,
                            });
                        }
                    },
                    // Only show if there's an image
                    visible: values => values.profileImage?.length > 0,
                },
                {
                    type: BUTTON_TYPES.CLEAR,
                    label: "Remove",
                    tooltip: "Remove image",
                    danger: true,
                    confirm: {
                        title: "Remove Image",
                        description: "Are you sure you want to remove this image?",
                    },
                    callback: (fieldName, form) => {
                        form.setFieldValue(fieldName, []);
                    },
                    // Only show if there's an image
                    visible: values => values.profileImage?.length > 0,
                },
            ],
        },
        {
            name: "notes",
            type: "input.text_area",
            label: "Notes",
            grid: { xs: 24 },
            props: { rows: 4 },
            extras: [
                {
                    type: "copy",
                    callback: (fieldName, form) => {
                        const notes = form.getFieldValue(fieldName);
                        if (notes) {
                            // Copy to clipboard
                            navigator.clipboard
                                .writeText(notes)
                                .then(() => {
                                    alert("Notes copied to clipboard!");
                                })
                                .catch(err => {
                                    console.error("Failed to copy text: ", err);
                                });
                        }
                    },
                    tooltip: "Copy notes to clipboard",
                    visible: values => !!values.notes,
                },
                {
                    type: "clear",
                    label: "Clear",
                    callback: (fieldName, form) => {
                        form.setFieldValue(fieldName, "");
                    },
                    confirm: {
                        title: "Clear notes?",
                        description: "Are you sure you want to clear all notes?",
                    },
                    visible: values => !!values.notes,
                },
            ],
        },
        {
            name: "document",
            type: "upload",
            label: "Document",
            grid: { xs: 24 },
            props: {
                accept: ".pdf,.doc,.docx",
                maxCount: 3,
            },
            extras: [
                {
                    type: "download",
                    label: "Download All",
                    icon: React.createElement("DownloadOutlined"),
                    callback: (fieldName, form) => {
                        const files = form.getFieldValue(fieldName);
                        if (files && files.length > 0) {
                            // In a real implementation, you would process each file
                            files.forEach(file => {
                                console.log("Download file:", file.name);
                                // window.open(file.url, '_blank');
                            });
                            alert(`Downloading ${files.length} document(s)`);
                        }
                    },
                    visible: values => values.document?.length > 0,
                },
                {
                    type: "custom",
                    label: "Scan",
                    icon: React.createElement("SafetyOutlined"),
                    callback: (fieldName, form) => {
                        const files = form.getFieldValue(fieldName);
                        if (files && files.length > 0) {
                            // Simulate virus scan
                            setTimeout(() => {
                                alert("All documents scanned successfully. No issues found.");
                            }, 1500);
                        }
                    },
                    visible: values => values.document?.length > 0,
                    tooltip: "Scan documents for viruses",
                },
            ],
        },
        {
            name: "address",
            type: "input.text_area",
            label: "Address",
            grid: { xs: 24 },
            extras: [
                {
                    type: "custom",
                    label: "Format",
                    callback: (fieldName, form) => {
                        const address = form.getFieldValue(fieldName);
                        if (address) {
                            // Simple formatting example - capitalize words and ensure periods
                            const formatted = address
                                .split("\n")
                                .map(line => line.trim())
                                .filter(line => line)
                                .map(line => {
                                    return line.replace(/\b\w/g, l => l.toUpperCase());
                                })
                                .join("\n");

                            form.setFieldValue(fieldName, formatted);
                        }
                    },
                    tooltip: "Format address text",
                },
                {
                    type: "custom",
                    label: "Verify",
                    callback: async (fieldName, form) => {
                        const address = form.getFieldValue(fieldName);
                        if (address) {
                            // Simulate address verification
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            form.setFieldValue(fieldName, address + "\n(Verified)");
                        }
                    },
                },
            ],
        },
    ],
};
```

### 4. Calculation Fields

```tsx
const calculationSchema: FormSchema = {
    layout: "vertical",
    fields: [
        {
            name: "quantity",
            type: "input_number",
            label: "Quantity",
            required: true,
            grid: { xs: 24, md: 8 },
            props: { min: 1 },
        },
        {
            name: "unitPrice",
            type: "input_number",
            label: "Unit Price ($)",
            required: true,
            grid: { xs: 24, md: 8 },
            props: { min: 0, step: 0.01, precision: 2 },
        },
        {
            name: "discount",
            type: "input_number",
            label: "Discount (%)",
            grid: { xs: 24, md: 8 },
            props: { min: 0, max: 100, precision: 2 },
        },
        {
            name: "subtotal",
            type: "input_number",
            label: "Subtotal ($)",
            grid: { xs: 24, md: 12 },
            props: { disabled: true, precision: 2 },
            dependencies: [
                {
                    type: "calculate",
                    conditions: [
                        { field: "quantity", operator: "is_not_empty" },
                        { field: "unitPrice", operator: "is_not_empty" },
                    ],
                    callback: (form, values) => {
                        const quantity = Number(values.quantity) || 0;
                        const unitPrice = Number(values.unitPrice) || 0;
                        return (quantity * unitPrice).toFixed(2);
                    },
                },
            ],
        },
        {
            name: "total",
            type: "input_number",
            label: "Total Price ($)",
            grid: { xs: 24, md: 12 },
            props: { disabled: true, precision: 2 },
            dependencies: [
                {
                    type: "calculate",
                    conditions: [{ field: "subtotal", operator: "is_not_empty" }],
                    callback: (form, values) => {
                        const subtotal = Number(values.subtotal) || 0;
                        const discount = Number(values.discount) || 0;
                        const discountAmount = subtotal * (discount / 100);
                        return (subtotal - discountAmount).toFixed(2);
                    },
                },
            ],
        },
    ],
};
```

### 5. Dynamic Options

```tsx
const dynamicOptionsSchema: FormSchema = {
    layout: "vertical",
    fields: [
        {
            name: "region",
            type: "select",
            label: "Region",
            required: true,
            grid: { xs: 24 },
            options: [
                { label: "North America", value: "na" },
                { label: "Europe", value: "eu" },
                { label: "Asia Pacific", value: "apac" },
            ],
        },
        {
            name: "country",
            type: "select",
            label: "Country",
            required: true,
            grid: { xs: 24, md: 12 },
            dependencies: [
                {
                    type: "set_options",
                    conditions: [{ field: "region", operator: "equals", value: "na" }],
                    target: [
                        { label: "United States", value: "us" },
                        { label: "Canada", value: "ca" },
                        { label: "Mexico", value: "mx" },
                    ],
                },
                {
                    type: "set_options",
                    conditions: [{ field: "region", operator: "equals", value: "eu" }],
                    target: [
                        { label: "United Kingdom", value: "uk" },
                        { label: "France", value: "fr" },
                        { label: "Germany", value: "de" },
                        { label: "Spain", value: "es" },
                    ],
                },
                {
                    type: "set_options",
                    conditions: [{ field: "region", operator: "equals", value: "apac" }],
                    target: [
                        { label: "Japan", value: "jp" },
                        { label: "China", value: "cn" },
                        { label: "Australia", value: "au" },
                        { label: "India", value: "in" },
                    ],
                },
            ],
        },
        {
            name: "state",
            type: "select",
            label: "State/Province",
            grid: { xs: 24, md: 12 },
            dependencies: [
                {
                    type: "show_if",
                    conditions: [{ field: "country", operator: "in", values: ["us", "ca", "au", "in"] }],
                },
                {
                    type: "set_options",
                    conditions: [{ field: "country", operator: "equals", value: "us" }],
                    target: [
                        { label: "California", value: "ca" },
                        { label: "New York", value: "ny" },
                        { label: "Texas", value: "tx" },
                    ],
                },
                {
                    type: "set_options",
                    conditions: [{ field: "country", operator: "equals", value: "ca" }],
                    target: [
                        { label: "Ontario", value: "on" },
                        { label: "Quebec", value: "qc" },
                        { label: "British Columbia", value: "bc" },
                    ],
                },
            ],
        },
    ],
};
```
