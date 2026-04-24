import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AuthSessionDocument = HydratedDocument<AuthSessionSchema>;

@Schema({
  collection: 'auth_sessions',
  timestamps: true,
})
export class AuthSessionSchema {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'UserSchema',
  })
  userId!: string;

  @Prop({
    required: true,
  })
  refreshToken!: string;

  @Prop({
    required: true,
    default: false,
  })
  isRevoked!: boolean;

  @Prop({
    required: true,
    expires: 0,
  })
  expiresAt!: Date;
}

export const AuthSessionSchemaFactory =
  SchemaFactory.createForClass(AuthSessionSchema);
