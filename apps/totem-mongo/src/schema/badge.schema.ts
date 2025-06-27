import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BadgeDocument = HydratedDocument<Badge>;

@Schema({ timestamps: true })
export class Badge {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ trim: true })
  logo_url: string;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branch: Types.ObjectId;
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
