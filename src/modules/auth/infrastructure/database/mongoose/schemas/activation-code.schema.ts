import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ActivationCodeType } from '@src/modules/auth/domain/enums/activation-code-type.enum';

export type ActivationCodeDocument = HydratedDocument<ActivationCodeSchema>;

@Schema({
  collection: 'activation_codes',
  timestamps: true,
})
export class ActivationCodeSchema {
  @Prop({
    required: true,
    trim: true,
  })
  phone!: string;

  @Prop({
    required: true,
    trim: true,
  })
  code!: string;

  @Prop({
    required: true,
    enum: ActivationCodeType,
  })
  type!: ActivationCodeType;

  @Prop({
    required: true,
    default: false,
  })
  isUsed!: boolean;

  @Prop({
    required: true,
    expires: 0,
  })
  expiresAt!: Date;
}

export const ActivationCodeSchemaFactory =
  SchemaFactory.createForClass(ActivationCodeSchema);
