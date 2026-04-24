import { SignUpInput } from '@src/modules/auth/application/dto/input/sign-up.input';

export interface SignUpUseCaseInterface {
  execute(input: SignUpInput): Promise<void>;
}
