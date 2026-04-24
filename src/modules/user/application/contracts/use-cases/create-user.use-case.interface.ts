import { CreateUserInput } from '@src/modules/user/application/dto/input/create-user.input';
import { UserOutput } from '@src/modules/user/application/dto/output/user.output';

export interface CreateUserUseCaseInterface {
  execute(input: CreateUserInput): Promise<UserOutput>;
}
