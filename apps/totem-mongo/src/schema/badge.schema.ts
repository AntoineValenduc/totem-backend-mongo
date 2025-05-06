import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BadgeDocument = HydratedDocument<Badge>;

@Schema({ timestamps: true })
export class Badge {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  photo: string;

  @Prop()
  progress: number;

  @Prop()
  status: string;

  @Prop()
  dateEarned: Date;
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
