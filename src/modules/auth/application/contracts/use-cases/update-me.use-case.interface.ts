import { UpdateMeInput } from '@src/modules/auth/application/dto/input/update-me.input';
import { UserOutput } from '@src/modules/user/application/dto/output/user.output';

export interface UpdateMeUseCaseInterface {
  execute(input: UpdateMeInput): Promise<UserOutput>;
}
