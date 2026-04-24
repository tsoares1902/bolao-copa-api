import { RefreshInput } from '@src/modules/auth/application/dto/input/refresh.input';
import { AuthTokenOutput } from '@src/modules/auth/application/dto/output/auth-token.output';

export interface RefreshUseCaseInterface {
  execute(input: RefreshInput): Promise<AuthTokenOutput>;
}
