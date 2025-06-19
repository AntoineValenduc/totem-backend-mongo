import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Branch } from './branch.schema';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {

  @Prop({ required: true })
  user_id: string;
  @Prop({ required: true })
  first_name: string;
  @Prop({ required: true })
  last_name: string;
  @Prop({ required: true })
  date_of_birth: Date;
  @Prop({ required: true })
  address: string;
  @Prop({ required: true })
  zipcode: string;
  @Prop({ required: true })
  city: string;
  @Prop({ required: true })
  email: string;
  @Prop()
  phone_number: string;
  @Prop()
  photo_url: string;
  @Prop()
  created_at: Date;
  @Prop()
  updated_at: Date;
  @Prop({ default: null })
  removed_at: Date;
  @Prop({ default: false })
  is_deleted: boolean;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true })
  branch: Types.ObjectId | Branch;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
