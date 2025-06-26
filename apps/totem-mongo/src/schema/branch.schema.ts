import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

  @Prop({ default: null })
  removed_at: Date;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);

// Champ virtuel pour les Badges
BranchSchema.virtual('badges', {
  ref: 'Badge',
  localField: '_id',
  foreignField: 'branch',
});
