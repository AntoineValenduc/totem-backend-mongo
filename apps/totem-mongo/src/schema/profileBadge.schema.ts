/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProfileBadgeDocument = HydratedDocument<ProfileBadge>;
@Schema()
export class ProfileBadge {
  @Prop({ type: Types.ObjectId, ref: 'Badge', required: true })
  badge: Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  date_earned: Date;

  @Prop({ min: 0, max: 100, default: 0 })
  progress: number;

  @Prop({ required: true, default: 'Non acquis' })
  status: string
}

export const ProfileBadgeSchema = SchemaFactory.createForClass(ProfileBadge);
