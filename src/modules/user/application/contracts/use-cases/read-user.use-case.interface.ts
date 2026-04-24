import { ReadUserInput } from '@src/modules/user/application/dto/input/read-user.input';
import { UserOutput } from '@src/modules/user/application/dto/output/user.output';

export interface ReadUserUseCaseInterface {
  execute(input: ReadUserInput): Promise<UserOutput>;
}
