/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class ProfileBadge {
  @Prop({ type: Types.ObjectId, ref: 'Badge', required: true })
  badge: Types.ObjectId;

  @Prop({ default: Date.now })
  date_earned: Date;

  @Prop({ min: 0, max: 100, default: 0 })
  progress: number;

  @Prop({ default: 'Non acquis' })
  status: string
}

export const ProfileBadgeSchema = SchemaFactory.createForClass(ProfileBadge);
