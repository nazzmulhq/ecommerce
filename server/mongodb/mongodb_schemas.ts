// schemas/project.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  slug: string;

  @Prop({ type: String })
  icon?: string;

  @Prop({ type: String })
  logo?: string;

  @Prop({ type: String })
  description: string;

  @Prop({ 
    type: String, 
    enum: ['active', 'archived', 'draft'], 
    default: 'active' 
  })
  status: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ type: Object })
  permissions?: {
    read?: string[];
    write?: string[];
    admin?: string[];
  };

  @Prop({ type: String })
  createdBy?: string;

  @Prop({ type: String })
  updatedBy?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

// schemas/route.schema.ts
export type RouteDocument = Route & Document;

@Schema({ timestamps: true })
export class Route {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  slug: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  path: string;

  @Prop({ type: String })
  icon?: string;

  @Prop({ 
    type: String, 
    enum: ['active', 'archived', 'draft'], 
    default: 'active' 
  })
  status: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ type: Object })
  permissions?: {
    read?: string[];
    write?: string[];
    admin?: string[];
  };

  @Prop({ type: Number, default: 0 })
  sortOrder: number;

  @Prop({ type: String })
  createdBy?: string;

  @Prop({ type: String })
  updatedBy?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const RouteSchema = SchemaFactory.createForClass(Route);

// schemas/component.schema.ts
export type ComponentDocument = Component & Document;

@Schema({ timestamps: true })
export class Component {
  @Prop({ type: Types.ObjectId, ref: 'Route', required: true })
  routeId: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  slug: string;

  @Prop({ 
    type: String, 
    enum: ['form', 'table', 'chart', 'card', 'list', 'dashboard', 'crud', 'custom'],
    required: true 
  })
  type: string;

  @Prop({ type: String })
  description: string;

  @Prop({ 
    type: String, 
    enum: ['active', 'archived', 'draft'], 
    default: 'active' 
  })
  status: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ type: Object })
  permissions?: {
    read?: string[];
    write?: string[];
    admin?: string[];
  };

  @Prop({ type: Number, default: 0 })
  sortOrder: number;

  @Prop({ type: String })
  createdBy?: string;

  @Prop({ type: String })
  updatedBy?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const ComponentSchema = SchemaFactory.createForClass(Component);

// schemas/form-config.schema.ts
export type FormConfigDocument = FormConfig & Document;

@Schema({ timestamps: true })
export class FormConfig {
  @Prop({ type: Types.ObjectId, ref: 'Component', required: true })
  componentId: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, required: true })
  version: string;

  // Form Schema Configuration based on your FormSchema interface
  @Prop({ 
    type: Object,
    required: true
  })
  schema: {
    layout?: 'horizontal' | 'vertical' | 'inline';
    size?: 'small' | 'middle' | 'large';
    colon?: boolean;
    labelAlign?: 'left' | 'right';
    labelCol?: object;
    wrapperCol?: object;
    fields?: any[];
    sections?: any[];
    steps?: any[];
    tabs?: any[];
    permissions?: {
      read?: boolean;
      write?: boolean;
      delete?: boolean;
      fields?: Record<string, { read?: boolean; write?: boolean }>;
    };
    meta?: {
      version?: string;
      createdAt?: string;
      updatedAt?: string;
      createdBy?: string;
      title?: string;
      description?: string;
      category?: string;
      tags?: string[];
    };
    autoSave?: {
      enabled: boolean;
      interval?: number;
      key?: string;
    };
    validation?: {
      validateOnChange?: boolean;
      validateOnBlur?: boolean;
      validateTrigger?: string | string[];
      scrollToError?: boolean;
    };
    ui?: {
      theme?: 'default' | 'compact' | 'comfortable';
      showProgress?: boolean;
      showFieldCount?: boolean;
      compactMode?: boolean;
      floatingLabels?: boolean;
    };
  };

  @Prop({ 
    type: String, 
    enum: ['active', 'archived', 'draft'], 
    default: 'active' 
  })
  status: string;

  @Prop({ type: Boolean, default: false })
  isDefault: boolean;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ type: String })
  createdBy?: string;

  @Prop({ type: String })
  updatedBy?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const FormConfigSchema = SchemaFactory.createForClass(FormConfig);

// schemas/crud-config.schema.ts
export type CrudConfigDocument = CrudConfig & Document;

@Schema({ timestamps: true })
export class CrudConfig {
  @Prop({ type: Types.ObjectId, ref: 'Component', required: true })
  componentId: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, required: true })
  version: string;

  // CRUD Configuration based on your QuickUIProps interface
  @Prop({ 
    type: Object,
    required: true
  })
  config: {
    title: string;
    crudType?: 'modal' | 'drawer' | 'page';
    icon?: string;
    actions?: {
      view?: boolean;
      edit?: boolean;
      delete?: boolean;
    };
    showFilter?: boolean;
    searchFields?: string[];
    filterFields?: any[];
    confirmTexts?: {
      delete?: string;
      create?: string;
      update?: string;
    };
    successMessages?: {
      create?: string;
      update?: string;
      delete?: string;
    };
    statistics?: any[];
    rowSelection?: boolean;
    emptyText?: string;
    showToggleCrudType?: boolean;
    validateOnMount?: boolean;
    preserveFormData?: boolean;
    tableColumns?: any[];
    tableProps?: any;
    formProps?: any;
  };

  @Prop({ type: Types.ObjectId, ref: 'FormConfig' })
  formConfigId?: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: ['active', 'archived', 'draft'], 
    default: 'active' 
  })
  status: string;

  @Prop({ type: Boolean, default: false })
  isDefault: boolean;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ type: String })
  createdBy?: string;

  @Prop({ type: String })
  updatedBy?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const CrudConfigSchema = SchemaFactory.createForClass(CrudConfig);

// schemas/field-config.schema.ts
export type FieldConfigDocument = FieldConfig & Document;

@Schema({ timestamps: true })
export class FieldConfig {
  @Prop({ type: Types.ObjectId, ref: 'FormConfig', required: true })
  formConfigId: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  type: string; // Based on your FIELD_TYPES

  @Prop({ type: String })
  label?: string;

  @Prop({ type: String })
  placeholder?: string;

  @Prop({ type: String })
  tooltip?: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Boolean, default: false })
  required?: boolean;

  @Prop({ type: Boolean, default: false })
  disabled?: boolean;

  @Prop({ type: Boolean, default: false })
  hidden?: boolean;

  @Prop({ type: Boolean, default: false })
  readOnly?: boolean;

  @Prop({ type: Array })
  options?: any[];

  @Prop({ type: Boolean, default: false })
  filterable?: boolean;

  @Prop({ type: Object })
  defaultValue?: any;

  @Prop({ type: Object })
  initialValue?: any;

  @Prop({ type: Object })
  props?: Record<string, any>;

  @Prop({ type: Array })
  dependencies?: any[];

  @Prop({ type: Array })
  rules?: any[];

  @Prop({ type: Array })
  extras?: any[];

  @Prop({ type: Object })
  grid?: any;

  @Prop({ type: Object })
  style?: Record<string, any>;

  @Prop({ type: String })
  className?: string;

  @Prop({ type: Boolean, default: false })
  hideInTable?: boolean;

  @Prop({ type: Object })
  formList?: any;

  @Prop({ type: Array })
  conditionalGroups?: any[];

  @Prop({ type: Object })
  nestedForm?: any;

  @Prop({ type: Array })
  dataSource?: any[];

  @Prop({ type: Number })
  span?: number;

  @Prop({ type: Number })
  offset?: number;

  @Prop({ type: Number, default: 0 })
  order?: number;

  @Prop({ type: Object })
  flex?: string | number;

  @Prop({ type: Number })
  debounce?: number;

  @Prop({ type: Boolean, default: false })
  lazy?: boolean;

  @Prop({ type: Boolean, default: false })
  memoize?: boolean;

  @Prop({ 
    type: String, 
    enum: ['active', 'archived', 'draft'], 
    default: 'active' 
  })
  status: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ type: String })
  createdBy?: string;

  @Prop({ type: String })
  updatedBy?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const FieldConfigSchema = SchemaFactory.createForClass(FieldConfig);

// schemas/ui-template.schema.ts
export type UITemplateDocument = UITemplate & Document;

@Schema({ timestamps: true })
export class UITemplate {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ 
    type: String, 
    enum: ['form', 'crud', 'dashboard', 'page'], 
    required: true 
  })
  type: string;

  @Prop({ type: String })
  category?: string;

  @Prop({ type: Array })
  tags?: string[];

  @Prop({ type: Object, required: true })
  template: Record<string, any>;

  @Prop({ type: Object })
  preview?: {
    thumbnail?: string;
    screenshots?: string[];
    description?: string;
  };

  @Prop({ 
    type: String, 
    enum: ['public', 'private', 'organization'], 
    default: 'private' 
  })
  visibility: string;

  @Prop({ type: Number, default: 0 })
  usageCount: number;

  @Prop({ type: Number, default: 0 })
  rating: number;

  @Prop({ 
    type: String, 
    enum: ['active', 'archived', 'draft'], 
    default: 'active' 
  })
  status: string;

  @Prop({ type: String, required: true })
  version: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ type: String })
  createdBy?: string;

  @Prop({ type: String })
  updatedBy?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const UITemplateSchema = SchemaFactory.createForClass(UITemplate);