import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// mongodb

export type TestDocument = Test & Document;

@Schema({ timestamps: true })
export class Test {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ default: false })
    isActive: boolean;

    @Prop({ type: Number, default: 0 })
    count: number;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    createdBy: MongooseSchema.Types.ObjectId;
}

export const TestSchema = SchemaFactory.createForClass(Test);
