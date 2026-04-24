import { UpdateUserInput } from '@src/modules/user/application/dto/input/update-user.input';
import { UserOutput } from '@src/modules/user/application/dto/output/user.output';

export interface UpdateUserUseCaseInterface {
  execute(input: UpdateUserInput): Promise<UserOutput>;
}
