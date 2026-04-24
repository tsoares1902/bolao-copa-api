import { UserOutput } from '@src/modules/user/application/dto/output/user.output';

export interface ListUserUseCaseInterface {
  execute(): Promise<UserOutput[]>;
}
