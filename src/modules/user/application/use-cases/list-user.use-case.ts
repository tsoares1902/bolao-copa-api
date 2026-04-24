import { Inject, Injectable } from '@nestjs/common';

import { USER_REPOSITORY_INTERFACE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { UserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/user.repository.interface';
import { ListUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/list-user.use-case.interface';
import { UserOutput } from '@src/modules/user/application/dto/output/user.output';
import { UserOutputMapper } from '@src/modules/user/application/mappers/user-output.mapper';

@Injectable()
export class ListUserUseCase implements ListUserUseCaseInterface {
  constructor(
    @Inject(USER_REPOSITORY_INTERFACE)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(): Promise<UserOutput[]> {
    const users = await this.userRepository.list();

    return UserOutputMapper.toOutputList(users);
  }
}
