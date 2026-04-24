import { SignInInput } from '@src/modules/auth/application/dto/input/sign-in.input';
import { AuthTokenOutput } from '@src/modules/auth/application/dto/output/auth-token.output';

export interface SignInUseCaseInterface {
  execute(input: SignInInput): Promise<AuthTokenOutput>;
}
