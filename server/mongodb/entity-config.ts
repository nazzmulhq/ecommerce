import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Base entity interface that all entities will implement
export interface BaseEntity {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    status?: string;
    metadata?: Record<string, any>;
}

// Document type for EntityConfig
export type EntityConfigDocument = EntityConfig & Document;

@Schema({ timestamps: true })
export class EntityConfig implements BaseEntity {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true, unique: true })
    slug: string;

    @Prop({ type: String })
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'Project' })
    projectId?: Types.ObjectId;

    @Prop({ type: String, required: true })
    displayName: string;

    @Prop({ type: String })
    pluralName: string;

    @Prop({ type: String })
    icon?: string;

    @Prop({
        type: String,
        enum: ['collection', 'singleton', 'lookup', 'relation', 'embedded'],
        required: true,
        default: 'collection',
    })
    entityType: string;

    @Prop({ type: Boolean, default: true })
    isVisible: boolean;

    @Prop({ type: Boolean, default: true })
    isSearchable: boolean;

    // UI Configuration for CRUD operations
    @Prop({ type: Object })
    ui: {
        listView?: {
            defaultColumns?: string[];
            availableColumns?: string[];
            defaultFilters?: Record<string, any>;
            defaultSort?: { field: string; direction: 'asc' | 'desc' };
            actionsConfig?: {
                view?: boolean;
                edit?: boolean;
                delete?: boolean;
                duplicate?: boolean;
                export?: boolean;
            };
            batchActions?: string[];
            rowSelection?: boolean;
        };
        formView?: {
            layout?: 'horizontal' | 'vertical' | 'inline';
            labelCol?: { span: number };
            wrapperCol?: { span: number };
            size?: 'small' | 'middle' | 'large';
            defaultValues?: Record<string, any>;
        };
        detailView?: {
            layout?: 'single' | 'tabbed' | 'sectioned';
            sections?: { title: string; fields: string[] }[];
            tabs?: { key: string; title: string; fields: string[] }[];
        };
        crudType?: 'modal' | 'drawer' | 'page';
    };

    // Field Definitions
    @Prop({ type: Array, required: true })
    fields: [
        {
            name: string;
            type: string;
            label: string;
            description?: string;
            required?: boolean;
            unique?: boolean;
            default?: any;
            tooltip?: string;
            placeholder?: string;
            hidden?: boolean;
            immutable?: boolean;
            readOnly?: boolean;
            filterable?: boolean;
            sortable?: boolean;
            searchable?: boolean;
            hideInTable?: boolean;
            hideInForm?: boolean;
            hideInDetail?: boolean;
            grid?: {
                xs?: number;
                sm?: number;
                md?: number;
                lg?: number;
                xl?: number;
            };
            validation?: {
                min?: number;
                max?: number;
                pattern?: string;
                message?: string;
                enum?: any[];
                custom?: string;
            }[];
            options?: {
                value: any;
                label: string;
                disabled?: boolean;
                children?: any[];
            }[];
            relationConfig?: {
                ref: string;
                foreignField?: string;
                displayField?: string;
                multiple?: boolean;
                inline?: boolean;
            };
            uploadConfig?: {
                accept?: string;
                maxSize?: number;
                maxCount?: number;
                listType?: 'text' | 'picture' | 'picture-card';
                directory?: boolean;
            };
            formListConfig?: {
                min?: number;
                max?: number;
                addButtonText?: string;
                initialCount?: number;
                nestFields?: any[];
            };
            dependencyRules?: {
                type: 'show' | 'hide' | 'require' | 'disable' | 'custom';
                conditions: {
                    field: string;
                    operator: string;
                    value: any;
                }[];
                logic?: 'AND' | 'OR';
            }[];
            transformations?: {
                input?: string; // Function name to transform input data
                output?: string; // Function name to transform output data
            };
            ui?: {
                component?: string;
                props?: Record<string, any>;
                className?: string;
                style?: Record<string, any>;
                renderType?: 'default' | 'custom';
                formatter?: string; // Function name for custom formatting
            };
        },
    ];

    // Virtual fields (calculated/computed fields)
    @Prop({ type: Array })
    virtualFields?: [
        {
            name: string;
            type: string;
            label: string;
            description?: string;
            dependencies: string[];
            computation: string; // Function name for computation
            caching?: boolean;
        },
    ];

    // Indexes for optimizing queries
    @Prop({ type: Array })
    indexes?: [
        {
            fields: Record<string, 1 | -1>;
            options?: {
                unique?: boolean;
                sparse?: boolean;
                background?: boolean;
                name?: string;
            };
        },
    ];

    // Hooks for lifecycle events
    @Prop({ type: Object })
    hooks?: {
        beforeCreate?: string;
        afterCreate?: string;
        beforeUpdate?: string;
        afterUpdate?: string;
        beforeDelete?: string;
        afterDelete?: string;
        beforeFind?: string;
        afterFind?: string;
    };

    // Permissions configuration
    @Prop({ type: Object })
    permissions?: {
        read?: string[];
        create?: string[];
        update?: string[];
        delete?: string[];
        fields?: Record<string, { read?: string[]; write?: string[] }>;
    };

    // Workflow states
    @Prop({ type: Array })
    workflowStates?: [
        {
            name: string;
            label: string;
            color?: string;
            description?: string;
            isInitial?: boolean;
            isFinal?: boolean;
            transitions?: {
                to: string;
                label: string;
                roles?: string[];
                conditions?: string;
                actions?: string[];
            }[];
        },
    ];

    // API configuration
    @Prop({ type: Object })
    api?: {
        basePath?: string;
        enabled?: boolean;
        methods?: {
            findAll?: boolean;
            findOne?: boolean;
            create?: boolean;
            update?: boolean;
            delete?: boolean;
            bulkCreate?: boolean;
            bulkUpdate?: boolean;
            bulkDelete?: boolean;
        };
        custom?: {
            name: string;
            path: string;
            method: string;
            handler: string;
            description?: string;
        }[];
    };

    // Statistics display configuration
    @Prop({ type: Array })
    statistics?: [
        {
            key: string;
            label: string;
            computation: string;
            icon?: string;
            color?: string;
        },
    ];

    // Section/group definitions
    @Prop({ type: Array })
    sections?: [
        {
            title: string;
            description?: string;
            icon?: string;
            collapsible?: boolean;
            defaultCollapsed?: boolean;
            fields: string[];
        },
    ];

    // Tab definitions
    @Prop({ type: Array })
    tabs?: [
        {
            key: string;
            title: string;
            icon?: string;
            fields: string[];
        },
    ];

    // Step definitions for wizard forms
    @Prop({ type: Array })
    steps?: [
        {
            title: string;
            description?: string;
            icon?: string;
            fields: string[];
            validation?: string;
        },
    ];

    // Relationships with other entities
    @Prop({ type: Array })
    relations?: [
        {
            name: string;
            type: 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany';
            target: string;
            foreignKey?: string;
            localKey?: string;
            through?: string;
            as?: string;
            cascadeDelete?: boolean;
        },
    ];

    // Views for presenting the entity data
    @Prop({ type: Array })
    views?: [
        {
            name: string;
            type:
                | 'list'
                | 'detail'
                | 'kanban'
                | 'calendar'
                | 'chart'
                | 'custom';
            title: string;
            description?: string;
            icon?: string;
            config: Record<string, any>;
        },
    ];

    // Status configuration
    @Prop({
        type: String,
        enum: ['active', 'inactive', 'draft', 'archived', 'deprecated'],
        default: 'active',
    })
    status: string;

    // Version control
    @Prop({ type: String, required: true, default: '1.0.0' })
    version: string;

    // General metadata
    @Prop({ type: Object })
    metadata?: Record<string, any>;

    // Audit fields
    @Prop({ type: String })
    createdBy?: string;

    @Prop({ type: String })
    updatedBy?: string;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export const EntityConfigSchema = SchemaFactory.createForClass(EntityConfig);

// Add indexes
EntityConfigSchema.index({ slug: 1 }, { unique: true });
EntityConfigSchema.index({ projectId: 1, name: 1 }, { unique: true });
EntityConfigSchema.index({ status: 1 });
EntityConfigSchema.index({ 'fields.name': 1 });

// Document type for EntityData
export type EntityDataDocument = EntityData & Document;

@Schema({ timestamps: true, strict: false })
export class EntityData implements BaseEntity {
    @Prop({ type: Types.ObjectId, ref: 'EntityConfig', required: true })
    entityConfigId: Types.ObjectId;

    // Dynamic fields will be added based on the EntityConfig
    // The schema is set to strict: false to allow dynamic fields

    @Prop({
        type: String,
        enum: ['active', 'inactive', 'draft', 'archived', 'deleted'],
        default: 'active',
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

    // Audit history
    @Prop({ type: Array })
    auditLog?: [
        {
            action: string;
            timestamp: Date;
            user: string;
            changes: Record<string, { oldValue: any; newValue: any }>;
            metadata?: Record<string, any>;
        },
    ];
}

export const EntityDataSchema = SchemaFactory.createForClass(EntityData);

// Add indexes for EntityData
EntityDataSchema.index({ entityConfigId: 1 });
EntityDataSchema.index({ status: 1 });
EntityDataSchema.index({ createdAt: 1 });
EntityDataSchema.index({ updatedAt: 1 });
