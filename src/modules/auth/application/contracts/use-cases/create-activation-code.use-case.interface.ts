import { CreateActivationCodeInput } from '@src/modules/auth/application/dto/input/create-activation-code.input';

export interface CreateActivationCodeUseCaseInterface {
  execute(input: CreateActivationCodeInput): Promise<void>;
}
