import { UserOutput } from '@src/modules/user/application/dto/output/user.output';

export interface GetMeUseCaseInterface {
  execute(userId: string): Promise<UserOutput>;
}
