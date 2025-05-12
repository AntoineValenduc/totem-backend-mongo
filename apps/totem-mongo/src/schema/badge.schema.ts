import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Branch } from 'totem-mongo/src/schema/branch.schema';

export type BadgeDocument = HydratedDocument<Badge>;

@Schema({ timestamps: true })
export class Badge {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  logo_url: string;

  @Prop()
  progress: number;

  @Prop()
  status: string;

  @Prop()
  date_earned: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' })
  branch: Types.ObjectId | Branch;
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
