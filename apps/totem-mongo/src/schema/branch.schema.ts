import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Badge } from './badge.schema';

export type BranchDocument = HydratedDocument<Branch>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Branch {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  color: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  range_age: string;

  @Prop()
  is_active: boolean;

  @Prop({ default: null })
  removed_at: Date;

  @Prop({ default: false })
  is_deleted: boolean;

  badges?: Badge[];
}

export const BranchSchema = SchemaFactory.createForClass(Branch);

// Champ virtuel pour les Badges
BranchSchema.virtual('badges', {
  ref: 'Badge',
  localField: '_id',
  foreignField: 'branch',
});
