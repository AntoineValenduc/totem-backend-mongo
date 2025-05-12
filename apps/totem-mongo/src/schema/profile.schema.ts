import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Branch } from './branch.schema';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  date_of_birth: Date;

  @Prop()
  address: string;

  @Prop()
  zipcode: string;

  @Prop()
  city: string;

  @Prop()
  mail: string;

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' })
  branch: Types.ObjectId | Branch;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
