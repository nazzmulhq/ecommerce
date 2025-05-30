import { EditOutlined, EyeOutlined, ShopOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { UploadFile } from "antd/lib";
import dayjs from "dayjs";
import { BUTTON_TYPES, DEPENDENCY_TYPES, FIELD_TYPES, FormSchema, OPERATORS } from "./form.type";

// 1. Basic Contact Form
export const basicFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    fields: [
        {
            name: "firstName",
            type: FIELD_TYPES.INPUT,
            label: "First Name",
            placeholder: "Enter your first name",
            required: true,
            grid: { xs: 24, md: 12 },
            tooltip: "Enter your legal first name",
        },
        {
            name: "lastName",
            type: FIELD_TYPES.INPUT,
            label: "Last Name",
            placeholder: "Enter your last name",
            required: true,
            grid: { xs: 24, md: 12 },
        },
        {
            name: "email",
            type: FIELD_TYPES.INPUT,
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
            grid: { xs: 24, md: 12 },
            rules: [{ type: "email", message: "Please enter a valid email" }],
            extras: [
                {
                    type: BUTTON_TYPES.CUSTOM,
                    label: "Verify",
                    icon: <EyeOutlined />,
                    callback: (fieldName, form) => {
                        const email = form.getFieldValue(fieldName);
                        alert(`Verifying email: ${email}`);
                    },
                },
            ],
        },
        {
            name: "phone",
            type: FIELD_TYPES.INPUT,
            label: "Phone Number",
            placeholder: "Enter your phone number",
            grid: { xs: 24, md: 12 },
        },
        {
            name: "age",
            type: FIELD_TYPES.INPUT_NUMBER,
            label: "Age",
            grid: { xs: 24, md: 8 },
            props: { min: 18, max: 120 },
        },
        {
            name: "country",
            type: FIELD_TYPES.SELECT,
            label: "Country",
            grid: { xs: 24, md: 16 },
            options: [
                { label: "United States", value: "usa" },
                { label: "Canada", value: "canada" },
                { label: "United Kingdom", value: "uk" },
                { label: "Australia", value: "australia" },
                { label: "Germany", value: "germany" },
            ],
        },
        {
            name: "bio",
            type: FIELD_TYPES.INPUT_TEXT_AREA,
            label: "Biography",
            placeholder: "Tell us about yourself",
            grid: { xs: 24 },
            props: { rows: 4, maxLength: 500, showCount: true },
        },
    ],
};

// 2. Advanced User Registration Form with Sections
export const advancedFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    autoSave: {
        enabled: true,
        interval: 3000,
    },
    validation: {
        validateOnChange: true,
        scrollToError: true,
    },
    sections: [
        {
            title: "Personal Information",
            description: "Basic personal details",
            icon: <UserOutlined />,
            fields: [
                {
                    name: "fullName",
                    type: FIELD_TYPES.INPUT,
                    label: "Full Name",
                    required: true,
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "dateOfBirth",
                    type: FIELD_TYPES.DATE_PICKER,
                    label: "Date of Birth",
                    required: true,
                    grid: { xs: 24, md: 12 },
                    props: {
                        format: "YYYY-MM-DD",
                        placeholder: "Select date",
                    },
                },
                {
                    name: "gender",
                    type: FIELD_TYPES.SEGMENTED,
                    label: "Gender",
                    grid: { xs: 24, md: 12 },
                    options: [
                        { label: "Male", value: "male" },
                        { label: "Female", value: "female" },
                        { label: "Other", value: "other" },
                        { label: "Prefer not to say", value: "not_specified" },
                    ],
                },
                {
                    name: "maritalStatus",
                    type: FIELD_TYPES.RADIO_GROUP,
                    label: "Marital Status",
                    grid: { xs: 24, md: 12 },
                    options: [
                        { label: "Single", value: "single" },
                        { label: "Married", value: "married" },
                        { label: "Divorced", value: "divorced" },
                        { label: "Widowed", value: "widowed" },
                    ],
                },
            ],
        },
        {
            title: "Contact Information",
            description: "How we can reach you",
            fields: [
                {
                    name: "contacts",
                    type: FIELD_TYPES.FORM_LIST,
                    label: "Contact Methods",
                    grid: { xs: 24 },
                    formList: {
                        min: 1,
                        max: 5,
                        addText: "Add Another Contact",
                        allowReorder: true,
                        allowDuplicate: false,
                        template: [
                            {
                                name: "type",
                                type: FIELD_TYPES.SELECT,
                                label: "Contact Type",
                                required: true,
                                options: [
                                    { label: "Email", value: "email" },
                                    { label: "Phone", value: "phone" },
                                    { label: "Address", value: "address" },
                                    { label: "LinkedIn", value: "linkedin" },
                                ],
                                grid: { xs: 24, md: 8 },
                            },
                            {
                                name: "value",
                                type: FIELD_TYPES.INPUT,
                                label: "Contact Value",
                                required: true,
                                placeholder: "Enter contact information",
                                grid: { xs: 24, md: 12 },
                            },
                            {
                                name: "isPrimary",
                                type: FIELD_TYPES.SWITCH,
                                label: "Primary Contact",
                                grid: { xs: 24, md: 4 },
                            },
                        ],
                    },
                },
            ],
        },
        {
            title: "Preferences",
            description: "Customize your experience",
            fields: [
                {
                    name: "notifications",
                    type: FIELD_TYPES.CHECKBOX_GROUP,
                    label: "Notification Preferences",
                    grid: { xs: 24 },
                    options: [
                        { label: "Email Notifications", value: "email" },
                        { label: "SMS Notifications", value: "sms" },
                        { label: "Push Notifications", value: "push" },
                        { label: "Marketing Communications", value: "marketing" },
                    ],
                },
                {
                    name: "theme",
                    type: FIELD_TYPES.SEGMENTED,
                    label: "Theme Preference",
                    grid: { xs: 24, md: 12 },
                    options: [
                        { label: "Light", value: "light" },
                        { label: "Dark", value: "dark" },
                        { label: "Auto", value: "auto" },
                    ],
                },
                {
                    name: "language",
                    type: FIELD_TYPES.SELECT,
                    label: "Preferred Language",
                    grid: { xs: 24, md: 12 },
                    options: [
                        { label: "English", value: "en" },
                        { label: "Spanish", value: "es" },
                        { label: "French", value: "fr" },
                        { label: "German", value: "de" },
                        { label: "Chinese", value: "zh" },
                    ],
                },
            ],
        },
    ],
};

// 3. Multi-Step Form (Wizard)
export const stepFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    ui: {
        showProgress: true,
    },
    steps: [
        {
            title: "Account Setup",
            description: "Create your account",
            icon: <UserOutlined />,
            fields: [
                {
                    name: "username",
                    type: FIELD_TYPES.INPUT,
                    label: "Username",
                    required: true,
                    grid: { xs: 24 },
                    rules: [
                        { min: 3, message: "Username must be at least 3 characters" },
                        {
                            pattern: /^[a-zA-Z0-9_]+$/,
                            message: "Username can only contain letters, numbers, and underscores",
                        },
                    ],
                },
                {
                    name: "email",
                    type: FIELD_TYPES.INPUT,
                    label: "Email Address",
                    required: true,
                    grid: { xs: 24 },
                    rules: [{ type: "email", message: "Please enter a valid email" }],
                },
                {
                    name: "password",
                    type: FIELD_TYPES.INPUT_PASSWORD,
                    label: "Password",
                    required: true,
                    grid: { xs: 24, md: 12 },
                    rules: [{ min: 8, message: "Password must be at least 8 characters" }],
                },
                {
                    name: "confirmPassword",
                    type: FIELD_TYPES.INPUT_PASSWORD,
                    label: "Confirm Password",
                    required: true,
                    grid: { xs: 24, md: 12 },
                    dependencies: [
                        {
                            type: "custom",
                            conditions: [{ field: "password", operator: OPERATORS.IS_NOT_EMPTY, value: "" }],
                            callback: (form, values, fieldName) => {
                                if (values.password !== values.confirmPassword) {
                                    form.setFields([
                                        {
                                            name: fieldName,
                                            errors: ["Passwords do not match"],
                                        },
                                    ]);
                                }
                            },
                        },
                    ],
                },
            ],
            validation: async () => {
                // Custom step validation logic
                return true;
            },
        },
        {
            title: "Profile Information",
            description: "Tell us about yourself",
            fields: [
                {
                    name: "firstName",
                    type: FIELD_TYPES.INPUT,
                    label: "First Name",
                    required: true,
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "lastName",
                    type: FIELD_TYPES.INPUT,
                    label: "Last Name",
                    required: true,
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "avatar",
                    type: FIELD_TYPES.UPLOAD,
                    label: "Profile Picture",
                    grid: { xs: 24 },
                    props: {
                        accept: "image/*",
                        maxCount: 1,
                        listType: "picture-card",
                    },
                },
                {
                    name: "bio",
                    type: FIELD_TYPES.INPUT_TEXT_AREA,
                    label: "About You",
                    placeholder: "Tell us a bit about yourself",
                    grid: { xs: 24 },
                    props: { rows: 4 },
                },
            ],
        },
        {
            title: "Preferences",
            description: "Customize your experience",
            fields: [
                {
                    name: "interests",
                    type: FIELD_TYPES.CHECKBOX_GROUP,
                    label: "Interests",
                    grid: { xs: 24 },
                    options: [
                        { label: "Technology", value: "tech" },
                        { label: "Sports", value: "sports" },
                        { label: "Music", value: "music" },
                        { label: "Travel", value: "travel" },
                        { label: "Food", value: "food" },
                        { label: "Art", value: "art" },
                    ],
                },
                {
                    name: "newsletterFrequency",
                    type: FIELD_TYPES.RADIO_GROUP,
                    label: "Newsletter Frequency",
                    grid: { xs: 24 },
                    options: [
                        { label: "Daily", value: "daily" },
                        { label: "Weekly", value: "weekly" },
                        { label: "Monthly", value: "monthly" },
                        { label: "Never", value: "never" },
                    ],
                },
            ],
        },
        {
            title: "Review & Submit",
            description: "Review your information and submit",
            fields: [
                {
                    name: "terms",
                    type: FIELD_TYPES.CHECKBOX,
                    label: "I agree to the Terms of Service and Privacy Policy",
                    required: true,
                    grid: { xs: 24 },
                },
                {
                    name: "marketing",
                    type: FIELD_TYPES.CHECKBOX,
                    label: "I would like to receive marketing communications",
                    grid: { xs: 24 },
                },
            ],
        },
    ],
};

// 4. Tabbed Form
export const tabFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    tabs: [
        {
            key: "personal",
            tab: "Personal Info",
            icon: <UserOutlined />,
            fields: [
                {
                    name: "personalInfo.name",
                    type: FIELD_TYPES.INPUT,
                    label: "Full Name",
                    required: true,
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "personalInfo.email",
                    type: FIELD_TYPES.INPUT,
                    label: "Email",
                    required: true,
                    grid: { xs: 24, md: 12 },
                    rules: [{ type: "email" }],
                },
                {
                    name: "personalInfo.phone",
                    type: FIELD_TYPES.INPUT,
                    label: "Phone Number",
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "personalInfo.birthDate",
                    type: FIELD_TYPES.DATE_PICKER,
                    label: "Date of Birth",
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "personalInfo.bio",
                    type: FIELD_TYPES.INPUT_TEXT_AREA,
                    label: "Biography",
                    grid: { xs: 24 },
                    props: { rows: 4 },
                },
            ],
        },
        {
            key: "professional",
            tab: "Professional",
            icon: <ShopOutlined />,
            fields: [
                {
                    name: "professional.company",
                    type: FIELD_TYPES.INPUT,
                    label: "Company Name",
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "professional.position",
                    type: FIELD_TYPES.INPUT,
                    label: "Job Title",
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "professional.industry",
                    type: FIELD_TYPES.SELECT,
                    label: "Industry",
                    grid: { xs: 24, md: 12 },
                    options: [
                        { label: "Technology", value: "tech" },
                        { label: "Healthcare", value: "healthcare" },
                        { label: "Finance", value: "finance" },
                        { label: "Education", value: "education" },
                        { label: "Retail", value: "retail" },
                        { label: "Other", value: "other" },
                    ],
                },
                {
                    name: "professional.experience",
                    type: FIELD_TYPES.SLIDER,
                    label: "Years of Experience",
                    grid: { xs: 24, md: 12 },
                    props: { min: 0, max: 50, marks: { 0: "0", 25: "25", 50: "50+" } },
                },
                {
                    name: "professional.skills",
                    type: FIELD_TYPES.SELECT,
                    label: "Skills",
                    grid: { xs: 24 },
                    props: { mode: "multiple", placeholder: "Select your skills" },
                    options: [
                        { label: "JavaScript", value: "js" },
                        { label: "TypeScript", value: "ts" },
                        { label: "React", value: "react" },
                        { label: "Node.js", value: "nodejs" },
                        { label: "Python", value: "python" },
                        { label: "Java", value: "java" },
                        { label: "SQL", value: "sql" },
                        { label: "AWS", value: "aws" },
                    ],
                },
                {
                    name: "professional.resume",
                    type: FIELD_TYPES.UPLOAD,
                    label: "Resume/CV",
                    grid: { xs: 24 },
                    props: {
                        accept: ".pdf,.doc,.docx",
                        maxCount: 1,
                    },
                },
            ],
        },
        {
            key: "documents",
            tab: "Documents",
            icon: <UploadOutlined />,
            fields: [
                {
                    name: "documents.profilePicture",
                    type: FIELD_TYPES.UPLOAD,
                    label: "Profile Picture",
                    grid: { xs: 24, md: 12 },
                    props: {
                        accept: "image/*",
                        maxCount: 1,
                        listType: "picture-card",
                    },
                },
                {
                    name: "documents.idDocument",
                    type: FIELD_TYPES.UPLOAD_DRAGGER,
                    label: "ID Document",
                    grid: { xs: 24, md: 12 },
                    props: {
                        accept: "image/*,.pdf",
                        maxCount: 2,
                    },
                },
                {
                    name: "documents.portfolio",
                    type: FIELD_TYPES.UPLOAD,
                    label: "Portfolio Files",
                    grid: { xs: 24 },
                    props: {
                        multiple: true,
                        maxCount: 10,
                    },
                },
            ],
        },
    ],
};

// 5. Conditional Form with Dynamic Fields
export const conditionalFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    fields: [
        {
            name: "accountType",
            type: FIELD_TYPES.SEGMENTED,
            label: "Account Type",
            required: true,
            grid: { xs: 24 },
            options: [
                { label: "Personal", value: "personal" },
                { label: "Business", value: "business" },
                { label: "Organization", value: "organization" },
            ],
        },

        // Personal Account Fields
        {
            name: "personalName",
            type: FIELD_TYPES.INPUT,
            label: "Full Name",
            grid: { xs: 24, md: 12 },
            dependencies: [
                {
                    type: DEPENDENCY_TYPES.SHOW_IF,
                    conditions: [{ field: "accountType", operator: OPERATORS.EQUALS, value: "personal" }],
                },
                {
                    type: DEPENDENCY_TYPES.REQUIRED_IF,
                    conditions: [{ field: "accountType", operator: OPERATORS.EQUALS, value: "personal" }],
                },
            ],
        },
        {
            name: "personalEmail",
            type: FIELD_TYPES.INPUT,
            label: "Personal Email",
            grid: { xs: 24, md: 12 },
            rules: [{ type: "email" }],
            dependencies: [
                {
                    type: DEPENDENCY_TYPES.SHOW_IF,
                    conditions: [{ field: "accountType", operator: OPERATORS.EQUALS, value: "personal" }],
                },
            ],
        },

        // Business Account Fields
        {
            name: "companyName",
            type: FIELD_TYPES.INPUT,
            label: "Company Name",
            grid: { xs: 24, md: 12 },
            dependencies: [
                {
                    type: DEPENDENCY_TYPES.SHOW_IF,
                    conditions: [{ field: "accountType", operator: OPERATORS.EQUALS, value: "business" }],
                },
                {
                    type: DEPENDENCY_TYPES.REQUIRED_IF,
                    conditions: [{ field: "accountType", operator: OPERATORS.EQUALS, value: "business" }],
                },
            ],
        },
        {
            name: "taxId",
            type: FIELD_TYPES.INPUT,
            label: "Tax ID",
            grid: { xs: 24, md: 12 },
            dependencies: [
                {
                    type: DEPENDENCY_TYPES.SHOW_IF,
                    conditions: [{ field: "accountType", operator: OPERATORS.EQUALS, value: "business" }],
                },
            ],
        },
        {
            name: "hasEmployees",
            type: FIELD_TYPES.SWITCH,
            label: "Has Employees",
            grid: { xs: 24 },
            dependencies: [
                {
                    type: DEPENDENCY_TYPES.SHOW_IF,
                    conditions: [{ field: "accountType", operator: OPERATORS.EQUALS, value: "business" }],
                },
            ],
        },
        {
            name: "employeeCount",
            type: FIELD_TYPES.INPUT_NUMBER,
            label: "Number of Employees",
            grid: { xs: 24, md: 12 },
            props: { min: 1, max: 10000 },
            dependencies: [
                {
                    type: DEPENDENCY_TYPES.SHOW_IF,
                    conditions: [
                        { field: "accountType", operator: OPERATORS.EQUALS, value: "business" },
                        { field: "hasEmployees", operator: OPERATORS.EQUALS, value: true },
                    ],
                    logic: "AND",
                },
                {
                    type: DEPENDENCY_TYPES.REQUIRED_IF,
                    conditions: [
                        { field: "accountType", operator: OPERATORS.EQUALS, value: "business" },
                        { field: "hasEmployees", operator: OPERATORS.EQUALS, value: true },
                    ],
                    logic: "AND",
                },
            ],
        },

        // Organization Account Fields
        {
            name: "organizationName",
            type: FIELD_TYPES.INPUT,
            label: "Organization Name",
            grid: { xs: 24, md: 12 },
            dependencies: [
                {
                    type: DEPENDENCY_TYPES.SHOW_IF,
                    conditions: [{ field: "accountType", operator: OPERATORS.EQUALS, value: "organization" }],
                },
                {
                    type: DEPENDENCY_TYPES.REQUIRED_IF,
                    conditions: [{ field: "accountType", operator: OPERATORS.EQUALS, value: "organization" }],
                },
            ],
        },
        {
            name: "organizationType",
            type: FIELD_TYPES.SELECT,
            label: "Organization Type",
            grid: { xs: 24, md: 12 },
            options: [
                { label: "Non-profit", value: "nonprofit" },
                { label: "Government", value: "government" },
                { label: "Educational", value: "educational" },
                { label: "Religious", value: "religious" },
            ],
            dependencies: [
                {
                    type: DEPENDENCY_TYPES.SHOW_IF,
                    conditions: [{ field: "accountType", operator: OPERATORS.EQUALS, value: "organization" }],
                },
            ],
        },

        // Common Fields
        {
            name: "contactEmail",
            type: FIELD_TYPES.INPUT,
            label: "Contact Email",
            required: true,
            grid: { xs: 24, md: 12 },
            rules: [{ type: "email" }],
        },
        {
            name: "contactPhone",
            type: FIELD_TYPES.INPUT,
            label: "Contact Phone",
            grid: { xs: 24, md: 12 },
        },
        {
            name: "address",
            type: FIELD_TYPES.INPUT_TEXT_AREA,
            label: "Address",
            grid: { xs: 24 },
            props: { rows: 3 },
        },
    ],
};

// 6. Product Form with Advanced Features
export const productFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    fields: [
        {
            name: "name",
            type: FIELD_TYPES.INPUT,
            label: "Product Name",
            required: true,
            grid: { xs: 24, md: 12 },
        },
        {
            name: "sku",
            type: FIELD_TYPES.INPUT,
            label: "SKU",
            required: true,
            grid: { xs: 24, md: 12 },
            extras: [
                {
                    type: BUTTON_TYPES.CUSTOM,
                    label: "Generate",
                    callback: (fieldName, form) => {
                        const randomSku = `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
                        form.setFieldValue(fieldName, randomSku);
                    },
                },
            ],
        },
        {
            name: "category",
            type: FIELD_TYPES.CASCADER,
            label: "Category",
            required: true,
            grid: { xs: 24, md: 8 },
            options: [
                {
                    value: "electronics",
                    label: "Electronics",
                    children: [
                        { value: "phones", label: "Phones" },
                        { value: "laptops", label: "Laptops" },
                        { value: "tablets", label: "Tablets" },
                    ],
                },
                {
                    value: "clothing",
                    label: "Clothing",
                    children: [
                        { value: "men", label: "Men's Clothing" },
                        { value: "women", label: "Women's Clothing" },
                        { value: "kids", label: "Kids' Clothing" },
                    ],
                },
            ],
        },
        {
            name: "price",
            type: FIELD_TYPES.INPUT_NUMBER,
            label: "Price ($)",
            required: true,
            grid: { xs: 24, md: 8 },
            props: { min: 0, step: 0.01, precision: 2 },
        },
        {
            name: "discountPrice",
            type: FIELD_TYPES.INPUT_NUMBER,
            label: "Discount Price ($)",
            grid: { xs: 24, md: 8 },
            props: { min: 0, step: 0.01, precision: 2 },
            dependencies: [
                {
                    type: DEPENDENCY_TYPES.CUSTOM,
                    conditions: [{ field: "price", operator: OPERATORS.IS_NOT_EMPTY, value: "" }],
                    callback: (form, values) => {
                        const price = values.price;
                        const discountPrice = values.discountPrice;
                        if (price && discountPrice && discountPrice >= price) {
                            form.setFields([
                                {
                                    name: "discountPrice",
                                    errors: ["Discount price must be less than regular price"],
                                },
                            ]);
                        }
                    },
                },
            ],
        },
        {
            name: "description",
            type: FIELD_TYPES.INPUT_TEXT_AREA,
            label: "Description",
            required: true,
            grid: { xs: 24 },
            props: { rows: 4, maxLength: 1000, showCount: true },
        },
        {
            name: "features",
            type: FIELD_TYPES.FORM_LIST,
            label: "Product Features",
            grid: { xs: 24 },
            formList: {
                min: 1,
                max: 10,
                addText: "Add Feature",
                template: [
                    {
                        name: "feature",
                        type: FIELD_TYPES.INPUT,
                        label: "Feature",
                        required: true,
                        placeholder: "Enter product feature",
                        grid: { xs: 24 },
                    },
                ],
            },
        },
        {
            name: "inStock",
            type: FIELD_TYPES.SWITCH,
            label: "In Stock",
            grid: { xs: 24, md: 8 },
        },
        {
            name: "quantity",
            type: FIELD_TYPES.INPUT_NUMBER,
            label: "Quantity",
            grid: { xs: 24, md: 8 },
            props: { min: 0 },
            dependencies: [
                {
                    type: DEPENDENCY_TYPES.SHOW_IF,
                    conditions: [{ field: "inStock", operator: OPERATORS.EQUALS, value: true }],
                },
                {
                    type: DEPENDENCY_TYPES.REQUIRED_IF,
                    conditions: [{ field: "inStock", operator: OPERATORS.EQUALS, value: true }],
                },
            ],
        },
        {
            name: "rating",
            type: FIELD_TYPES.RATE,
            label: "Initial Rating",
            grid: { xs: 24, md: 8 },
            props: { allowHalf: true },
        },
        {
            name: "tags",
            type: FIELD_TYPES.SELECT,
            label: "Tags",
            grid: { xs: 24 },
            props: {
                mode: "tags",
                placeholder: "Add tags",
                tokenSeparators: [",", " "],
            },
        },
        {
            name: "images",
            type: FIELD_TYPES.UPLOAD,
            label: "Product Images",
            grid: { xs: 24 },
            props: {
                accept: "image/*",
                multiple: true,
                maxCount: 8,
                listType: "picture-card",
                beforeUpload: (file: RcFile): boolean => {
                    const isImage: boolean = file.type.startsWith("image/");
                    if (!isImage) {
                        alert("You can only upload image files!");
                    }
                    return isImage;
                },
                onRemove: (file: UploadFile): boolean => {
                    const confirmRemove = window.confirm(`Are you sure you want to remove ${file.name}?`);
                    return confirmRemove;
                },
            },
            extras: [
                {
                    type: BUTTON_TYPES.CUSTOM,
                    label: "Upload Sample",
                    icon: <UploadOutlined />,
                    callback: (fieldName, form) => {
                        const sampleFiles = [
                            new File([""], "sample1.jpg", { type: "image/jpeg" }),
                            new File([""], "sample2.jpg", { type: "image/jpeg" }),
                        ];
                        form.setFieldValue(fieldName, sampleFiles);
                        alert("Sample images uploaded successfully!");
                    },
                },
            ],
        },
        {
            name: "status",
            type: FIELD_TYPES.SELECT,
            label: "Product Status",
            grid: { xs: 24, md: 8 },
            options: [
                { label: "Draft", value: "draft" },
                { label: "Active", value: "active" },
                { label: "Archived", value: "archived" },
                { label: "Discontinued", value: "discontinued" },
            ],
            props: {
                placeholder: "Select product status",
                allowClear: true,
            },
        },
        {
            name: "releaseDate",
            type: FIELD_TYPES.DATE_PICKER,
            label: "Release Date",
            grid: { xs: 24, md: 8 },
            props: {
                format: "YYYY-MM-DD",
                placeholder: "Select release date",
                disabledDate: (current: any) => current && current < dayjs().startOf("day"),
            },
        },
        {
            name: "notes",
            type: FIELD_TYPES.INPUT_TEXT_AREA,
            label: "Internal Notes",
            grid: { xs: 24 },
            props: { rows: 3, maxLength: 500, showCount: true },
            extras: [
                {
                    type: BUTTON_TYPES.CUSTOM,
                    label: "Clear Notes",
                    callback: (fieldName, form) => {
                        form.setFieldValue(fieldName, "");
                        alert("Notes cleared successfully!");
                    },
                },
            ],
        },
    ],
};

// 7. Complex Form with Nested Structures
export const complexNestedFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    sections: [
        {
            title: "User Profile",
            icon: <UserOutlined />,
            fields: [
                {
                    name: "user.name",
                    type: FIELD_TYPES.INPUT,
                    label: "Full Name",
                    required: true,
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "user.email",
                    type: FIELD_TYPES.INPUT,
                    label: "Email",
                    required: true,
                    grid: { xs: 24, md: 12 },
                    rules: [{ type: "email" }],
                },
                {
                    name: "user.phones",
                    type: FIELD_TYPES.FORM_LIST,
                    label: "Phone Numbers",
                    grid: { xs: 24 },
                    formList: {
                        min: 1,
                        max: 3,
                        addText: "Add Phone",
                        template: [
                            {
                                name: "type",
                                type: FIELD_TYPES.SELECT,
                                label: "Type",
                                required: true,
                                options: [
                                    { label: "Mobile", value: "mobile" },
                                    { label: "Home", value: "home" },
                                    { label: "Work", value: "work" },
                                ],
                                grid: { xs: 24, md: 8 },
                            },
                            {
                                name: "number",
                                type: FIELD_TYPES.INPUT,
                                label: "Number",
                                required: true,
                                grid: { xs: 24, md: 16 },
                            },
                        ],
                    },
                },
            ],
        },
        {
            title: "Addresses",
            icon: <ShopOutlined />,
            fields: [
                {
                    name: "addresses",
                    type: FIELD_TYPES.FORM_LIST,
                    label: "Addresses",
                    grid: { xs: 24 },
                    formList: {
                        min: 1,
                        max: 5,
                        addText: "Add Address",
                        template: [
                            {
                                name: "type",
                                type: FIELD_TYPES.SELECT,
                                label: "Address Type",
                                required: true,
                                options: [
                                    { label: "Home", value: "home" },
                                    { label: "Work", value: "work" },
                                    { label: "Other", value: "other" },
                                ],
                                grid: { xs: 24, md: 8 },
                            },
                            {
                                name: "addressLine1",
                                type: FIELD_TYPES.INPUT,
                                label: "Address Line 1",
                                required: true,
                                grid: { xs: 24, md: 16 },
                            },
                            {
                                name: "addressLine2",
                                type: FIELD_TYPES.INPUT,
                                label: "Address Line 2",
                                grid: { xs: 24, md: 16 },
                            },
                            {
                                name: "city",
                                type: FIELD_TYPES.INPUT,
                                label: "City",
                                required: true,
                                grid: { xs: 24, md: 8 },
                            },
                            {
                                name: "state",
                                type: FIELD_TYPES.INPUT,
                                label: "State/Province",
                                grid: { xs: 24, md: 8 },
                            },
                            {
                                name: "zip",
                                type: FIELD_TYPES.INPUT,
                                label: "ZIP/Postal Code",
                                required: true,
                                grid: { xs: 24, md: 8 },
                            },
                            {
                                name: "country",
                                type: FIELD_TYPES.SELECT,
                                label: "Country",
                                required: true,
                                options: [
                                    { label: "USA", value: "usa" },
                                    { label: "Canada", value: "canada" },
                                    { label: "UK", value: "uk" },
                                    { label: "Australia", value: "australia" },
                                ],
                                grid: { xs: 24, md: 8 },
                            },
                        ],
                    },
                },
            ],
        },
        {
            title: "Employment History",
            fields: [
                {
                    name: "employment",
                    type: FIELD_TYPES.FORM_LIST,
                    label: "Employment Records",
                    grid: { xs: 24 },
                    formList: {
                        min: 0,
                        max: 5,
                        addText: "Add Employment",
                        template: [
                            {
                                name: "company",
                                type: FIELD_TYPES.INPUT,
                                label: "Company Name",
                                required: true,
                                grid: { xs: 24, md: 12 },
                            },
                            {
                                name: "position",
                                type: FIELD_TYPES.INPUT,
                                label: "Position",
                                required: true,
                                grid: { xs: 24, md: 12 },
                            },
                            {
                                name: "startDate",
                                type: FIELD_TYPES.DATE_PICKER,
                                label: "Start Date",
                                required: true,
                                grid: { xs: 24, md: 8 },
                                props: { format: "YYYY-MM-DD" },
                            },
                            {
                                name: "endDate",
                                type: FIELD_TYPES.DATE_PICKER,
                                label: "End Date",
                                grid: { xs: 24, md: 8 },
                                props: { format: "YYYY-MM-DD" },
                            },
                            {
                                name: "responsibilities",
                                type: FIELD_TYPES.INPUT_TEXT_AREA,
                                label: "Responsibilities",
                                grid: { xs: 24 },
                                props: { rows: 2 },
                            },
                        ],
                    },
                },
            ],
        },
        {
            title: "References",
            fields: [
                {
                    name: "references",
                    type: FIELD_TYPES.FORM_LIST,
                    label: "References",
                    grid: { xs: 24 },
                    formList: {
                        min: 0,
                        max: 3,
                        addText: "Add Reference",
                        template: [
                            {
                                name: "name",
                                type: FIELD_TYPES.INPUT,
                                label: "Name",
                                required: true,
                                grid: { xs: 24, md: 12 },
                            },
                            {
                                name: "relationship",
                                type: FIELD_TYPES.INPUT,
                                label: "Relationship",
                                required: true,
                                grid: { xs: 24, md: 12 },
                            },
                            {
                                name: "contact",
                                type: FIELD_TYPES.INPUT,
                                label: "Contact Info",
                                required: true,
                                grid: { xs: 24, md: 12 },
                            },
                        ],
                    },
                },
            ],
        },
    ],
};

// 8. Multi-Step Form with Sections
export const multiStepSectionsFormSchema: FormSchema = {
    layout: "vertical",
    size: "middle",
    ui: {
        showProgress: true,
    },
    steps: [
        {
            title: "Personal Information",
            description: "Tell us about yourself",
            icon: <UserOutlined />,
            fields: [
                {
                    name: "fullName",
                    type: "input",
                    label: "Full Name",
                    required: true,
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "email",
                    type: "input",
                    label: "Email Address",
                    required: true,
                    grid: { xs: 24, md: 12 },
                    rules: [{ type: "email" }],
                },
                {
                    name: "phoneNumber",
                    type: "input",
                    label: "Phone Number",
                    grid: { xs: 24, md: 12 },
                },
                {
                    name: "dateOfBirth",
                    type: "date_picker",
                    label: "Date of Birth",
                    grid: { xs: 24, md: 12 },
                    props: { format: "YYYY-MM-DD" },
                },
            ],
        },
        {
            title: "Education",
            description: "Your educational background",
            icon: <ShopOutlined />,
            fields: [
                {
                    name: "highestDegree",
                    type: "select",
                    label: "Highest Degree",
                    required: true,
                    grid: { xs: 24, md: 12 },
                    options: [
                        { label: "High School", value: "high_school" },
                        { label: "Associate's Degree", value: "associate" },
                        { label: "Bachelor's Degree", value: "bachelor" },
                        { label: "Master's Degree", value: "master" },
                        { label: "Doctorate", value: "doctorate" },
                        { label: "Other", value: "other" },
                    ],
                },
                {
                    name: "fieldOfStudy",
                    type: "input",
                    label: "Field of Study",
                    grid: { xs: 24, md: 12 },
                    dependencies: [
                        {
                            type: "show_if",
                            conditions: [{ field: "highestDegree", operator: "is_not_empty", value: "" }],
                        },
                        {
                            type: "required_if",
                            conditions: [{ field: "highestDegree", operator: "is_not_empty", value: "" }],
                        },
                        {
                            type: "custom",
                            conditions: [{ field: "highestDegree", operator: "equals", value: "other" }],
                            callback: (form, values) => {
                                if (values.highestDegree === "other" && !values.fieldOfStudy) {
                                    form.setFields([
                                        {
                                            name: "fieldOfStudy",
                                            errors: ["Field of Study is required for 'Other' degree"],
                                        },
                                    ]);
                                }
                            },
                        },
                    ],
                },
                {
                    name: "graduationYear",
                    type: "date_picker",
                    label: "Graduation Year",
                    grid: { xs: 24, md: 12 },
                    props: {
                        picker: "year",
                        format: "YYYY",
                    },
                },
            ],
        },
        {
            title: "Work Experience",
            description: "Your professional experience",
            icon: <EditOutlined />,
            fields: [
                // Current Employment group
                {
                    name: "currentEmploymentGroup",
                    type: "divider",
                    label: "Current Employment",
                },
                {
                    name: "currentEmploymentDescription",
                    type: "text",
                    label: "Information about your current job",
                },
                {
                    name: "currentlyEmployed",
                    type: "segmented",
                    label: "Are you currently employed?",
                    required: true,
                    grid: { xs: 24 },
                    options: [
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                    ],
                },
                {
                    name: "currentEmployer",
                    type: "input",
                    label: "Current Employer",
                    grid: { xs: 24, md: 12 },
                    dependencies: [
                        {
                            type: "show_if",
                            conditions: [{ field: "currentlyEmployed", operator: "equals", value: true }],
                        },
                        {
                            type: "required_if",
                            conditions: [{ field: "currentlyEmployed", operator: "equals", value: true }],
                        },
                    ],
                },
                {
                    name: "currentPosition",
                    type: "input",
                    label: "Current Position",
                    grid: { xs: 24, md: 12 },
                    dependencies: [
                        {
                            type: "show_if",
                            conditions: [{ field: "currentlyEmployed", operator: "equals", value: true }],
                        },
                        {
                            type: "required_if",
                            conditions: [{ field: "currentlyEmployed", operator: "equals", value: true }],
                        },
                    ],
                },

                // Work History group
                {
                    name: "workHistoryGroup",
                    type: "divider",
                    label: "Work History",
                },
                {
                    name: "workHistoryDescription",
                    type: "text",
                    label: "Your previous employment history",
                },
                {
                    name: "workExperience",
                    type: "form.list",
                    label: "Previous Employment",
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
                                grid: { xs: 24, md: 12 },
                                props: {
                                    format: "YYYY-MM",
                                    picker: "month",
                                },
                            },
                            {
                                name: "endDate",
                                type: "date_picker",
                                label: "End Date",
                                grid: { xs: 24, md: 12 },
                                props: {
                                    format: "YYYY-MM",
                                    picker: "month",
                                },
                            },
                            {
                                name: "responsibilities",
                                type: "input.text_area",
                                label: "Responsibilities",
                                grid: { xs: 24 },
                                props: { rows: 3 },
                            },
                        ],
                    },
                },
            ],
        },
        {
            title: "Documents & Submission",
            description: "Upload required documents and review",
            icon: <UploadOutlined />,
            fields: [
                // Document Upload group
                {
                    name: "documentUploadGroup",
                    type: "divider",
                    label: "Document Upload",
                },
                {
                    name: "documentUploadDescription",
                    type: "text",
                    label: "Upload your documents",
                },
                {
                    name: "resume",
                    type: "upload",
                    label: "Resume/CV",
                    required: true,
                    grid: { xs: 24, md: 12 },
                    props: {
                        accept: ".pdf,.doc,.docx",
                        maxCount: 1,
                        listType: "text",
                    },
                },
                {
                    name: "coverLetter",
                    type: "upload",
                    label: "Cover Letter",
                    grid: { xs: 24, md: 12 },
                    props: {
                        accept: ".pdf,.doc,.docx",
                        maxCount: 1,
                        listType: "text",
                    },
                },
                {
                    name: "additionalDocuments",
                    type: "upload.dragger",
                    label: "Additional Documents",
                    grid: { xs: 24 },
                    props: {
                        multiple: true,
                        maxCount: 5,
                        accept: ".pdf,.doc,.docx,.jpg,.png",
                    },
                },

                // Final Confirmation group
                {
                    name: "finalConfirmationGroup",
                    type: "divider",
                    label: "Final Confirmation",
                },
                {
                    name: "finalConfirmationDescription",
                    type: "text",
                    label: "Review and confirm your application",
                },
                {
                    name: "termsAgreement",
                    type: "checkbox",
                    label: "I certify that the information provided is true and accurate",
                    required: true,
                    grid: { xs: 24 },
                },
                {
                    name: "preferredContact",
                    type: "radio.group",
                    label: "Preferred Contact Method",
                    required: true,
                    grid: { xs: 24 },
                    options: [
                        { label: "Email", value: "email" },
                        { label: "Phone", value: "phone" },
                        { label: "Either", value: "either" },
                    ],
                },
            ],
        },
    ],
};
