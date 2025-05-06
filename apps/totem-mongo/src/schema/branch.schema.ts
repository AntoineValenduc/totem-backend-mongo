import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Badge } from './badge.schema';

export type BranchDocument = HydratedDocument<Branch>;

@Schema({ timestamps: true })
export class Branch {
  @Prop()
  name: string;

  @Prop()
  color: string;

  @Prop()
  description: string;

  @Prop()
  range_age: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' })
  badge: Badge[];
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
