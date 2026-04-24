import { ActivateAccountInput } from '@src/modules/auth/application/dto/input/activate-account.input';

export interface ActivateAccountUseCaseInterface {
  execute(input: ActivateAccountInput): Promise<void>;
}
