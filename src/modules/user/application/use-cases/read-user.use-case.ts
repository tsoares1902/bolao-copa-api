import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { USER_REPOSITORY_INTERFACE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { UserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/user.repository.interface';
import { ReadUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/read-user.use-case.interface';
import { ReadUserInput } from '@src/modules/user/application/dto/input/read-user.input';
import { UserOutput } from '@src/modules/user/application/dto/output/user.output';
import { UserOutputMapper } from '@src/modules/user/application/mappers/user-output.mapper';

@Injectable()
export class ReadUserUseCase implements ReadUserUseCaseInterface {
  constructor(
    @Inject(USER_REPOSITORY_INTERFACE)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(input: ReadUserInput): Promise<UserOutput> {
    const user = await this.userRepository.read(input.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserOutputMapper.toOutput(user);
  }
}
