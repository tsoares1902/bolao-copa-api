import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { UpdateMeInput } from '@src/modules/auth/application/dto/input/update-me.input';
import type { UpdateMeUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/update-me.use-case.interface';
import { USER_REPOSITORY_INTERFACE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { UserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/user.repository.interface';
import type { UserOutput } from '@src/modules/user/application/dto/output/user.output';
import { UserOutputMapper } from '@src/modules/user/application/mappers/user-output.mapper';

@Injectable()
export class UpdateMeUseCase implements UpdateMeUseCaseInterface {
  constructor(
    @Inject(USER_REPOSITORY_INTERFACE)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(input: UpdateMeInput): Promise<UserOutput> {
    const user = await this.userRepository.update({
      userId: input.userId,
      name: input.name,
      alias: input.alias,
      phone: input.phone,
      media: input.media,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserOutputMapper.toOutput(user);
  }
}
