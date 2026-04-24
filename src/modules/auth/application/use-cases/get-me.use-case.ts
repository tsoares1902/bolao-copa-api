import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { GetMeUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/get-me.use-case.interface';
import { USER_REPOSITORY_INTERFACE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { UserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/user.repository.interface';
import type { UserOutput } from '@src/modules/user/application/dto/output/user.output';
import { UserOutputMapper } from '@src/modules/user/application/mappers/user-output.mapper';

@Injectable()
export class GetMeUseCase implements GetMeUseCaseInterface {
  constructor(
    @Inject(USER_REPOSITORY_INTERFACE)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(userId: string): Promise<UserOutput> {
    const user = await this.userRepository.read(userId);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return UserOutputMapper.toOutput(user);
  }
}
