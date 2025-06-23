import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Badge } from './badge.schema';
import { Profile } from '../schema/profile.schema';

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

  @Prop()
  is_active: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' })
  badge: Badge[];

  @Prop({ default: null })
  removed_at: Date;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  profile: Profile[];
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
