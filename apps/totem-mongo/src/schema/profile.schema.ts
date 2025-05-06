import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Branch } from './branch.schema';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  address: string;

  @Prop()
  zipcode: string;

  @Prop()
  city: string;

  @Prop()
  mail: string;

  @Prop()
  phoneNumber: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' })
  branch: Types.ObjectId | Branch;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
