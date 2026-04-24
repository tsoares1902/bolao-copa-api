import { SignOutInput } from '@src/modules/auth/application/dto/input/sign-out.input';

export interface SignOutUseCaseInterface {
  execute(input: SignOutInput): Promise<void>;
}
