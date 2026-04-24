import { ActivationCodeType } from '@src/modules/auth/domain/enums/activation-code-type.enum';

export class ActivationCodeEntity {
  _id!: string;
  phone!: string;
  code!: string;
  type!: ActivationCodeType;
  expiresAt!: Date;
  isUsed!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
