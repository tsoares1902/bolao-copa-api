import { ActivationCodeEntity } from '@src/modules/auth/domain/entities/activation-code.entity';
import { ActivationCodeType } from '@src/modules/auth/domain/enums/activation-code-type.enum';

export interface ActivationCodeRepositoryInterface {
  create(
    input: Omit<ActivationCodeEntity, '_id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ActivationCodeEntity>;

  findValidByPhoneAndCode(input: {
    phone: string;
    code: string;
    type: ActivationCodeType;
  }): Promise<ActivationCodeEntity | null>;

  invalidateAllByPhone(input: {
    phone: string;
    type: ActivationCodeType;
  }): Promise<void>;

  markAsUsed(activationCodeId: string): Promise<void>;
}
