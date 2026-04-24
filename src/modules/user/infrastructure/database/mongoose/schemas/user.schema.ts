import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserSchema>;

@Schema({ _id: false })
export class PhoneSchema {
  @Prop({
    required: true,
    trim: true,
  })
  number!: string;

  @Prop({
    required: true,
    default: true,
  })
  isWhatsapp!: boolean;
}

@Schema({ _id: false })
export class MediaSchema {
  @Prop({
    required: false,
    trim: true,
  })
  avatarUrl?: string;
}

@Schema({
  collection: 'users',
  timestamps: true,
})
export class UserSchema {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: false,
    trim: true,
  })
  alias?: string;

  @Prop({
    required: true,
  })
  password!: string;

  @Prop({
    required: true,
    type: PhoneSchema,
  })
  phone!: PhoneSchema;

  @Prop({
    required: false,
    type: MediaSchema,
  })
  media?: MediaSchema;

  @Prop({
    required: true,
    default: false,
  })
  isActive!: boolean;
}

export const UserSchemaFactory = SchemaFactory.createForClass(UserSchema);

UserSchemaFactory.index(
  {
    'phone.number': 1,
  },
  {
    unique: true,
  },
);
