import { DeleteUserInput } from '@src/modules/user/application/dto/input/delete-user.input';

export interface DeleteUserUseCaseInterface {
  execute(input: DeleteUserInput): Promise<void>;
}
