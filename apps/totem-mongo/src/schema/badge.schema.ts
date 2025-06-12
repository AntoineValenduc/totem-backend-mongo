import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BadgeDocument = HydratedDocument<Badge>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
    },
  },
})
export class Badge {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ trim: true })
  logo_url: string;

  @Prop({ min: 0, max: 100, default: 0 }) // Progress between 0-100
  progress: number;

  @Prop({ trim: true })
  status: string;

  @Prop({ default: null })
  date_earned: Date;

  @Prop({ default: null })
  removed_at: Date;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branch: Types.ObjectId;
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
